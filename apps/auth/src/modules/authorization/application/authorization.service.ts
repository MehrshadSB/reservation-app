import { Inject, Injectable } from "@nestjs/common";
import type {
  AuthorizationContext,
  OrganizationRole,
  Permission,
  PlatformRole,
} from "@repo/contracts/authorization";
import { can as checkPermission } from "../catalog";
import { createId } from "../../../shared/security/crypto";
import { normalizePhoneNumber } from "../../../shared/security/phone";
import { AuthConfigService } from "../../../shared/config/auth-config.service";
import { IdentityService } from "../../identity/application/identity.service";
import type {
  MembershipRepository,
  PlatformAccessRepository,
} from "./ports/authorization.repository";
import {
  MEMBERSHIP_REPOSITORY,
  PLATFORM_ACCESS_REPOSITORY,
} from "./ports/tokens";

@Injectable()
export class AuthorizationService {
  constructor(
    @Inject(MEMBERSHIP_REPOSITORY)
    private readonly memberships: MembershipRepository,
    @Inject(PLATFORM_ACCESS_REPOSITORY)
    private readonly platformAccess: PlatformAccessRepository,
    private readonly identities: IdentityService,
    private readonly config: AuthConfigService,
  ) {}

  async getContext(identityId: string): Promise<AuthorizationContext> {
    const systemUser = await this.identities.getSystemUser(identityId);
    const platform = await this.platformAccess.get(identityId);
    const memberships = await this.memberships.listByIdentityId(identityId);
    return {
      identityId,
      systemUserId: systemUser?.id ?? "",
      platformRoles: platform?.roles ?? [],
      memberships: memberships.map((item) => ({
        organizationId: item.organizationId,
        role: item.role,
      })),
    };
  }

  async can(input: {
    identityId: string;
    permission: Permission;
    organizationId?: string;
  }): Promise<boolean> {
    const context = await this.getContext(input.identityId);
    return checkPermission({
      context,
      permission: input.permission,
      organizationId: input.organizationId,
    });
  }

  async grantOrganizationRole(input: {
    identityId: string;
    organizationId: string;
    role: OrganizationRole;
  }): Promise<void> {
    const existing = await this.memberships.find(
      input.identityId,
      input.organizationId,
    );
    await this.memberships.save(
      existing
        ? { ...existing, role: input.role }
        : {
            id: createId(),
            identityId: input.identityId,
            organizationId: input.organizationId,
            role: input.role,
            createdAt: new Date(),
          },
    );
  }

  async grantPlatformRole(
    identityId: string,
    role: PlatformRole,
  ): Promise<void> {
    await this.platformAccess.grant(identityId, role);
  }

  async maybeBootstrapSuperAdmin(phoneNumber: string, identityId: string): Promise<void> {
    const bootstrap = this.config.values.bootstrapSuperAdminPhone;
    if (!bootstrap || bootstrap.length === 0) {
      return;
    }
    let expected: string;
    try {
      expected = normalizePhoneNumber(bootstrap);
    } catch {
      return;
    }
    if (expected !== phoneNumber) {
      return;
    }
    await this.grantPlatformRole(identityId, "SUPER_ADMIN");
  }
}
