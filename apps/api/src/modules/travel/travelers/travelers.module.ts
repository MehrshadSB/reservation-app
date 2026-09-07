import { Module } from "@nestjs/common";
import { TravelersRepository } from "./travelers.repository";
import { TravelersService } from "./travelers.service";

@Module({
  providers: [TravelersService, TravelersRepository],
  exports: [TravelersService],
})
export class TravelersModule {}
