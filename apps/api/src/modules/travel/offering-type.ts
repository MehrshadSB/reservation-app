/**
 * Discriminator stored on BookableOfferingRef.offeringType.
 *
 * Booking Core and Availability persist this string and must never
 * switch on it. Travel uses it when hydrating booking display data.
 */
export const TOUR_DEPARTURE_OFFERING_TYPE = "travel.tour-departure";
