import { Module } from "@nestjs/common";
import { coreModules, extensionModules } from "./modules/registry";
import { SharedModule } from "./shared/shared.module";

/**
 * Composition root.
 *
 * Core modules are registered here. Industry extensions (Travel first)
 * are composed alongside them — they never patch Booking Core with
 * `if (businessType === ...)` branches.
 */
@Module({
  imports: [SharedModule, ...coreModules, ...extensionModules],
})
export class AppModule {}
