import { NextResponse } from "next/server";
import { newsletterSubscribeSchema } from "@/lib/newsletter-schema";
import { insertNewsletterSubscriber } from "@/lib/supabase";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;

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

export async function POST(request: Request) {
  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Trop de tentatives. Merci de réessayer dans une minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload JSON invalide." }, { status: 400 });
  }

  const parsed = newsletterSubscribeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
  }

  try {
    const { alreadySubscribed } = await insertNewsletterSubscriber(parsed.data.email);
    return NextResponse.json({ ok: true, alreadySubscribed });
  } catch (error) {
    console.error("[newsletter] Échec de l'enregistrement :", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Réessayez dans un instant." },
      { status: 500 },
    );
  }
}
