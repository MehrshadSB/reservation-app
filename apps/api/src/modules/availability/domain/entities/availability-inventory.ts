import type { BookableOfferingRef } from "../../../../shared/kernel/bookable-offering-ref";
import type { BookingMode } from "../../../../shared/kernel/booking-mode";
import type { TimeRange } from "../../../../shared/kernel/time-range";

/**
 * Generic inventory for one bookable offering. Not tour-specific.
 * A doctor slot or hotel stay will reuse this later.
 */
export type AvailabilityInventory = {
  tenantId: string;
  offering: BookableOfferingRef;
  mode: BookingMode;
  timeRange: TimeRange;
  totalCapacity?: number;
  remainingCapacity?: number;
};
