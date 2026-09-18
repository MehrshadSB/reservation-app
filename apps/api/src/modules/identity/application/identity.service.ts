import { Inject, Injectable } from "@nestjs/common";
import type { Identity } from "../domain/entities/identity";
import { createId } from "../infrastructure/crypto";
import type { IdentityRepository } from "./ports/identity.repository";
import { IDENTITY_REPOSITORY } from "./ports/tokens";

@Injectable()
export class IdentityService {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly identities: IdentityRepository,
  ) {}

  async createOrGetByPhone(phoneNumber: string): Promise<{
    identity: Identity;
    created: boolean;
  }> {
    const existing = await this.identities.findByPhoneNumber(phoneNumber);
    if (existing) {
      return { identity: existing, created: false };
    }

    const now = new Date();
    const identity: Identity = {
      id: createId(),
      phoneNumber,
      status: "active",
      isPlatformAdmin: false,
      createdAt: now,
      updatedAt: now,
    };
    await this.identities.save(identity);
    return { identity, created: true };
  }

  async getById(id: string): Promise<Identity | undefined> {
    return this.identities.findById(id);
  }

  async markPlatformAdmin(userId: string): Promise<void> {
    const identity = await this.identities.findById(userId);
    if (!identity || identity.isPlatformAdmin) {
      return;
    }
    identity.isPlatformAdmin = true;
    identity.updatedAt = new Date();
    await this.identities.save(identity);
  }
}
