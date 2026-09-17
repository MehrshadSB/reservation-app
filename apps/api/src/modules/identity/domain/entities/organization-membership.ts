import type { OrganizationRole } from "@repo/contracts/authorization";

export type OrganizationMembership = {
  id: string;
  userId: string;
  organizationId: string;
  role: OrganizationRole;
  createdAt: Date;
};
