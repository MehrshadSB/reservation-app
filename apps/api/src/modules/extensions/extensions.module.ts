import { Module } from "@nestjs/common";
import { TravelModule } from "../travel/travel.module";

/**
 * Industry extensions. They compose Booking Core through exported facades
 * and never add `if (businessType === ...)` to core modules.
 */
@Module({
  imports: [TravelModule],
})
export class ExtensionsModule {}
