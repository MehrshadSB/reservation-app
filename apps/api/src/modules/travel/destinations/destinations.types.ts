/**
 * Geographic catalog entry. Tours reference a destination; bookings do not.
 */
export type Destination = {
  id: string;
  tenantId: string;
  name: string;
};
