import type { AvailabilityInventory } from "../../domain/entities/availability-inventory";
import type { BookableOfferingRef } from "../../../../shared/kernel/bookable-offering-ref";

export type AvailabilityInventoryRepository = {
  find(
    tenantId: string,
    offering: BookableOfferingRef,
  ): Promise<AvailabilityInventory | null>;
  save(inventory: AvailabilityInventory): Promise<void>;
};
