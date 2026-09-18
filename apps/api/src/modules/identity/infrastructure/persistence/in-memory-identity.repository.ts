import { Injectable } from "@nestjs/common";
import type { Identity } from "../../domain/entities/identity";
import type { IdentityRepository } from "../../application/ports/identity.repository";

@Injectable()
export class InMemoryIdentityRepository implements IdentityRepository {
  private readonly identities = new Map<string, Identity>();
  private readonly identitiesByPhone = new Map<string, string>();

  async findById(id: string): Promise<Identity | undefined> {
    return this.identities.get(id);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Identity | undefined> {
    const id = this.identitiesByPhone.get(phoneNumber);
    return id ? this.identities.get(id) : undefined;
  }

  async save(identity: Identity): Promise<void> {
    this.identities.set(identity.id, identity);
    this.identitiesByPhone.set(identity.phoneNumber, identity.id);
  }
}
