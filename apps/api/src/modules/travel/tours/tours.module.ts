import { Module } from "@nestjs/common";
import { TourService } from "./application/tour.service";
import { TourRepository } from "./infrastructure/tour.repository";
import { TourController } from "./presentation/tour.controller";

@Module({
  controllers: [TourController],
  providers: [TourService, TourRepository],
  exports: [TourService],
})
export class ToursModule {}
