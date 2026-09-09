import type {
  AuthorizationContext,
  Permission,
} from "@repo/contracts/authorization";

/** Keep in sync with `@repo/contracts/authorization`. */

const PERMISSIONS = {
  BOOKING_READ: "booking.read",
  BOOKING_CREATE: "booking.create",
  BOOKING_UPDATE: "booking.update",
  BOOKING_CANCEL: "booking.cancel",
  BOOKING_MANAGE: "booking.manage",
  TOUR_READ: "tour.read",
  TOUR_CREATE: "tour.create",
  TOUR_UPDATE: "tour.update",
  TOUR_DELETE: "tour.delete",
  TOUR_MANAGE: "tour.manage",
  ORGANIZATION_READ: "organization.read",
  ORGANIZATION_UPDATE: "organization.update",
  ORGANIZATION_MANAGE: "organization.manage",
  CUSTOMER_READ: "customer.read",
  CUSTOMER_CREATE: "customer.create",
  CUSTOMER_UPDATE: "customer.update",
  CUSTOMER_MANAGE: "customer.manage",
  PLATFORM_IDENTITIES_READ: "platform.identities.read",
  PLATFORM_ORGANIZATIONS_MANAGE: "platform.organizations.manage",
  PLATFORM_SUPPORT: "platform.support",
} as const satisfies Record<string, Permission>;

const ALL_PERMISSIONS = Object.values(PERMISSIONS);
const PERMISSION_SET = new Set<string>(ALL_PERMISSIONS);

function isPermission(value: string): value is Permission {
  return PERMISSION_SET.has(value);
}

const PLATFORM_ROLE_PERMISSIONS = {
  SUPER_ADMIN: ALL_PERMISSIONS,
  PLATFORM_SUPPORT: [
    PERMISSIONS.ORGANIZATION_READ,
    PERMISSIONS.BOOKING_READ,
    PERMISSIONS.TOUR_READ,
    PERMISSIONS.CUSTOMER_READ,
    PERMISSIONS.PLATFORM_IDENTITIES_READ,
    PERMISSIONS.PLATFORM_SUPPORT,
  ],
  PLATFORM_OPERATOR: [
    PERMISSIONS.ORGANIZATION_READ,
    PERMISSIONS.PLATFORM_ORGANIZATIONS_MANAGE,
    PERMISSIONS.PLATFORM_IDENTITIES_READ,
  ],
} as const;

const ORGANIZATION_ROLE_PERMISSIONS = {
  OWNER: [
    PERMISSIONS.ORGANIZATION_MANAGE,
    PERMISSIONS.ORGANIZATION_UPDATE,
    PERMISSIONS.ORGANIZATION_READ,
    PERMISSIONS.BOOKING_MANAGE,
    PERMISSIONS.BOOKING_READ,
    PERMISSIONS.BOOKING_CREATE,
    PERMISSIONS.BOOKING_UPDATE,
    PERMISSIONS.BOOKING_CANCEL,
    PERMISSIONS.TOUR_MANAGE,
    PERMISSIONS.TOUR_READ,
    PERMISSIONS.TOUR_CREATE,
    PERMISSIONS.TOUR_UPDATE,
    PERMISSIONS.TOUR_DELETE,
    PERMISSIONS.CUSTOMER_MANAGE,
    PERMISSIONS.CUSTOMER_READ,
    PERMISSIONS.CUSTOMER_CREATE,
    PERMISSIONS.CUSTOMER_UPDATE,
  ],
  ADMIN: [
    PERMISSIONS.ORGANIZATION_UPDATE,
    PERMISSIONS.ORGANIZATION_READ,
    PERMISSIONS.BOOKING_MANAGE,
    PERMISSIONS.BOOKING_READ,
    PERMISSIONS.BOOKING_CREATE,
    PERMISSIONS.BOOKING_UPDATE,
    PERMISSIONS.BOOKING_CANCEL,
    PERMISSIONS.TOUR_MANAGE,
    PERMISSIONS.TOUR_READ,
    PERMISSIONS.TOUR_CREATE,
    PERMISSIONS.TOUR_UPDATE,
    PERMISSIONS.TOUR_DELETE,
    PERMISSIONS.CUSTOMER_MANAGE,
    PERMISSIONS.CUSTOMER_READ,
    PERMISSIONS.CUSTOMER_CREATE,
    PERMISSIONS.CUSTOMER_UPDATE,
  ],
  MANAGER: [
    PERMISSIONS.ORGANIZATION_READ,
    PERMISSIONS.BOOKING_READ,
    PERMISSIONS.BOOKING_CREATE,
    PERMISSIONS.BOOKING_UPDATE,
    PERMISSIONS.BOOKING_CANCEL,
    PERMISSIONS.TOUR_MANAGE,
    PERMISSIONS.TOUR_READ,
    PERMISSIONS.TOUR_CREATE,
    PERMISSIONS.TOUR_UPDATE,
    PERMISSIONS.CUSTOMER_READ,
    PERMISSIONS.CUSTOMER_CREATE,
    PERMISSIONS.CUSTOMER_UPDATE,
  ],
  EMPLOYEE: [
    PERMISSIONS.ORGANIZATION_READ,
    PERMISSIONS.BOOKING_READ,
    PERMISSIONS.BOOKING_CREATE,
    PERMISSIONS.TOUR_READ,
    PERMISSIONS.CUSTOMER_READ,
    PERMISSIONS.CUSTOMER_CREATE,
  ],
  VIEWER: [
    PERMISSIONS.ORGANIZATION_READ,
    PERMISSIONS.BOOKING_READ,
    PERMISSIONS.TOUR_READ,
    PERMISSIONS.CUSTOMER_READ,
  ],
} as const;

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
      for (const permission of ORGANIZATION_ROLE_PERMISSIONS[membership.role]) {
        granted.add(permission);
      }
    }
  }

  if (granted.has(input.permission)) {
    return true;
  }

  const resource = input.permission.slice(0, input.permission.lastIndexOf("."));
  const manage = `${resource}.manage`;
  return isPermission(manage) && granted.has(manage);
}
