import { Injectable } from "@nestjs/common";
import { DestinationsRepository } from "./destinations.repository";

@Injectable()
export class DestinationsService {
  constructor(private readonly destinations: DestinationsRepository) {}
}
