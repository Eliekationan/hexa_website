import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getAdminUser();
  return NextResponse.json({ isAdmin: Boolean(user) });
}
