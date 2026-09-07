export type PublishTourDepartureCommand = {
  tenantId: string;
  tourId: string;
  startDate: Date;
  endDate: Date;
  capacity: number;
  priceAmount?: number;
  currency?: string;
};

export type BookTourDepartureCommand = {
  tenantId: string;
  customerId: string;
  departureId: string;
  travelers: ReadonlyArray<{ displayName: string }>;
};
