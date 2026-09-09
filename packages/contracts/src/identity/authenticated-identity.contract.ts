/**
 * Authenticated person as seen by business APIs and frontends.
 * How they logged in is intentionally absent.
 */
export type IdentityStatus = "active" | "disabled";

export type AuthenticatedIdentity = {
  identityId: string;
  systemUserId: string;
  phoneNumber: string;
  status: IdentityStatus;
};
