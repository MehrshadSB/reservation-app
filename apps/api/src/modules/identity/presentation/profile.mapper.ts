import type { UserProfileResponse } from "@repo/contracts/identity";
import type { UserProfile } from "../domain/entities/user-profile";

export function toProfileResponse(profile: UserProfile): UserProfileResponse {
  return {
    givenName: profile.givenName,
    familyName: profile.familyName,
    nationalId: profile.nationalId,
    dateOfBirth: profile.dateOfBirth,
    nationality: profile.nationality,
    country: profile.country,
    city: profile.city,
    addressLine: profile.addressLine,
    kycStatus: profile.kycStatus,
    kycSubmittedAt: profile.kycSubmittedAt?.toISOString() ?? null,
    kycVerifiedAt: profile.kycVerifiedAt?.toISOString() ?? null,
    updatedAt: profile.updatedAt.toISOString(),
  };
}
