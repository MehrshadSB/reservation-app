import type { Response } from "express";
import { IDENTITY_CONSTANTS } from "../domain/identity-constants";
import { sessionCookieOptions } from "../infrastructure/cookies";
import type { IdentityConfigService } from "../infrastructure/identity-config.service";

export function applySessionCookie(
  res: Response,
  config: IdentityConfigService,
  token: string,
): void {
  const cookie = config.values.cookie;
  res.cookie(
    cookie.session,
    token,
    sessionCookieOptions(cookie, IDENTITY_CONSTANTS.sessionTtlMs),
  );
}

export function clearSessionCookie(
  res: Response,
  config: IdentityConfigService,
): void {
  const cookie = config.values.cookie;
  res.clearCookie(cookie.session, {
    path: cookie.path,
    domain: cookie.domain,
  });
}
