import { NextResponse } from "next/server";
import { blogRatingSchema } from "@/lib/blog-schema";
import { getPublishedPostBySlug } from "@/lib/blog";
import { getRatingSummary, insertRating } from "@/lib/blog-ratings";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;

const requestLog = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = requestLog.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    requestLog.set(ip, { count: 1, windowStart: now });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() ?? "unknown";
}

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return NextResponse.json({ error: "Article introuvable." }, { status: 404 });
  }

  try {
    const summary = await getRatingSummary(post.id);
    return NextResponse.json(summary);
  } catch (error) {
    console.error("[blog-ratings] Échec de la lecture :", error);
    return NextResponse.json({ error: "Notes indisponibles." }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Trop de tentatives. Merci de réessayer dans une minute." },
      { status: 429 },
    );
  }

  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return NextResponse.json({ error: "Article introuvable." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload JSON invalide." }, { status: 400 });
  }

  const parsed = blogRatingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Note invalide." }, { status: 400 });
  }

  try {
    const summary = await insertRating(post.id, parsed.data.rating);
    return NextResponse.json(summary);
  } catch (error) {
    console.error("[blog-ratings] Échec de l'enregistrement :", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Réessayez dans un instant." },
      { status: 500 },
    );
  }
}
