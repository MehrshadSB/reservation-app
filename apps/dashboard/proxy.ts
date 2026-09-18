import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getLoginPath, SESSION_COOKIE } from "./lib/auth";

export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE)) {
    return NextResponse.next();
  }

  const returnTo = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  return NextResponse.redirect(new URL(getLoginPath(returnTo), request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|login).*)"],
};
