/**
 * Central permission catalog. Business code must import from here
 * instead of scattering permission strings.
 */
export const PERMISSIONS = {
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
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const PERMISSION_SET = new Set<string>(Object.values(PERMISSIONS));

export function isPermission(value: string): value is Permission {
  return PERMISSION_SET.has(value);
}

export const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS);
