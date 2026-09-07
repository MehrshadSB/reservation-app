import { Injectable } from "@nestjs/common";
import { TourRepository } from "../infrastructure/tour.repository";

/**
 * Tour catalog. Does not create bookings.
 */
@Injectable()
export class TourService {
  constructor(private readonly tours: TourRepository) {}
}
