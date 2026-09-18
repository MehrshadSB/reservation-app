import type { OrganizationMembership } from "../authorization/context.js";
import type { AuthenticatedUser } from "./authenticated-identity.contract.js";
import type { UserProfileResponse } from "./user-profile.contract.js";

export type CurrentUserResponse = {
  user: AuthenticatedUser;
  isPlatformAdmin: boolean;
  memberships: OrganizationMembership[];
  profile: UserProfileResponse | null;
};
