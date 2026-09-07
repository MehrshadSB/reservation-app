import type { BookingStatus } from "../value-objects/booking-status";

/**
 * Allowed transitions. The engine that enforces this map is not built yet.
 * Statuses and edges can change without involving industry modules.
 */
export const BOOKING_TRANSITIONS: Record<
  BookingStatus,
  readonly BookingStatus[]
> = {
  DRAFT: ["PENDING", "CANCELLED"],
  PENDING: ["RESERVED", "CANCELLED", "EXPIRED"],
  RESERVED: ["CONFIRMED", "CANCELLED", "EXPIRED"],
  CONFIRMED: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
  EXPIRED: [],
};
