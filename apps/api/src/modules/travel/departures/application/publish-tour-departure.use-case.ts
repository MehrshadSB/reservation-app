import { Injectable } from "@nestjs/common";
import { AvailabilityService } from "../../../availability/application/availability.service";
import { TourDepartureRepository } from "../infrastructure/tour-departure.repository";
import type { PublishTourDepartureCommand } from "./commands";
import { toRegisterInventoryCommand } from "./tour-departure.mapper";

/**
 * Intended flow (not implemented):
 * 1. Persist TourDeparture (travel-owned)
 * 2. AvailabilityService.register(toRegisterInventoryCommand(...))
 * 3. Booking Core still knows nothing about tours
 */
@Injectable()
export class PublishTourDepartureUseCase {
  constructor(
    private readonly departures: TourDepartureRepository,
    private readonly availability: AvailabilityService,
  ) {}

  async execute(command: PublishTourDepartureCommand): Promise<void> {
    void this.departures;
    void this.availability;
    void toRegisterInventoryCommand;
    void command;
    throw new Error("PublishTourDepartureUseCase is not implemented yet");
  }
}
