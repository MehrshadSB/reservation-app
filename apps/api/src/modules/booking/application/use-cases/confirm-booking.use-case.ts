import { Inject, Injectable } from "@nestjs/common";
import type { Booking } from "../../domain/entities/booking";
import type { ConfirmBookingCommand } from "../booking-commands";
import type { BookingRepository } from "../ports/booking-repository.port";
import { BOOKING_REPOSITORY } from "../ports/tokens";

@Injectable()
export class ConfirmBookingUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookings: BookingRepository,
  ) {}

  async execute(command: ConfirmBookingCommand): Promise<Booking> {
    void this.bookings;
    void command;
    throw new Error("ConfirmBookingUseCase is not implemented yet");
  }
}
