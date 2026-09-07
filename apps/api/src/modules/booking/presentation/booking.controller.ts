import { Controller } from "@nestjs/common";
import { BookingService } from "../application/booking.service";

/**
 * Generic booking lifecycle HTTP (get, confirm, cancel, list).
 * Industry create flows (tour booking with travelers) belong on the
 * industry module, so travel rules are not skipped.
 */
@Controller("bookings")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
}
