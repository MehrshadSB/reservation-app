import type { AuthorizationContext } from "./context.js";
import { isPermission, type Permission } from "./permissions.js";
import {
  ORGANIZATION_ROLE_PERMISSIONS,
  PLATFORM_ROLE_PERMISSIONS,
} from "./roles.js";

/**
 * Permission-driven check. Callers pass an organization id for tenant-scoped
 * actions. Platform-granted permissions apply in every organization.
 */
export function can(input: {
  context: AuthorizationContext;
  permission: Permission;
  organizationId?: string;
}): boolean {
  const granted = new Set<Permission>();

  for (const role of input.context.platformRoles) {
    for (const permission of PLATFORM_ROLE_PERMISSIONS[role]) {
      granted.add(permission);
    }
  }

  if (input.organizationId) {
    const membership = input.context.memberships.find(
      (item) => item.organizationId === input.organizationId,
    );
    if (membership) {
      for (const permission of ORGANIZATION_ROLE_PERMISSIONS[
        membership.role
      ]) {
        granted.add(permission);
      }
    }
  }

  if (granted.has(input.permission)) {
    return true;
  }

  const resource = input.permission.slice(
    0,
    input.permission.lastIndexOf("."),
  );
  const manage = `${resource}.manage`;
  return isPermission(manage) && granted.has(manage);
}

export function hasPermission(
  context: AuthorizationContext,
  permission: Permission,
  organizationId?: string,
): boolean {
  return can({ context, permission, organizationId });
}
