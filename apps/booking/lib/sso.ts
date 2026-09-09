import { AUTH_COOKIE_NAMES } from "@repo/contracts/auth";
import { buildLoginUrl } from "@repo/config";

export function getAuthUrl(): string {
  return (
    process.env.AUTH_URL ??
    process.env.NEXT_PUBLIC_AUTH_URL ??
    "http://localhost:4001"
  );
}

export function getLoginUrl(returnTo: string): string {
  return buildLoginUrl({
    authUrl: getAuthUrl(),
    clientId: "booking",
    returnTo,
  });
}

export function getLogoutUrl(returnTo: string): string {
  const url = new URL("/logout", getAuthUrl());
  url.searchParams.set("return_to", returnTo);
  return url.toString();
}

export const SESSION_COOKIE = AUTH_COOKIE_NAMES.session;
