import type { BookableOfferingRef } from "../../domain/value-objects/bookable-offering-ref";
import type { TimeRange } from "../../domain/value-objects/time-range";

/**
 * Booking Core asks Availability through this port.
 * The adapter lives in booking/infrastructure and calls AvailabilityModule.
 * Booking domain never imports the availability module.
 */
export type AvailabilityCheckQuery = {
  tenantId: string;
  offering: BookableOfferingRef;
  timeRange: TimeRange;
  quantity: number;
};

export type AvailabilityCheckResult = {
  available: boolean;
  remainingCapacity?: number;
};

export type AvailabilityReservationCommand = {
  tenantId: string;
  offering: BookableOfferingRef;
  timeRange: TimeRange;
  quantity: number;
  bookingId: string;
};

export type AvailabilityPort = {
  check(query: AvailabilityCheckQuery): Promise<AvailabilityCheckResult>;
  reserve(command: AvailabilityReservationCommand): Promise<void>;
  release(command: AvailabilityReservationCommand): Promise<void>;
};
