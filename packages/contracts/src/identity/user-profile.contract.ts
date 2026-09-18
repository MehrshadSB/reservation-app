export type KycStatus = "unverified" | "pending" | "verified" | "rejected";

export type UserProfileResponse = {
  givenName: string | null;
  familyName: string | null;
  nationalId: string | null;
  dateOfBirth: string | null;
  nationality: string | null;
  country: string | null;
  city: string | null;
  addressLine: string | null;
  kycStatus: KycStatus;
  kycSubmittedAt: string | null;
  kycVerifiedAt: string | null;
  updatedAt: string;
};

export type UpsertUserProfileRequest = {
  givenName?: string;
  familyName?: string;
  nationalId?: string;
  dateOfBirth?: string;
  nationality?: string;
  country?: string;
  city?: string;
  addressLine?: string;
};
