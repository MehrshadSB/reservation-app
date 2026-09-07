import type { BookingMode } from "../../../../shared/kernel/booking-mode";
import type { AvailabilityInventory } from "../entities/availability-inventory";

/**
 * Mode-specific availability rules. Booking Core never switches on industry.
 * Add a new strategy for a new mode — do not add `if (offeringType === ...)`.
 */
export type AvailabilityStrategy = {
  readonly mode: BookingMode;
  canReserve(inventory: AvailabilityInventory, quantity: number): boolean;
};
