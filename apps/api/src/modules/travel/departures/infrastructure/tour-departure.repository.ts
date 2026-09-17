import { Injectable } from "@nestjs/common";
import type { TourDeparture } from "../domain/tour-departure";

@Injectable()
export class TourDepartureRepository {
  async findById(
    tenantId: string,
    departureId: string,
  ): Promise<TourDeparture | null> {
    // Queries must include organizationId (tenantId). Never look up by id alone.
    void tenantId;
    void departureId;
    throw new Error("TourDepartureRepository is not implemented yet");
  }

  async save(departure: TourDeparture): Promise<void> {
    void departure;
    throw new Error("TourDepartureRepository is not implemented yet");
  }
}
