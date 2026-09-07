import { Injectable } from "@nestjs/common";
import { ItinerariesRepository } from "./itineraries.repository";

@Injectable()
export class ItinerariesService {
  constructor(private readonly itineraries: ItinerariesRepository) {}
}
