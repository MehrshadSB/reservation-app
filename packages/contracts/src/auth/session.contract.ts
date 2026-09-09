import type { AuthenticatedIdentity } from "../identity/authenticated-identity.contract.js";
import type { AuthorizationContext } from "../authorization/context.js";

export const AUTH_COOKIE_NAMES = {
  session: "ra_session",
  refresh: "ra_refresh",
  login: "ra_login",
} as const;

export type AuthSession = {
  sessionId: string;
  identity: AuthenticatedIdentity;
  authorization: AuthorizationContext;
  expiresAt: string;
  refreshExpiresAt: string;
};

export type SessionIntrospection = {
  sessionId: string;
  identity: AuthenticatedIdentity;
  authorization: AuthorizationContext;
};
