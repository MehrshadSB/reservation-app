import type { TenantContext } from "../../../../shared/kernel/tenant-context";
import type { BookableOfferingRef } from "../value-objects/bookable-offering-ref";
import type { BookingMode } from "../value-objects/booking-mode";
import type { BookingStatus } from "../value-objects/booking-status";
import type { TimeRange } from "../value-objects/time-range";

/**
 * Booking aggregate. Points at a bookable offering by opaque reference.
 * Does not embed Tour, Room, Doctor, or any other industry concept.
 */
export type Booking = {
  id: string;
  tenant: TenantContext;
  customerId: string;
  offering: BookableOfferingRef;
  mode: BookingMode;
  timeRange: TimeRange;
  quantity: number;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
};
