import type { BookableOfferingRef } from "./bookable-offering-ref";
import type { BookingMode } from "./booking-mode";
import type { TimeRange } from "./time-range";

/**
 * Data Booking Core needs to reserve. Industry modules build this from
 * their own occurrence entity (e.g. Tour Departure). Core never loads
 * that entity and never treats this as a persisted dual record.
 */
export type BookableSnapshot = {
  offering: BookableOfferingRef;
  mode: BookingMode;
  timeRange: TimeRange;
};
