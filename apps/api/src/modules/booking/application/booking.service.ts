import { Injectable } from "@nestjs/common";
import type { Booking } from "../domain/entities/booking";
import type {
  CancelBookingCommand,
  ConfirmBookingCommand,
  CreateBookingCommand,
  RescheduleBookingCommand,
} from "./booking-commands";
import { CancelBookingUseCase } from "./use-cases/cancel-booking.use-case";
import { ConfirmBookingUseCase } from "./use-cases/confirm-booking.use-case";
import { CreateBookingUseCase } from "./use-cases/create-booking.use-case";
import { RescheduleBookingUseCase } from "./use-cases/reschedule-booking.use-case";

/**
 * Public application facade for Booking Core.
 * Industry modules call this. They do not reach into use cases or infrastructure.
 */
@Injectable()
export class BookingService {
  constructor(
    private readonly createBooking: CreateBookingUseCase,
    private readonly confirmBooking: ConfirmBookingUseCase,
    private readonly cancelBooking: CancelBookingUseCase,
    private readonly rescheduleBooking: RescheduleBookingUseCase,
  ) {}

  create(command: CreateBookingCommand): Promise<Booking> {
    return this.createBooking.execute(command);
  }

  confirm(command: ConfirmBookingCommand): Promise<Booking> {
    return this.confirmBooking.execute(command);
  }

  cancel(command: CancelBookingCommand): Promise<Booking> {
    return this.cancelBooking.execute(command);
  }

  reschedule(command: RescheduleBookingCommand): Promise<Booking> {
    return this.rescheduleBooking.execute(command);
  }
}
