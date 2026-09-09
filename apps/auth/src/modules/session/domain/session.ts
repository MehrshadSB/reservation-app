export type SessionStatus = "active" | "revoked";

export type AuthSessionRecord = {
  id: string;
  identityId: string;
  systemUserId: string;
  accessTokenHash: string;
  refreshTokenHash: string;
  previousRefreshTokenHash?: string;
  expiresAt: Date;
  refreshExpiresAt: Date;
  revokedAt?: Date;
  createdAt: Date;
  lastRotatedAt: Date;
};
