/**
 * Central permission catalog. Business code must import from here
 * instead of scattering permission strings.
 *
 * Derived from the modules that exist in the API today.
 */
export const PERMISSIONS = {
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
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const PERMISSION_SET = new Set<string>(Object.values(PERMISSIONS));

export function isPermission(value: string): value is Permission {
  return PERMISSION_SET.has(value);
}

export const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS);
