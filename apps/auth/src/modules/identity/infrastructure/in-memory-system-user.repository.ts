import { Injectable } from "@nestjs/common";
import type { SystemUser } from "../domain/identity";
import type { SystemUserRepository } from "../application/ports/identity.repository";
import { InMemoryIdentityStore } from "./in-memory-identity.store";

@Injectable()
export class InMemorySystemUserRepository implements SystemUserRepository {
  constructor(private readonly store: InMemoryIdentityStore) {}

  async findByIdentityId(identityId: string): Promise<SystemUser | undefined> {
    const id = this.store.usersByIdentity.get(identityId);
    return id ? this.store.users.get(id) : undefined;
  }

  async save(user: SystemUser): Promise<void> {
    this.store.users.set(user.id, user);
    this.store.usersByIdentity.set(user.identityId, user.id);
  }
}
