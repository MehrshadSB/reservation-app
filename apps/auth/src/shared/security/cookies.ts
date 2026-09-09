export type CookieOptions = {
  httpOnly: true;
  secure: boolean;
  sameSite: "lax";
  path: string;
  domain?: string;
  maxAge: number;
};

export function sessionCookieOptions(
  config: {
    secure: boolean;
    sameSite: "lax";
    path: string;
    domain?: string;
  },
  maxAgeMs: number,
): CookieOptions {
  return {
    httpOnly: true,
    secure: config.secure,
    sameSite: config.sameSite,
    path: config.path,
    domain: config.domain,
    maxAge: maxAgeMs,
  };
}

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
