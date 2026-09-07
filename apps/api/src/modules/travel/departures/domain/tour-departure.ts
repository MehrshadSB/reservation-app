/**
 * Actual occurrence of a Tour. This is what customers book.
 * Booking Core never sees this type — only the mapped BookableSnapshot.
 */
export type TourDeparture = {
  id: string;
  tenantId: string;
  tourId: string;
  startDate: Date;
  endDate: Date;
  capacity: number;
  /** Commercial data owned by Travel, not Booking Core. */
  priceAmount?: number;
  currency?: string;
};
