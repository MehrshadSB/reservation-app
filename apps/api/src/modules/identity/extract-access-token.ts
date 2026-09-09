export function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) {
    return {};
  }
  const out: Record<string, string> = {};
  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index === -1) {
      continue;
    }
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (key.length > 0) {
      out[key] = decodeURIComponent(value);
    }
  }
  return out;
}

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
