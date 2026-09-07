import { Injectable } from "@nestjs/common";
import type { Tour } from "../domain/tour";

@Injectable()
export class TourRepository {
  async findById(tenantId: string, tourId: string): Promise<Tour | null> {
    void tenantId;
    void tourId;
    throw new Error("TourRepository is not implemented yet");
  }

  async save(tour: Tour): Promise<void> {
    void tour;
    throw new Error("TourRepository is not implemented yet");
  }
}
