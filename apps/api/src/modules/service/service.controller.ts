import { Controller } from "@nestjs/common";
import { ServiceCatalogService } from "./service.service";

@Controller("services")
export class ServiceController {
  constructor(private readonly serviceCatalogService: ServiceCatalogService) {}
}
