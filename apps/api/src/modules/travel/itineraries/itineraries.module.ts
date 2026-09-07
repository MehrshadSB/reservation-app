import { Module } from "@nestjs/common";
import { ItinerariesController } from "./itineraries.controller";
import { ItinerariesRepository } from "./itineraries.repository";
import { ItinerariesService } from "./itineraries.service";

@Module({
  controllers: [ItinerariesController],
  providers: [ItinerariesService, ItinerariesRepository],
  exports: [ItinerariesService],
})
export class ItinerariesModule {}
