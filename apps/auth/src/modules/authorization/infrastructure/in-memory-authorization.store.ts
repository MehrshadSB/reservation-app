import { Injectable } from "@nestjs/common";
import { createId } from "../../../shared/security/crypto";
import type { OrganizationRole, PlatformRole } from "@repo/contracts/authorization";
import type {
  OrganizationMembershipRecord,
  PlatformAccess,
} from "../domain/access";
import type {
  MembershipRepository,
  PlatformAccessRepository,
} from "../application/ports/authorization.repository";

@Injectable()
export class InMemoryAuthorizationStore
  implements MembershipRepository, PlatformAccessRepository
{
  private readonly memberships = new Map<string, OrganizationMembershipRecord>();
  private readonly platform = new Map<string, PlatformAccess>();

  async listByIdentityId(
    identityId: string,
  ): Promise<OrganizationMembershipRecord[]> {
    return [...this.memberships.values()].filter(
      (item) => item.identityId === identityId,
    );
  }

  async find(
    identityId: string,
    organizationId: string,
  ): Promise<OrganizationMembershipRecord | undefined> {
    return [...this.memberships.values()].find(
      (item) =>
        item.identityId === identityId && item.organizationId === organizationId,
    );
  }

  async save(membership: OrganizationMembershipRecord): Promise<void> {
    this.memberships.set(membership.id, membership);
  }

  async get(identityId: string): Promise<PlatformAccess | undefined> {
    return this.platform.get(identityId);
  }

  async grant(identityId: string, role: PlatformRole): Promise<void> {
    const current = this.platform.get(identityId);
    const roles = new Set(current?.roles ?? []);
    roles.add(role);
    this.platform.set(identityId, { identityId, roles: [...roles] });
  }

  async upsertMembership(input: {
    identityId: string;
    organizationId: string;
    role: OrganizationRole;
  }): Promise<OrganizationMembershipRecord> {
    const existing = await this.find(input.identityId, input.organizationId);
    const record: OrganizationMembershipRecord = existing
      ? { ...existing, role: input.role }
      : {
          id: createId(),
          identityId: input.identityId,
          organizationId: input.organizationId,
          role: input.role,
          createdAt: new Date(),
        };
    this.memberships.set(record.id, record);
    return record;
  }
}
