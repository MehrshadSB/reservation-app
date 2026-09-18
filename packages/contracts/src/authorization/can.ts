import type { OrganizationRole } from "./roles.js";
import { ORGANIZATION_ROLE_PERMISSIONS } from "./roles.js";
import type { Permission } from "./permissions.js";

/**
 * Static role → permission check. Membership lookup lives in the API.
 * Platform admins bypass organization roles.
 */
export function can(input: {
  isPlatformAdmin: boolean;
  role?: OrganizationRole;
  permission: Permission;
}): boolean {
  if (input.isPlatformAdmin) {
    return true;
  }
  if (!input.role) {
    return false;
  }
  return ORGANIZATION_ROLE_PERMISSIONS[input.role].includes(input.permission);
}
