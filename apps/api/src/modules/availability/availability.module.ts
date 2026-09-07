import { Module } from "@nestjs/common";
import { AvailabilityService } from "./application/availability.service";
import { AVAILABILITY_INVENTORY_REPOSITORY } from "./application/ports/tokens";
import { AvailabilityInventoryAdapter } from "./infrastructure/persistence/availability-inventory.adapter";

/**
 * Generic availability engine. Does not import booking or travel.
 */
@Module({
  controllers: [],
  providers: [
    AvailabilityService,
    {
      provide: AVAILABILITY_INVENTORY_REPOSITORY,
      useClass: AvailabilityInventoryAdapter,
    },
  ],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}
