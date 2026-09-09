import { Inject, Injectable } from "@nestjs/common";
import { createId } from "../../../shared/security/crypto";
import type { Identity, SystemUser } from "../domain/identity";
import type {
  IdentityRepository,
  SystemUserRepository,
} from "./ports/identity.repository";
import {
  IDENTITY_REPOSITORY,
  SYSTEM_USER_REPOSITORY,
} from "./ports/tokens";

@Injectable()
export class IdentityService {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly identities: IdentityRepository,
    @Inject(SYSTEM_USER_REPOSITORY)
    private readonly systemUsers: SystemUserRepository,
  ) {}

  async createOrGetByPhone(phoneNumber: string): Promise<{
    identity: Identity;
    systemUser: SystemUser;
    created: boolean;
  }> {
    const existing = await this.identities.findByPhoneNumber(phoneNumber);
    if (existing) {
      const systemUser = await this.ensureSystemUser(existing.id);
      return { identity: existing, systemUser, created: false };
    }

    const now = new Date();
    const identity: Identity = {
      id: createId(),
      phoneNumber,
      status: "active",
      createdAt: now,
      updatedAt: now,
    };
    await this.identities.save(identity);
    const systemUser = await this.ensureSystemUser(identity.id);
    return { identity, systemUser, created: true };
  }

  async getById(id: string): Promise<Identity | undefined> {
    return this.identities.findById(id);
  }

  async getSystemUser(identityId: string): Promise<SystemUser | undefined> {
    return this.systemUsers.findByIdentityId(identityId);
  }

  private async ensureSystemUser(identityId: string): Promise<SystemUser> {
    const existing = await this.systemUsers.findByIdentityId(identityId);
    if (existing) {
      return existing;
    }
    const now = new Date();
    const user: SystemUser = {
      id: createId(),
      identityId,
      status: "active",
      createdAt: now,
      updatedAt: now,
    };
    await this.systemUsers.save(user);
    return user;
  }
}
