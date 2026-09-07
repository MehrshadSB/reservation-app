import type { AvailabilityStrategy } from "./availability-strategy";

/**
 * First strategy: remaining units on a fixed occurrence (tour departure).
 * TIME_SLOT, DATE_RANGE, and EXCLUSIVE_RESOURCE stay unimplemented.
 */
export const capacityAvailabilityStrategy: AvailabilityStrategy = {
  mode: "CAPACITY",
  canReserve(inventory, quantity) {
    void inventory;
    void quantity;
    throw new Error("CAPACITY availability strategy is not implemented yet");
  },
};
