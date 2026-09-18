import { Inject, Injectable } from "@nestjs/common";
import type { Session } from "../domain/entities/session";
import { IDENTITY_CONSTANTS } from "../domain/identity-constants";
import { createId, randomToken, sha256 } from "../infrastructure/crypto";
import type { SessionRepository } from "./ports/session.repository";
import { SESSION_REPOSITORY } from "./ports/tokens";

@Injectable()
export class SessionService {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessions: SessionRepository,
  ) {}

  async create(userId: string): Promise<{ session: Session; token: string }> {
    const now = Date.now();
    const token = randomToken();
    const session: Session = {
      id: createId(),
      userId,
      tokenHash: sha256(token),
      expiresAt: new Date(now + IDENTITY_CONSTANTS.sessionTtlMs),
      createdAt: new Date(now),
    };
    await this.sessions.save(session);
    return { session, token };
  }

  async getByToken(token: string): Promise<Session | undefined> {
    const session = await this.sessions.findByTokenHash(sha256(token));
    if (!session || session.revokedAt) {
      return undefined;
    }
    if (session.expiresAt.getTime() <= Date.now()) {
      return undefined;
    }
    return session;
  }

  async revokeByToken(token: string): Promise<void> {
    const session = await this.sessions.findByTokenHash(sha256(token));
    if (!session || session.revokedAt) {
      return;
    }
    session.revokedAt = new Date();
    await this.sessions.save(session);
  }
}
