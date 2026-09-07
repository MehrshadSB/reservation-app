/**
 * Domain types for Booking Core.
 * Cross-app HTTP contracts belong in `@repo/contracts/booking`.
 */
export type { Booking } from "./entities/booking";
export type { BookableOfferingRef } from "./value-objects/bookable-offering-ref";
export type { BookableSnapshot } from "./value-objects/bookable-snapshot";
export type { BookingMode } from "./value-objects/booking-mode";
export type { BookingStatus } from "./value-objects/booking-status";
export type { Capacity } from "./value-objects/capacity";
export type { TimeRange } from "./value-objects/time-range";
export type { BookingRules, BookingModeStrategy } from "./rules/booking-rules";
export { BOOKING_TRANSITIONS } from "./rules/booking-lifecycle";
export type {
  BookingDomainEvent,
  BookingDomainEventType,
} from "./events/booking-events";
