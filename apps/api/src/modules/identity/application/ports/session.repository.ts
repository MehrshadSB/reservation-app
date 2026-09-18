import type { Session } from "../../domain/entities/session";

export type SessionRepository = {
  save(session: Session): Promise<void>;
  findById(id: string): Promise<Session | undefined>;
  findByTokenHash(hash: string): Promise<Session | undefined>;
};
