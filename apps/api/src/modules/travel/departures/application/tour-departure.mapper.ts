import type { RegisterInventoryCommand } from "../../../availability/availability.types";
import type { BookableSnapshot } from "../../../booking/domain/value-objects/bookable-snapshot";
import { TOUR_DEPARTURE_OFFERING_TYPE } from "../../offering-type";
import type { TourDeparture } from "../domain/tour-departure";

/**
 * Anti-corruption mapping: Travel occurrence → generic booking/availability.
 * This is the extension point. A future hotel module will have its own mapper.
 */
export function toBookableSnapshot(departure: TourDeparture): BookableSnapshot {
  return {
    offering: {
      offeringId: departure.id,
      offeringType: TOUR_DEPARTURE_OFFERING_TYPE,
    },
    mode: "CAPACITY",
    timeRange: {
      start: departure.startDate,
      end: departure.endDate,
    },
  };
}

export function toRegisterInventoryCommand(
  tenantId: string,
  departure: TourDeparture,
): RegisterInventoryCommand {
  return {
    tenantId,
    offering: {
      offeringId: departure.id,
      offeringType: TOUR_DEPARTURE_OFFERING_TYPE,
    },
    mode: "CAPACITY",
    timeRange: {
      start: departure.startDate,
      end: departure.endDate,
    },
    totalCapacity: departure.capacity,
  };
}
