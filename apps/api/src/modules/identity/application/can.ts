import type {
  OrganizationRole,
  Permission,
} from "@repo/contracts/authorization";

/** Keep in sync with `@repo/contracts/authorization`. */

const PERMISSIONS = {
  ORGANIZATION_READ: "organization.read",
  ORGANIZATION_UPDATE: "organization.update",
  CUSTOMER_READ: "customer.read",
  CUSTOMER_CREATE: "customer.create",
  CUSTOMER_UPDATE: "customer.update",
  TOUR_READ: "tour.read",
  TOUR_CREATE: "tour.create",
  TOUR_UPDATE: "tour.update",
  TOUR_DELETE: "tour.delete",
  DEPARTURE_READ: "departure.read",
  DEPARTURE_CREATE: "departure.create",
  DEPARTURE_UPDATE: "departure.update",
  DEPARTURE_PUBLISH: "departure.publish",
  BOOKING_READ: "booking.read",
  BOOKING_CREATE: "booking.create",
  BOOKING_CONFIRM: "booking.confirm",
  BOOKING_CANCEL: "booking.cancel",
} as const satisfies Record<string, Permission>;

const ORGANIZATION_ROLE_PERMISSIONS: Record<
  OrganizationRole,
  readonly Permission[]
> = {
  OWNER: [
    PERMISSIONS.ORGANIZATION_READ,
    PERMISSIONS.ORGANIZATION_UPDATE,
    PERMISSIONS.CUSTOMER_READ,
    PERMISSIONS.CUSTOMER_CREATE,
    PERMISSIONS.CUSTOMER_UPDATE,
    PERMISSIONS.TOUR_READ,
    PERMISSIONS.TOUR_CREATE,
    PERMISSIONS.TOUR_UPDATE,
    PERMISSIONS.TOUR_DELETE,
    PERMISSIONS.DEPARTURE_READ,
    PERMISSIONS.DEPARTURE_CREATE,
    PERMISSIONS.DEPARTURE_UPDATE,
    PERMISSIONS.DEPARTURE_PUBLISH,
    PERMISSIONS.BOOKING_READ,
    PERMISSIONS.BOOKING_CREATE,
    PERMISSIONS.BOOKING_CONFIRM,
    PERMISSIONS.BOOKING_CANCEL,
  ],
  ADMIN: [
    PERMISSIONS.ORGANIZATION_READ,
    PERMISSIONS.CUSTOMER_READ,
    PERMISSIONS.CUSTOMER_CREATE,
    PERMISSIONS.CUSTOMER_UPDATE,
    PERMISSIONS.TOUR_READ,
    PERMISSIONS.TOUR_CREATE,
    PERMISSIONS.TOUR_UPDATE,
    PERMISSIONS.DEPARTURE_READ,
    PERMISSIONS.DEPARTURE_CREATE,
    PERMISSIONS.DEPARTURE_UPDATE,
    PERMISSIONS.DEPARTURE_PUBLISH,
    PERMISSIONS.BOOKING_READ,
    PERMISSIONS.BOOKING_CREATE,
    PERMISSIONS.BOOKING_CONFIRM,
    PERMISSIONS.BOOKING_CANCEL,
  ],
  MEMBER: [
    PERMISSIONS.CUSTOMER_READ,
    PERMISSIONS.TOUR_READ,
    PERMISSIONS.DEPARTURE_READ,
    PERMISSIONS.BOOKING_READ,
  ],
};

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
