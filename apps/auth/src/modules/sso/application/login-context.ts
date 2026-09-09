import type { AppClientId } from "../../../shared/config/platform-env";
import { isAllowedRedirect } from "../../../shared/config/platform-env";
import { AuthConfigService } from "../../../shared/config/auth-config.service";
import { AUTH_CONSTANTS } from "../../../shared/kernel/auth-constants";
import {
  signPayload,
  verifySignedPayload,
} from "../../../shared/security/crypto";

export type LoginContext = {
  clientId: AppClientId;
  returnTo: string;
  exp: number;
};

export function createLoginContextToken(
  config: AuthConfigService,
  input: { clientId: AppClientId; returnTo: string },
): string | undefined {
  if (!config.values.clients.includes(input.clientId)) {
    return undefined;
  }
  if (!isAllowedRedirect(input.returnTo, config.values.allowedRedirectOrigins)) {
    return undefined;
  }
  const payload: LoginContext = {
    clientId: input.clientId,
    returnTo: input.returnTo,
    exp: Date.now() + AUTH_CONSTANTS.loginContextTtlMs,
  };
  return signPayload(config.values.secrets.cookieSigning, JSON.stringify(payload));
}

export function readLoginContext(
  config: AuthConfigService,
  token: string | undefined,
): LoginContext | undefined {
  if (!token) {
    return undefined;
  }
  const raw = verifySignedPayload(config.values.secrets.cookieSigning, token);
  if (!raw) {
    return undefined;
  }
  try {
    const parsed = JSON.parse(raw) as LoginContext;
    if (parsed.exp <= Date.now()) {
      return undefined;
    }
    if (!config.values.clients.includes(parsed.clientId)) {
      return undefined;
    }
    if (!isAllowedRedirect(parsed.returnTo, config.values.allowedRedirectOrigins)) {
      return undefined;
    }
    return parsed;
  } catch {
    return undefined;
  }
}
