export { AvailabilityModule } from "./availability.module";
export { AvailabilityService } from "./application/availability.service";
export type { AvailabilityStrategy } from "./domain/strategies/availability-strategy";
export { capacityAvailabilityStrategy } from "./domain/strategies/capacity.strategy";
export type {
  CheckAvailabilityQuery,
  CheckAvailabilityResult,
  RegisterInventoryCommand,
  ReleaseUnitsCommand,
  ReserveUnitsCommand,
} from "./availability.types";
