import { Injectable } from "@nestjs/common";
import type { AuthSessionRecord } from "../domain/session";
import type { SessionRepository } from "../application/ports/session.repository";

@Injectable()
export class InMemorySessionRepository implements SessionRepository {
  private readonly byId = new Map<string, AuthSessionRecord>();
  private readonly byAccess = new Map<string, string>();
  private readonly byRefresh = new Map<string, string>();

  async save(session: AuthSessionRecord): Promise<void> {
    const existing = this.byId.get(session.id);
    if (existing) {
      this.byAccess.delete(existing.accessTokenHash);
      this.byRefresh.delete(existing.refreshTokenHash);
      if (existing.previousRefreshTokenHash) {
        this.byRefresh.delete(existing.previousRefreshTokenHash);
      }
    }
    this.byId.set(session.id, session);
    this.byAccess.set(session.accessTokenHash, session.id);
    this.byRefresh.set(session.refreshTokenHash, session.id);
    if (session.previousRefreshTokenHash) {
      this.byRefresh.set(session.previousRefreshTokenHash, session.id);
    }
  }

  async findById(id: string): Promise<AuthSessionRecord | undefined> {
    return this.byId.get(id);
  }

  async findByAccessTokenHash(
    hash: string,
  ): Promise<AuthSessionRecord | undefined> {
    const id = this.byAccess.get(hash);
    return id ? this.byId.get(id) : undefined;
  }

  async findByRefreshTokenHash(
    hash: string,
  ): Promise<AuthSessionRecord | undefined> {
    const id = this.byRefresh.get(hash);
    return id ? this.byId.get(id) : undefined;
  }
}
