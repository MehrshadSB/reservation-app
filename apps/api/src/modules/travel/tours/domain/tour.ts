/**
 * Product definition. Not bookable by itself.
 * Customers book a TourDeparture of this tour, not the tour catalog row.
 */
export type Tour = {
  id: string;
  tenantId: string;
  name: string;
  destinationId?: string;
  durationDays?: number;
};
