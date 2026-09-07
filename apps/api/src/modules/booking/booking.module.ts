import { Module } from "@nestjs/common";
import { AvailabilityModule } from "../availability/availability.module";
import { BookingService } from "./application/booking.service";
import { AVAILABILITY_PORT, BOOKING_REPOSITORY } from "./application/ports/tokens";
import { CancelBookingUseCase } from "./application/use-cases/cancel-booking.use-case";
import { ConfirmBookingUseCase } from "./application/use-cases/confirm-booking.use-case";
import { CreateBookingUseCase } from "./application/use-cases/create-booking.use-case";
import { RescheduleBookingUseCase } from "./application/use-cases/reschedule-booking.use-case";
import { AvailabilityAdapter } from "./infrastructure/availability.adapter";
import { BookingRepositoryAdapter } from "./infrastructure/persistence/booking-repository.adapter";
import { BookingController } from "./presentation/booking.controller";

/**
 * Generic reservation engine. Industry-agnostic by design.
 *
 * Exports BookingService so extensions can compose it.
 * Does not import travel or any other industry module.
 */
@Module({
  imports: [AvailabilityModule],
  controllers: [BookingController],
  providers: [
    BookingService,
    CreateBookingUseCase,
    ConfirmBookingUseCase,
    CancelBookingUseCase,
    RescheduleBookingUseCase,
    { provide: BOOKING_REPOSITORY, useClass: BookingRepositoryAdapter },
    { provide: AVAILABILITY_PORT, useClass: AvailabilityAdapter },
  ],
  exports: [BookingService],
})
export class BookingModule {}
