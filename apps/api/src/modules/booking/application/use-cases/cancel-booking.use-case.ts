import { Inject, Injectable } from "@nestjs/common";
import type { Booking } from "../../domain/entities/booking";
import type { CancelBookingCommand } from "../booking-commands";
import type { AvailabilityPort } from "../ports/availability.port";
import type { BookingRepository } from "../ports/booking-repository.port";
import { AVAILABILITY_PORT, BOOKING_REPOSITORY } from "../ports/tokens";

@Injectable()
export class CancelBookingUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookings: BookingRepository,
    @Inject(AVAILABILITY_PORT)
    private readonly availability: AvailabilityPort,
  ) {}

  async execute(command: CancelBookingCommand): Promise<Booking> {
    void this.bookings;
    void this.availability;
    void command;
    throw new Error("CancelBookingUseCase is not implemented yet");
  }
}
