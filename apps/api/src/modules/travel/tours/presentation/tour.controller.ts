import { Controller } from "@nestjs/common";
import { TourService } from "../application/tour.service";

@Controller("travel/tours")
export class TourController {
  constructor(private readonly tourService: TourService) {}
}
