import { Injectable } from "@nestjs/common";
import type { Identity } from "../domain/identity";
import type { IdentityRepository } from "../application/ports/identity.repository";
import { InMemoryIdentityStore } from "./in-memory-identity.store";

@Injectable()
export class InMemoryIdentityRepository implements IdentityRepository {
  constructor(private readonly store: InMemoryIdentityStore) {}

  async findById(id: string): Promise<Identity | undefined> {
    return this.store.identities.get(id);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Identity | undefined> {
    const id = this.store.identitiesByPhone.get(phoneNumber);
    return id ? this.store.identities.get(id) : undefined;
  }

  async save(identity: Identity): Promise<void> {
    this.store.identities.set(identity.id, identity);
    this.store.identitiesByPhone.set(identity.phoneNumber, identity.id);
  }
}
