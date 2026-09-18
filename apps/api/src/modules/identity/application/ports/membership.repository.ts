import type { OrganizationMembership } from "../../domain/entities/organization-membership";

export type MembershipRepository = {
  listByUserId(userId: string): Promise<OrganizationMembership[]>;
  find(
    userId: string,
    organizationId: string,
  ): Promise<OrganizationMembership | undefined>;
  save(membership: OrganizationMembership): Promise<void>;
};
