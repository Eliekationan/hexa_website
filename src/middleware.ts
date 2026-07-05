import type { NextRequest } from "next/server";
import { updateAdminSession } from "@/lib/auth/middleware";

export function middleware(request: NextRequest) {
  return updateAdminSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
