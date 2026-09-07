import type { BookingMode } from "../value-objects/booking-mode";

/**
 * Tenant-level constraints (cancellation window, reschedule policy).
 * Placeholder — not evaluated yet.
 */
export type BookingRules = {
  cancellationAllowed: boolean;
  rescheduleAllowed: boolean;
};

/**
 * Mode-specific validation belongs here later, not in `if (industry)` branches.
 * Travel needs CAPACITY first. Other modes stay as documented extension points.
 */
export type BookingModeStrategy = {
  readonly mode: BookingMode;
};
