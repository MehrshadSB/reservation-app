import type { OrganizationRole, PlatformRole } from "@repo/contracts/authorization";

export type PlatformAccess = {
  identityId: string;
  roles: PlatformRole[];
};

export type OrganizationMembershipRecord = {
  id: string;
  identityId: string;
  organizationId: string;
  role: OrganizationRole;
  createdAt: Date;
};
