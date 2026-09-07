/**
 * Lifecycle of a booking. This set is a starting point, not a frozen contract.
 *
 * DRAFT → PENDING → RESERVED → CONFIRMED → COMPLETED
 *                  ↘ CANCELLED / EXPIRED
 */
export type BookingStatus =
  | "DRAFT"
  | "PENDING"
  | "RESERVED"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED";
