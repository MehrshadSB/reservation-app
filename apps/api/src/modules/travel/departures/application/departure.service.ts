import { Injectable } from "@nestjs/common";
import type { BookTourDepartureCommand, PublishTourDepartureCommand } from "./commands";
import { BookTourDepartureUseCase } from "./book-tour-departure.use-case";
import { PublishTourDepartureUseCase } from "./publish-tour-departure.use-case";

/**
 * Travel-facing facade. HTTP and other travel use cases call this,
 * not BookingService directly.
 */
@Injectable()
export class DepartureService {
  constructor(
    private readonly publishDeparture: PublishTourDepartureUseCase,
    private readonly bookDeparture: BookTourDepartureUseCase,
  ) {}

  publish(command: PublishTourDepartureCommand): Promise<void> {
    return this.publishDeparture.execute(command);
  }

  book(command: BookTourDepartureCommand): Promise<void> {
    return this.bookDeparture.execute(command);
  }
}
