import type { OrganizationRole, PlatformRole } from "./roles.js";

export type OrganizationMembership = {
  organizationId: string;
  role: OrganizationRole;
};

export type AuthorizationContext = {
  identityId: string;
  systemUserId: string;
  platformRoles: PlatformRole[];
  memberships: OrganizationMembership[];
};
