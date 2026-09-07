import { Module } from "@nestjs/common";
import { DestinationsController } from "./destinations.controller";
import { DestinationsRepository } from "./destinations.repository";
import { DestinationsService } from "./destinations.service";

@Module({
  controllers: [DestinationsController],
  providers: [DestinationsService, DestinationsRepository],
  exports: [DestinationsService],
})
export class DestinationsModule {}
