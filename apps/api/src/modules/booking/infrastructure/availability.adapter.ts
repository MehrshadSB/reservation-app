import { Injectable } from "@nestjs/common";
import { AvailabilityService } from "../../availability/application/availability.service";
import type {
  AvailabilityCheckQuery,
  AvailabilityCheckResult,
  AvailabilityPort,
  AvailabilityReservationCommand,
} from "../application/ports/availability.port";

/**
 * Maps Booking Core's availability port onto AvailabilityModule.
 * This is the only booking infrastructure file allowed to import availability.
 */
@Injectable()
export class AvailabilityAdapter implements AvailabilityPort {
  constructor(private readonly availability: AvailabilityService) {}

  check(query: AvailabilityCheckQuery): Promise<AvailabilityCheckResult> {
    void this.availability;
    void query;
    throw new Error("AvailabilityAdapter.check is not implemented yet");
  }

  reserve(command: AvailabilityReservationCommand): Promise<void> {
    void this.availability;
    void command;
    throw new Error("AvailabilityAdapter.reserve is not implemented yet");
  }

  release(command: AvailabilityReservationCommand): Promise<void> {
    void this.availability;
    void command;
    throw new Error("AvailabilityAdapter.release is not implemented yet");
  }
}
