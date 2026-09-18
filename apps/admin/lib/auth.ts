import { AUTH_COOKIE_NAMES } from "@repo/contracts/auth";

export function getApiUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.API_URL ??
    "http://localhost:4000"
  );
}

export function getLoginPath(returnTo = "/"): string {
  const params = new URLSearchParams({ returnTo });
  return `/login?${params.toString()}`;
}

export const SESSION_COOKIE = AUTH_COOKIE_NAMES.session;

export function safeReturnTo(value: string | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }
  return value;
}
