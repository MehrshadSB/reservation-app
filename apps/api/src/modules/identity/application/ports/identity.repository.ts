import type { Identity } from "../../domain/entities/identity";

export type IdentityRepository = {
  findById(id: string): Promise<Identity | undefined>;
  findByPhoneNumber(phoneNumber: string): Promise<Identity | undefined>;
  save(identity: Identity): Promise<void>;
};
