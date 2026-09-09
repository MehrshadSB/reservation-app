import { Inject, Injectable } from "@nestjs/common";
import { createId } from "../../../shared/security/crypto";
import { AUTH_CONSTANTS } from "../../../shared/kernel/auth-constants";
import { randomToken, sha256 } from "../../../shared/security/crypto";
import type { AuthSessionRecord } from "../domain/session";
import type { SessionRepository } from "./ports/session.repository";
import { SESSION_REPOSITORY } from "./ports/tokens";

export type IssuedTokens = {
  session: AuthSessionRecord;
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class SessionService {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessions: SessionRepository,
  ) {}

  async create(input: {
    identityId: string;
    systemUserId: string;
  }): Promise<IssuedTokens> {
    const now = Date.now();
    const accessToken = randomToken();
    const refreshToken = randomToken();
    const session: AuthSessionRecord = {
      id: createId(),
      identityId: input.identityId,
      systemUserId: input.systemUserId,
      accessTokenHash: sha256(accessToken),
      refreshTokenHash: sha256(refreshToken),
      expiresAt: new Date(now + AUTH_CONSTANTS.accessTtlMs),
      refreshExpiresAt: new Date(now + AUTH_CONSTANTS.refreshTtlMs),
      createdAt: new Date(now),
      lastRotatedAt: new Date(now),
    };
    await this.sessions.save(session);
    return { session, accessToken, refreshToken };
  }

  async getByAccessToken(
    accessToken: string,
  ): Promise<AuthSessionRecord | undefined> {
    const session = await this.sessions.findByAccessTokenHash(
      sha256(accessToken),
    );
    if (!session || session.revokedAt) {
      return undefined;
    }
    if (session.expiresAt.getTime() <= Date.now()) {
      return undefined;
    }
    return session;
  }

  async rotateByRefreshToken(refreshToken: string): Promise<IssuedTokens> {
    const hash = sha256(refreshToken);
    const session = await this.sessions.findByRefreshTokenHash(hash);
    if (!session || session.revokedAt) {
      throw new Error("invalid_refresh");
    }

    const now = Date.now();
    if (session.refreshExpiresAt.getTime() <= now) {
      session.revokedAt = new Date(now);
      await this.sessions.save(session);
      throw new Error("invalid_refresh");
    }

    if (session.previousRefreshTokenHash === hash) {
      session.revokedAt = new Date(now);
      await this.sessions.save(session);
      throw new Error("refresh_reuse");
    }

    const accessToken = randomToken();
    const nextRefresh = randomToken();
    session.previousRefreshTokenHash = session.refreshTokenHash;
    session.accessTokenHash = sha256(accessToken);
    session.refreshTokenHash = sha256(nextRefresh);
    session.expiresAt = new Date(now + AUTH_CONSTANTS.accessTtlMs);
    session.lastRotatedAt = new Date(now);
    await this.sessions.save(session);
    return { session, accessToken, refreshToken: nextRefresh };
  }

  async revoke(sessionId: string): Promise<void> {
    const session = await this.sessions.findById(sessionId);
    if (!session || session.revokedAt) {
      return;
    }
    session.revokedAt = new Date();
    await this.sessions.save(session);
  }

  async revokeByAccessToken(accessToken: string): Promise<void> {
    const session = await this.sessions.findByAccessTokenHash(
      sha256(accessToken),
    );
    if (!session) {
      return;
    }
    session.revokedAt = new Date();
    await this.sessions.save(session);
  }
}
