import type { BookableSnapshot } from "../domain/value-objects/bookable-snapshot";
import type { TimeRange } from "../domain/value-objects/time-range";

export type CreateBookingCommand = {
  tenantId: string;
  customerId: string;
  snapshot: BookableSnapshot;
  quantity: number;
};

export type ConfirmBookingCommand = {
  tenantId: string;
  bookingId: string;
};

export type CancelBookingCommand = {
  tenantId: string;
  bookingId: string;
};

export type RescheduleBookingCommand = {
  tenantId: string;
  bookingId: string;
  timeRange: TimeRange;
};
