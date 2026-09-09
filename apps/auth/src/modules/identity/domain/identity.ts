import type { IdentityStatus } from "@repo/contracts/identity";

export type Identity = {
  id: string;
  phoneNumber: string;
  status: IdentityStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type SystemUserStatus = "active" | "suspended";

export type SystemUser = {
  id: string;
  identityId: string;
  status: SystemUserStatus;
  createdAt: Date;
  updatedAt: Date;
};
