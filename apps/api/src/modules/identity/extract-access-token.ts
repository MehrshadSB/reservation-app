import { parseCookies } from "./infrastructure/cookies";

export function extractAccessToken(input: {
  cookieHeader?: string;
  authorization?: string;
  cookieName: string;
}): string | undefined {
  const bearer = input.authorization;
  if (bearer?.startsWith("Bearer ")) {
    return bearer.slice("Bearer ".length).trim();
  }
  const cookies = parseCookies(input.cookieHeader);
  return cookies[input.cookieName];
}
