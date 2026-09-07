import { Module } from "@nestjs/common";
import { ServiceController } from "./service.controller";
import { ServiceRepository } from "./service.repository";
import { ServiceCatalogService } from "./service.service";

/**
 * Bookable offerings and the resource/duration rules they require.
 */
@Module({
  controllers: [ServiceController],
  providers: [ServiceCatalogService, ServiceRepository],
  exports: [ServiceCatalogService],
})
export class ServiceModule {}
