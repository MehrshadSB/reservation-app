import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from "@nestjs/common";
import { createId } from "../infrastructure/crypto";
import type { KycStatus, UserProfile } from "../domain/entities/user-profile";
import type { UserProfileRepository } from "./ports/profile.repository";
import { PROFILE_REPOSITORY } from "./ports/tokens";

export type UpsertProfileInput = {
  givenName?: string;
  familyName?: string;
  nationalId?: string;
  dateOfBirth?: string;
  nationality?: string;
  country?: string;
  city?: string;
  addressLine?: string;
};

const LIMITS = {
  givenName: 100,
  familyName: 100,
  nationalId: 32,
  city: 100,
  addressLine: 255,
} as const;

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

function normalizeText(
  value: string | undefined,
  existing: string | null,
  max: number,
  field: string,
): string | null {
  if (value === undefined) {
    return existing;
  }
  const normalized = emptyToNull(value);
  if (!normalized) {
    return null;
  }
  if (normalized.length > max) {
    throw new BadRequestException(`${field} is too long`);
  }
  return normalized;
}

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function normalizeDate(
  value: string | undefined,
  existing: string | null,
): string | null {
  if (value === undefined) {
    return existing;
  }
  const normalized = emptyToNull(value);
  if (!normalized) {
    return null;
  }
  if (!isIsoDate(normalized)) {
    throw new BadRequestException("dateOfBirth must be YYYY-MM-DD");
  }
  return normalized;
}

function normalizeAlpha2(
  value: string | undefined,
  existing: string | null,
  field: string,
): string | null {
  if (value === undefined) {
    return existing;
  }
  const normalized = emptyToNull(value);
  if (!normalized) {
    return null;
  }
  const upper = normalized.toUpperCase();
  if (!/^[A-Z]{2}$/.test(upper)) {
    throw new BadRequestException(`${field} must be an ISO 3166 alpha-2 code`);
  }
  return upper;
}

function hasRequiredKycFields(profile: {
  givenName: string | null;
  familyName: string | null;
  nationalId: string | null;
  dateOfBirth: string | null;
}): boolean {
  return Boolean(
    profile.givenName &&
      profile.familyName &&
      profile.nationalId &&
      profile.dateOfBirth,
  );
}

function nextKycStatus(input: {
  previous: UserProfile | undefined;
  next: Pick<
    UserProfile,
    "givenName" | "familyName" | "nationalId" | "dateOfBirth"
  >;
}): { kycStatus: KycStatus; submittedAt: Date | null; verifiedAt: Date | null } {
  const complete = hasRequiredKycFields(input.next);
  if (!complete) {
    return {
      kycStatus: "unverified",
      submittedAt: null,
      verifiedAt: null,
    };
  }

  const materialChanged =
    input.previous !== undefined &&
    (input.previous.givenName !== input.next.givenName ||
      input.previous.familyName !== input.next.familyName ||
      input.previous.nationalId !== input.next.nationalId ||
      input.previous.dateOfBirth !== input.next.dateOfBirth);

  if (input.previous?.kycStatus === "verified" && !materialChanged) {
    return {
      kycStatus: "verified",
      submittedAt: input.previous.kycSubmittedAt,
      verifiedAt: input.previous.kycVerifiedAt,
    };
  }

  if (input.previous?.kycStatus === "pending" && !materialChanged) {
    return {
      kycStatus: "pending",
      submittedAt: input.previous.kycSubmittedAt,
      verifiedAt: null,
    };
  }

  return {
    kycStatus: "pending",
    submittedAt: new Date(),
    verifiedAt: null,
  };
}

@Injectable()
export class ProfileService {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profiles: UserProfileRepository,
  ) {}

  async getByUserId(userId: string): Promise<UserProfile | undefined> {
    return this.profiles.findByUserId(userId);
  }

  async upsert(userId: string, input: UpsertProfileInput): Promise<UserProfile> {
    const existing = await this.profiles.findByUserId(userId);
    const now = new Date();
    const givenName = normalizeText(
      input.givenName,
      existing?.givenName ?? null,
      LIMITS.givenName,
      "givenName",
    );
    const familyName = normalizeText(
      input.familyName,
      existing?.familyName ?? null,
      LIMITS.familyName,
      "familyName",
    );
    const nationalId = normalizeText(
      input.nationalId,
      existing?.nationalId ?? null,
      LIMITS.nationalId,
      "nationalId",
    );
    const dateOfBirth = normalizeDate(
      input.dateOfBirth,
      existing?.dateOfBirth ?? null,
    );
    const status = nextKycStatus({
      previous: existing,
      next: { givenName, familyName, nationalId, dateOfBirth },
    });

    if (nationalId) {
      const other = await this.profiles.findByNationalId(nationalId);
      if (other && other.userId !== userId) {
        throw new ConflictException("national ID already registered");
      }
    }

    const profile: UserProfile = {
      id: existing?.id ?? createId(),
      userId,
      givenName,
      familyName,
      nationalId,
      dateOfBirth,
      nationality: normalizeAlpha2(
        input.nationality,
        existing?.nationality ?? null,
        "nationality",
      ),
      country: normalizeAlpha2(
        input.country,
        existing?.country ?? null,
        "country",
      ),
      city: normalizeText(
        input.city,
        existing?.city ?? null,
        LIMITS.city,
        "city",
      ),
      addressLine: normalizeText(
        input.addressLine,
        existing?.addressLine ?? null,
        LIMITS.addressLine,
        "addressLine",
      ),
      kycStatus: status.kycStatus,
      kycSubmittedAt: status.submittedAt,
      kycVerifiedAt: status.verifiedAt,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    await this.profiles.save(profile);
    return profile;
  }
}
