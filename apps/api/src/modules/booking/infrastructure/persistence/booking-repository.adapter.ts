import { Injectable } from "@nestjs/common";
import type { Booking } from "../../domain/entities/booking";
import type { BookingRepository } from "../../application/ports/booking-repository.port";

@Injectable()
export class BookingRepositoryAdapter implements BookingRepository {
  async findById(
    tenantId: string,
    bookingId: string,
  ): Promise<Booking | null> {
    // Queries must include organizationId (tenantId). Never look up by id alone.
    void tenantId;
    void bookingId;
    throw new Error("BookingRepositoryAdapter is not implemented yet");
  }

  async save(booking: Booking): Promise<void> {
    void booking;
    throw new Error("BookingRepositoryAdapter is not implemented yet");
  }
}
