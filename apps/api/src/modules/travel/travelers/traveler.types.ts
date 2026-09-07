/**
 * Party members on a tour booking. Customer is who booked; travelers go.
 */
export type Traveler = {
  id: string;
  tenantId: string;
  bookingId: string;
  departureId: string;
  displayName: string;
};
