import { Global, Module } from "@nestjs/common";
import { HealthController } from "./health.controller";

/**
 * Cross-cutting Nest providers (tenant context, guards, filters).
 * Keep this small. Domain rules do not belong here.
 */
@Global()
@Module({
  controllers: [HealthController],
})
export class SharedModule {}
