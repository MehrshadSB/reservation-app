import { Inject, Injectable } from "@nestjs/common";
import type {
  OrganizationRole,
  Permission,
} from "@repo/contracts/authorization";
import type { AuthenticatedUser } from "@repo/contracts/identity";
import type { TenantContext } from "../../../shared/kernel/tenant-context";
import type { OrganizationMembership } from "../domain/entities/organization-membership";
import { createId } from "../infrastructure/crypto";
import {
  InvalidPhoneNumberError,
  normalizePhoneNumber,
} from "../infrastructure/phone";
import { IdentityConfigService } from "../infrastructure/identity-config.service";
import { can as roleCan } from "./can";
import { IdentityService } from "./identity.service";
import type { MembershipRepository } from "./ports/membership.repository";
import { MEMBERSHIP_REPOSITORY } from "./ports/tokens";

@Injectable()
export class AuthorizationService {
  constructor(
    @Inject(MEMBERSHIP_REPOSITORY)
    private readonly memberships: MembershipRepository,
    private readonly identities: IdentityService,
    private readonly config: IdentityConfigService,
  ) {}

  async can(
    user: AuthenticatedUser,
    permission: Permission,
    tenant: TenantContext,
  ): Promise<boolean> {
    const identity = await this.identities.getById(user.userId);
    if (!identity || identity.status !== "active") {
      return false;
    }
    const membership = await this.memberships.find(
      user.userId,
      tenant.organizationId,
    );
    return roleCan({
      isPlatformAdmin: identity.isPlatformAdmin,
      role: membership?.role,
      permission,
    });
  }

  async listMemberships(userId: string): Promise<OrganizationMembership[]> {
    return this.memberships.listByUserId(userId);
  }

  async grantMembership(input: {
    userId: string;
    organizationId: string;
    role: OrganizationRole;
  }): Promise<void> {
    const existing = await this.memberships.find(
      input.userId,
      input.organizationId,
    );
    await this.memberships.save(
      existing
        ? { ...existing, role: input.role }
        : {
            id: createId(),
            userId: input.userId,
            organizationId: input.organizationId,
            role: input.role,
            createdAt: new Date(),
          },
    );
  }

  async maybeBootstrapPlatformAdmin(
    phoneNumber: string,
    userId: string,
  ): Promise<void> {
    const bootstrap = this.config.values.bootstrapPlatformAdminPhone;
    if (!bootstrap || bootstrap.length === 0) {
      return;
    }
    let expected: string;
    try {
      expected = normalizePhoneNumber(bootstrap);
    } catch (error) {
      if (error instanceof InvalidPhoneNumberError) {
        return;
      }
      throw error;
    }
    if (expected !== phoneNumber) {
      return;
    }
    await this.identities.markPlatformAdmin(userId);
  }
}
