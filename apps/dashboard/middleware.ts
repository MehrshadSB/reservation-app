import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getLoginUrl, REFRESH_COOKIE, SESSION_COOKIE } from "./lib/sso";

export function middleware(request: NextRequest) {
  const hasSession =
    request.cookies.has(SESSION_COOKIE) || request.cookies.has(REFRESH_COOKIE);
  if (hasSession) {
    return NextResponse.next();
  }

  return NextResponse.redirect(
    getLoginUrl("dashboard", request.nextUrl.href),
  );
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
