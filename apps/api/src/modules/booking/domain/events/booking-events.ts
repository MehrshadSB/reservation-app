/**
 * Names of events other modules (payment, notification) may observe later.
 * No bus is wired yet.
 */
export type BookingDomainEventType =
  | "booking.created"
  | "booking.reserved"
  | "booking.confirmed"
  | "booking.cancelled"
  | "booking.rescheduled"
  | "booking.expired"
  | "booking.completed";

export type BookingDomainEvent = {
  type: BookingDomainEventType;
  bookingId: string;
  tenantId: string;
};
