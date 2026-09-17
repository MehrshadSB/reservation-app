import { Injectable } from "@nestjs/common";
import type { Tour } from "../domain/tour";

@Injectable()
export class TourRepository {
  async findById(tenantId: string, tourId: string): Promise<Tour | null> {
    // Queries must include organizationId (tenantId). Never look up by id alone.
    void tenantId;
    void tourId;
    throw new Error("TourRepository is not implemented yet");
  }

  async save(tour: Tour): Promise<void> {
    void tour;
    throw new Error("TourRepository is not implemented yet");
  }
}
