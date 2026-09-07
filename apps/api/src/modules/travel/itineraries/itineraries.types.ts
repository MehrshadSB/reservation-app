/**
 * Belongs to a Tour. Departures inherit it; bookings do not copy it.
 */
export type ItineraryDay = {
  dayNumber: number;
  title: string;
};

export type Itinerary = {
  id: string;
  tenantId: string;
  tourId: string;
  days: ItineraryDay[];
};

