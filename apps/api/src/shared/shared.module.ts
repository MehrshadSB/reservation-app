import { Global, Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { DatabaseModule } from "./database/database.module";

/**
 * Cross-cutting Nest providers (tenant context, guards, filters).
 * Keep this small. Domain rules do not belong here.
 */
@Global()
@Module({
  imports: [DatabaseModule],
  controllers: [HealthController],
})
export class SharedModule {}
