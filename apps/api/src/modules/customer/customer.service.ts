import { Injectable } from "@nestjs/common";
import { CustomerRepository } from "./customer.repository";

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}
}
