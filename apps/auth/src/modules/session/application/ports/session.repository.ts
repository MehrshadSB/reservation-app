import type { AuthSessionRecord } from "../../domain/session";

export type SessionRepository = {
  save(session: AuthSessionRecord): Promise<void>;
  findById(id: string): Promise<AuthSessionRecord | undefined>;
  findByAccessTokenHash(hash: string): Promise<AuthSessionRecord | undefined>;
  findByRefreshTokenHash(hash: string): Promise<AuthSessionRecord | undefined>;
};
