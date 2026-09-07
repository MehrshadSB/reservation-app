import { Injectable } from "@nestjs/common";
import { ServiceRepository } from "./service.repository";

@Injectable()
export class ServiceCatalogService {
  constructor(private readonly serviceRepository: ServiceRepository) {}
}
