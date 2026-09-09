import type { Response } from "express";
import { AUTH_CONSTANTS } from "../../../shared/kernel/auth-constants";
import { sessionCookieOptions } from "../../../shared/security/cookies";
import type { AuthConfigService } from "../../../shared/config/auth-config.service";

export function applySessionCookies(
  res: Response,
  config: AuthConfigService,
  tokens: { accessToken: string; refreshToken: string },
): void {
  const cookie = config.values.cookie;
  res.cookie(
    cookie.session,
    tokens.accessToken,
    sessionCookieOptions(cookie, AUTH_CONSTANTS.accessTtlMs),
  );
  res.cookie(
    cookie.refresh,
    tokens.refreshToken,
    sessionCookieOptions(cookie, AUTH_CONSTANTS.refreshTtlMs),
  );
}

export function clearSessionCookies(
  res: Response,
  config: AuthConfigService,
): void {
  const cookie = config.values.cookie;
  const base = {
    path: cookie.path,
    domain: cookie.domain,
  };
  res.clearCookie(cookie.session, base);
  res.clearCookie(cookie.refresh, base);
  res.clearCookie(cookie.login, base);
}
