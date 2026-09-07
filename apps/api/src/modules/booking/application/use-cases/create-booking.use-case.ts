import { Inject, Injectable } from "@nestjs/common";
import type { Booking } from "../../domain/entities/booking";
import type { CreateBookingCommand } from "../booking-commands";
import type { AvailabilityPort } from "../ports/availability.port";
import type { BookingRepository } from "../ports/booking-repository.port";
import { AVAILABILITY_PORT, BOOKING_REPOSITORY } from "../ports/tokens";

/**
 * Intended flow (not implemented):
 * 1. Ask AvailabilityPort.check
 * 2. Persist a Booking (PENDING/RESERVED)
 * 3. AvailabilityPort.reserve
 * 4. Never inspect offeringType
 */
@Injectable()
export class CreateBookingUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookings: BookingRepository,
    @Inject(AVAILABILITY_PORT)
    private readonly availability: AvailabilityPort,
  ) {}

  async execute(command: CreateBookingCommand): Promise<Booking> {
    void this.bookings;
    void this.availability;
    void command;
    throw new Error("CreateBookingUseCase is not implemented yet");
  }
}
