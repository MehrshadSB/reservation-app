import type { OrganizationRole } from "./roles.js";

export type OrganizationMembership = {
  organizationId: string;
  role: OrganizationRole;
};
