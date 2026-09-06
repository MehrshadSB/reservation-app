import { Module } from "@nestjs/common";

/**
 * Industry extensions (hotel, healthcare, salon, rental, events).
 *
 * Import those Nest modules here when they exist. They compose Booking Core
 * through ports — they never add `if (businessType === ...)` to core modules.
 */
@Module({
  imports: [],
})
export class ExtensionsModule {}
