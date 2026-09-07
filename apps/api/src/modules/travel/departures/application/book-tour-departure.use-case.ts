import { Injectable } from "@nestjs/common";
import { BookingService } from "../../../booking/application/booking.service";
import { TravelersService } from "../../travelers/travelers.service";
import { TourDepartureRepository } from "../infrastructure/tour-departure.repository";
import type { BookTourDepartureCommand } from "./commands";
import { toBookableSnapshot } from "./tour-departure.mapper";

/**
 * Intended flow (not implemented):
 * 1. Load TourDeparture
 * 2. Travel-specific rules (later)
 * 3. BookingService.create({ snapshot: toBookableSnapshot(departure), quantity })
 * 4. Persist travelers linked to booking.id
 *
 * Do not call Availability from here. Booking Core checks inventory.
 */
@Injectable()
export class BookTourDepartureUseCase {
  constructor(
    private readonly departures: TourDepartureRepository,
    private readonly bookings: BookingService,
    private readonly travelers: TravelersService,
  ) {}

  async execute(command: BookTourDepartureCommand): Promise<void> {
    void this.departures;
    void this.bookings;
    void this.travelers;
    void toBookableSnapshot;
    void command;
    throw new Error("BookTourDepartureUseCase is not implemented yet");
  }
}
