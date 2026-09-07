/**
 * How a bookable offering consumes availability.
 *
 * Core validates with a mode strategy, never with an industry switch.
 * Travel's first path is CAPACITY. Other modes are extension points.
 */
export type BookingMode =
  | "CAPACITY"
  | "TIME_SLOT"
  | "DATE_RANGE"
  | "EXCLUSIVE_RESOURCE";
