import { Controller } from "@nestjs/common";
import { DestinationsService } from "./destinations.service";

@Controller("travel/destinations")
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}
}
