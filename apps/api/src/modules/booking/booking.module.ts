import { Module } from "@nestjs/common";

/**
 * Generic reservation engine. Industry-agnostic by design.
 *
 * Controllers live in `presentation/`. Use cases live in `application/`.
 * Domain entities stay free of NestJS decorators.
 */
@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class BookingModule {}
