/**
 * Opaque identity of something an industry module considers bookable.
 *
 * Booking Core and Availability store this reference. They never interpret
 * `offeringType` and must never branch on it.
 *
 * Examples (owned by extensions, not by core):
 * - `travel.tour-departure`
 * - `hotel.room-stay` (future)
 */
export type BookableOfferingRef = {
  offeringId: string;
  offeringType: string;
};
