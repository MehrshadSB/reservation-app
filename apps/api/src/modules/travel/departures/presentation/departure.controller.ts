import { Controller } from "@nestjs/common";
import { DepartureService } from "../application/departure.service";

/**
 * Travel HTTP for publishing departures and booking them with travelers.
 * Generic booking lifecycle (confirm/cancel) stays on BookingController.
 */
@Controller("travel/departures")
export class DepartureController {
  constructor(private readonly departureService: DepartureService) {}
}
