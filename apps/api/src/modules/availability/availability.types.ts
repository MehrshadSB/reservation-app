import type { BookableOfferingRef } from "../../shared/kernel/bookable-offering-ref";
import type { BookingMode } from "../../shared/kernel/booking-mode";
import type { TimeRange } from "../../shared/kernel/time-range";

export type RegisterInventoryCommand = {
  tenantId: string;
  offering: BookableOfferingRef;
  mode: BookingMode;
  timeRange: TimeRange;
  totalCapacity?: number;
};

export type CheckAvailabilityQuery = {
  tenantId: string;
  offering: BookableOfferingRef;
  timeRange: TimeRange;
  quantity: number;
};

export type CheckAvailabilityResult = {
  available: boolean;
  remainingCapacity?: number;
};

export type ReserveUnitsCommand = {
  tenantId: string;
  offering: BookableOfferingRef;
  timeRange: TimeRange;
  quantity: number;
  bookingId: string;
};

export type ReleaseUnitsCommand = ReserveUnitsCommand;

export type { AvailabilityInventory } from "./domain/entities/availability-inventory";
