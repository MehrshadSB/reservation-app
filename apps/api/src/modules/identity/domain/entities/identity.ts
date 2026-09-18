import type { IdentityStatus } from "@repo/contracts/identity";

export type Identity = {
  id: string;
  phoneNumber: string;
  status: IdentityStatus;
  isPlatformAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
};
