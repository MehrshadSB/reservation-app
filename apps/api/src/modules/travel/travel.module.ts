import { Module } from "@nestjs/common";
import { DeparturesModule } from "./departures/departures.module";
import { DestinationsModule } from "./destinations/destinations.module";
import { ItinerariesModule } from "./itineraries/itineraries.module";
import { ToursModule } from "./tours/tours.module";
import { TravelersModule } from "./travelers/travelers.module";

/**
 * First industry vertical. Composes Booking Core; core does not import this.
 */
@Module({
  imports: [
    ToursModule,
    DeparturesModule,
    DestinationsModule,
    ItinerariesModule,
    TravelersModule,
  ],
})
export class TravelModule {}
