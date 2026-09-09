import type {
  OrganizationMembershipRecord,
  PlatformAccess,
} from "../../domain/access";
import type { OrganizationRole, PlatformRole } from "@repo/contracts/authorization";

export type MembershipRepository = {
  listByIdentityId(identityId: string): Promise<OrganizationMembershipRecord[]>;
  find(
    identityId: string,
    organizationId: string,
  ): Promise<OrganizationMembershipRecord | undefined>;
  save(membership: OrganizationMembershipRecord): Promise<void>;
};

export type PlatformAccessRepository = {
  get(identityId: string): Promise<PlatformAccess | undefined>;
  grant(identityId: string, role: PlatformRole): Promise<void>;
};

export type GrantMembershipInput = {
  identityId: string;
  organizationId: string;
  role: OrganizationRole;
};
