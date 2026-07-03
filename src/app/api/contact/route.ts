import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/contact";
import { sendContactMessage } from "@/lib/contact-server";

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

  const parsed = contactFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Formulaire invalide.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  if (parsed.data.honeypot) {
    return NextResponse.json({ ok: true });
  }

  const { nom, email, sujet, message } = parsed.data;
  await sendContactMessage({ nom, email, sujet, message });

  return NextResponse.json({ ok: true });
}
