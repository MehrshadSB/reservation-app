import { ConflictException } from "@nestjs/common";
import { eq, type Database, userProfiles } from "@repo/database";
import type { UserProfile } from "../../domain/entities/user-profile";
import type { UserProfileRepository } from "../../application/ports/profile.repository";

function toProfile(row: typeof userProfiles.$inferSelect): UserProfile {
  return {
    id: row.id,
    userId: row.userId,
    givenName: row.givenName,
    familyName: row.familyName,
    nationalId: row.nationalId,
    dateOfBirth: row.dateOfBirth,
    nationality: row.nationality,
    country: row.country,
    city: row.city,
    addressLine: row.addressLine,
    kycStatus: row.kycStatus,
    kycSubmittedAt: row.kycSubmittedAt,
    kycVerifiedAt: row.kycVerifiedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function isUniqueViolation(error: unknown): boolean {
  const candidates = [error];
  if (typeof error === "object" && error !== null && "cause" in error) {
    candidates.push((error as { cause: unknown }).cause);
  }
  return candidates.some(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      "code" in item &&
      (item as { code: string }).code === "23505",
  );
}

export class DrizzleProfileRepository implements UserProfileRepository {
  constructor(private readonly db: Database) {}

  async findByUserId(userId: string): Promise<UserProfile | undefined> {
    const [row] = await this.db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);
    return row ? toProfile(row) : undefined;
  }

  async findByNationalId(nationalId: string): Promise<UserProfile | undefined> {
    const [row] = await this.db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.nationalId, nationalId))
      .limit(1);
    return row ? toProfile(row) : undefined;
  }

  async save(profile: UserProfile): Promise<void> {
    try {
      await this.db
        .insert(userProfiles)
        .values({
          id: profile.id,
          userId: profile.userId,
          givenName: profile.givenName,
          familyName: profile.familyName,
          nationalId: profile.nationalId,
          dateOfBirth: profile.dateOfBirth,
          nationality: profile.nationality,
          country: profile.country,
          city: profile.city,
          addressLine: profile.addressLine,
          kycStatus: profile.kycStatus,
          kycSubmittedAt: profile.kycSubmittedAt,
          kycVerifiedAt: profile.kycVerifiedAt,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
        })
        .onConflictDoUpdate({
          target: userProfiles.userId,
          set: {
            givenName: profile.givenName,
            familyName: profile.familyName,
            nationalId: profile.nationalId,
            dateOfBirth: profile.dateOfBirth,
            nationality: profile.nationality,
            country: profile.country,
            city: profile.city,
            addressLine: profile.addressLine,
            kycStatus: profile.kycStatus,
            kycSubmittedAt: profile.kycSubmittedAt,
            kycVerifiedAt: profile.kycVerifiedAt,
            updatedAt: profile.updatedAt,
          },
        });
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException("national ID already registered");
      }
      throw error;
    }
  }
}
