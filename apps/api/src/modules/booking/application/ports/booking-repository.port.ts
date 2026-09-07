import type { Booking } from "../../domain/entities/booking";

/**
 * Persistence port. Infrastructure implements this. Domain does not import Prisma.
 */
export type BookingRepository = {
  findById(tenantId: string, bookingId: string): Promise<Booking | null>;
  save(booking: Booking): Promise<void>;
};
