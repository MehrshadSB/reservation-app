import type { KycStatus } from "@repo/contracts/identity";

export type { KycStatus };

export type UserProfile = {
  id: string;
  userId: string;
  givenName: string | null;
  familyName: string | null;
  nationalId: string | null;
  dateOfBirth: string | null;
  nationality: string | null;
  country: string | null;
  city: string | null;
  addressLine: string | null;
  kycStatus: KycStatus;
  kycSubmittedAt: Date | null;
  kycVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
