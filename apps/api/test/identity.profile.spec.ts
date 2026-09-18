import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { HttpException } from "@nestjs/common";
import { ProfileService } from "../src/modules/identity/application/profile.service";
import type { UserProfile } from "../src/modules/identity/domain/entities/user-profile";
import { InMemoryProfileRepository } from "../src/modules/identity/infrastructure/persistence/in-memory-profile.repository";

function statusOf(error: unknown): number {
  assert.ok(error instanceof HttpException);
  return error.getStatus();
}

function createProfileService() {
  const profiles = new InMemoryProfileRepository();
  return {
    profiles,
    service: new ProfileService(profiles),
  };
}

const completeKyc = {
  givenName: "Sara",
  familyName: "Karimi",
  nationalId: "0012345678",
  dateOfBirth: "1990-04-12",
};

describe("identity KYC profile", () => {
  it("stays unverified until required KYC fields are present", async () => {
    const { service } = createProfileService();
    const profile = await service.upsert("user-1", { givenName: "Sara" });
    assert.equal(profile.kycStatus, "unverified");
    assert.equal(profile.kycSubmittedAt, null);
  });

  it("moves to pending when KYC fields are complete", async () => {
    const { service } = createProfileService();
    const profile = await service.upsert("user-1", {
      ...completeKyc,
      nationality: "ir",
      country: "IR",
      city: "Tehran",
    });
    assert.equal(profile.kycStatus, "pending");
    assert.equal(profile.nationality, "IR");
    assert.ok(profile.kycSubmittedAt);
    assert.equal(profile.kycVerifiedAt, null);
  });

  it("keeps verified status when only address fields change", async () => {
    const { service, profiles } = createProfileService();
    const pending = await service.upsert("user-1", completeKyc);
    const verified: UserProfile = {
      ...pending,
      kycStatus: "verified",
      kycVerifiedAt: new Date("2026-01-01T00:00:00.000Z"),
    };
    await profiles.save(verified);

    const updated = await service.upsert("user-1", {
      city: "Isfahan",
      addressLine: "Street 1",
    });
    assert.equal(updated.kycStatus, "verified");
    assert.equal(updated.city, "Isfahan");
    assert.equal(updated.kycVerifiedAt?.toISOString(), "2026-01-01T00:00:00.000Z");
  });

  it("drops verified to pending when a material KYC field changes", async () => {
    const { service, profiles } = createProfileService();
    const pending = await service.upsert("user-1", completeKyc);
    await profiles.save({
      ...pending,
      kycStatus: "verified",
      kycVerifiedAt: new Date(),
    });

    const updated = await service.upsert("user-1", { familyName: "Ahmadi" });
    assert.equal(updated.kycStatus, "pending");
    assert.equal(updated.kycVerifiedAt, null);
    assert.equal(updated.familyName, "Ahmadi");
  });

  it("rejects a national ID already used by another user", async () => {
    const { service } = createProfileService();
    await service.upsert("user-1", completeKyc);
    await assert.rejects(
      () => service.upsert("user-2", completeKyc),
      (error: unknown) => statusOf(error) === 409,
    );
  });

  it("rejects an invalid date of birth", async () => {
    const { service } = createProfileService();
    await assert.rejects(
      () => service.upsert("user-1", { dateOfBirth: "1990-13-40" }),
      (error: unknown) => statusOf(error) === 400,
    );
  });
});
