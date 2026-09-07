import { Controller } from "@nestjs/common";
import { ItinerariesService } from "./itineraries.service";

@Controller("travel/itineraries")
export class ItinerariesController {
  constructor(private readonly itinerariesService: ItinerariesService) {}
}
