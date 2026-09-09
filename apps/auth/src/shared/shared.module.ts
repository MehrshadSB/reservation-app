import { Global, Module } from "@nestjs/common";
import { AuthConfigService } from "./config/auth-config.service";
import { HealthController } from "./health.controller";

@Global()
@Module({
  controllers: [HealthController],
  providers: [AuthConfigService],
  exports: [AuthConfigService],
})
export class SharedModule {}
