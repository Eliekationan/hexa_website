import { NextResponse } from "next/server";
import { quoteAgentRequestSchema } from "@/lib/quote-schema";
import { runQuoteAgent } from "@/lib/quote-agent";

const RATE_LIMIT_WINDOW_MS = 10 * 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;

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
      { error: "Trop de messages envoyés. Merci de réessayer dans quelques minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload JSON invalide." }, { status: 400 });
  }

  const parsed = quoteAgentRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  try {
    const result = await runQuoteAgent(parsed.data.messages);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[quote-agent] Échec de la génération de réponse :", error);
    return NextResponse.json(
      { error: "L'assistant est momentanément indisponible. Réessayez dans un instant." },
      { status: 500 },
    );
  }
}
