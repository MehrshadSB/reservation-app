import { Injectable } from "@nestjs/common";
import type { AvailabilityInventory } from "../../domain/entities/availability-inventory";
import type { AvailabilityInventoryRepository } from "../../application/ports/availability-inventory.port";
import type { BookableOfferingRef } from "../../../../shared/kernel/bookable-offering-ref";

@Injectable()
export class AvailabilityInventoryAdapter implements AvailabilityInventoryRepository {
  async find(
    tenantId: string,
    offering: BookableOfferingRef,
  ): Promise<AvailabilityInventory | null> {
    void tenantId;
    void offering;
    throw new Error("AvailabilityInventoryAdapter is not implemented yet");
  }

  async save(inventory: AvailabilityInventory): Promise<void> {
    void inventory;
    throw new Error("AvailabilityInventoryAdapter is not implemented yet");
  }
}
