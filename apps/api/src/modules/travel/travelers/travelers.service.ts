import { Injectable } from "@nestjs/common";
import { TravelersRepository } from "./travelers.repository";

@Injectable()
export class TravelersService {
  constructor(private readonly travelers: TravelersRepository) {}
}
