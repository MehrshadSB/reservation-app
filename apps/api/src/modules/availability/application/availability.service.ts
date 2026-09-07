import { Inject, Injectable } from "@nestjs/common";
import type {
  CheckAvailabilityQuery,
  CheckAvailabilityResult,
  RegisterInventoryCommand,
  ReleaseUnitsCommand,
  ReserveUnitsCommand,
} from "../availability.types";
import type { AvailabilityInventoryRepository } from "./ports/availability-inventory.port";
import { AVAILABILITY_INVENTORY_REPOSITORY } from "./ports/tokens";

/**
 * Public API of the availability engine.
 *
 * Travel registers inventory when a departure is published.
 * Booking Core checks/reserves/releases through its own adapter.
 */
@Injectable()
export class AvailabilityService {
  constructor(
    @Inject(AVAILABILITY_INVENTORY_REPOSITORY)
    private readonly inventory: AvailabilityInventoryRepository,
  ) {}

  async register(command: RegisterInventoryCommand): Promise<void> {
    void this.inventory;
    void command;
    throw new Error("AvailabilityService.register is not implemented yet");
  }

  async check(query: CheckAvailabilityQuery): Promise<CheckAvailabilityResult> {
    void this.inventory;
    void query;
    throw new Error("AvailabilityService.check is not implemented yet");
  }

  async reserve(command: ReserveUnitsCommand): Promise<void> {
    void this.inventory;
    void command;
    throw new Error("AvailabilityService.reserve is not implemented yet");
  }

  async release(command: ReleaseUnitsCommand): Promise<void> {
    void this.inventory;
    void command;
    throw new Error("AvailabilityService.release is not implemented yet");
  }
}
