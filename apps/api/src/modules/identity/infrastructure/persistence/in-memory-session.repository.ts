import { Injectable } from "@nestjs/common";
import type { Session } from "../../domain/entities/session";
import type { SessionRepository } from "../../application/ports/session.repository";

@Injectable()
export class InMemorySessionRepository implements SessionRepository {
  private readonly byId = new Map<string, Session>();
  private readonly byToken = new Map<string, string>();

  async save(session: Session): Promise<void> {
    const existing = this.byId.get(session.id);
    if (existing) {
      this.byToken.delete(existing.tokenHash);
    }
    this.byId.set(session.id, session);
    this.byToken.set(session.tokenHash, session.id);
  }

  async findById(id: string): Promise<Session | undefined> {
    return this.byId.get(id);
  }

  async findByTokenHash(hash: string): Promise<Session | undefined> {
    const id = this.byToken.get(hash);
    return id ? this.byId.get(id) : undefined;
  }
}
