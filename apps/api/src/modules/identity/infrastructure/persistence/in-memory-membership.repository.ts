import { Injectable } from "@nestjs/common";
import type { OrganizationMembership } from "../../domain/entities/organization-membership";
import type { MembershipRepository } from "../../application/ports/membership.repository";

@Injectable()
export class InMemoryMembershipRepository implements MembershipRepository {
  private readonly memberships = new Map<string, OrganizationMembership>();

  async listByUserId(userId: string): Promise<OrganizationMembership[]> {
    return [...this.memberships.values()].filter(
      (item) => item.userId === userId,
    );
  }

  async find(
    userId: string,
    organizationId: string,
  ): Promise<OrganizationMembership | undefined> {
    return [...this.memberships.values()].find(
      (item) =>
        item.userId === userId && item.organizationId === organizationId,
    );
  }

  async save(membership: OrganizationMembership): Promise<void> {
    this.memberships.set(membership.id, membership);
  }
}
