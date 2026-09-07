import { Module } from "@nestjs/common";
import { AvailabilityModule } from "../../availability/availability.module";
import { BookingModule } from "../../booking/booking.module";
import { TravelersModule } from "../travelers/travelers.module";
import { BookTourDepartureUseCase } from "./application/book-tour-departure.use-case";
import { DepartureService } from "./application/departure.service";
import { PublishTourDepartureUseCase } from "./application/publish-tour-departure.use-case";
import { TourDepartureRepository } from "./infrastructure/tour-departure.repository";
import { DepartureController } from "./presentation/departure.controller";

/**
 * Composes Booking Core and Availability. Core modules do not import this.
 */
@Module({
  imports: [BookingModule, AvailabilityModule, TravelersModule],
  controllers: [DepartureController],
  providers: [
    DepartureService,
    PublishTourDepartureUseCase,
    BookTourDepartureUseCase,
    TourDepartureRepository,
  ],
  exports: [DepartureService],
})
export class DeparturesModule {}
