import type { Identity, SystemUser } from "../../domain/identity";

export type IdentityRepository = {
  findById(id: string): Promise<Identity | undefined>;
  findByPhoneNumber(phoneNumber: string): Promise<Identity | undefined>;
  save(identity: Identity): Promise<void>;
};

export type SystemUserRepository = {
  findByIdentityId(identityId: string): Promise<SystemUser | undefined>;
  save(user: SystemUser): Promise<void>;
};
