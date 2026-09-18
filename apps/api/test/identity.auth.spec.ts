import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { HttpException } from "@nestjs/common";
import { IDENTITY_CONSTANTS } from "../src/modules/identity/domain/identity-constants";
import { sha256 } from "../src/modules/identity/infrastructure/crypto";
import {
  createIdentityServices,
  loginWithPhone,
  requestCode,
} from "./identity-test-utils";

function statusOf(error: unknown): number {
  assert.ok(error instanceof HttpException);
  return error.getStatus();
}

describe("identity authentication", () => {
  it("requests an OTP challenge", async () => {
    const services = createIdentityServices();
    const { challengeId, code } = await requestCode(services, "09120000001");
    assert.equal(challengeId.length > 0, true);
    assert.match(code, /^\d{6}$/);
  });

  it("verifies OTP and creates a user session", async () => {
    const services = createIdentityServices();
    const result = await loginWithPhone(services, "09120000002");
    assert.equal(result.user.phone, "+989120000002");
    const session = await services.sessionService.getByToken(result.token);
    assert.ok(session);
    assert.equal(session.userId, result.user.userId);
  });

  it("rejects an invalid OTP", async () => {
    const services = createIdentityServices();
    const { challengeId } = await requestCode(services, "09120000003");
    await assert.rejects(
      () => services.completeLogin.execute({ challengeId, code: "000000" }),
      (error: unknown) => statusOf(error) === 401,
    );
  });

  it("rejects an expired OTP", async () => {
    const services = createIdentityServices();
    const { challengeId, code } = await requestCode(services, "09120000004");
    const challenge = await services.otps.findById(challengeId);
    assert.ok(challenge);
    challenge.expiresAt = new Date(Date.now() - 1000);
    await services.otps.save(challenge);
    await assert.rejects(
      () => services.completeLogin.execute({ challengeId, code }),
      (error: unknown) => statusOf(error) === 401,
    );
  });

  it("locks the challenge after too many attempts", async () => {
    const services = createIdentityServices();
    const { challengeId, code } = await requestCode(services, "09120000005");
    for (let i = 0; i < IDENTITY_CONSTANTS.maxVerifyAttempts; i += 1) {
      await assert.rejects(
        () => services.verifyOtp.execute({ challengeId, code: "000000" }),
        (error: unknown) => statusOf(error) === 401,
      );
    }
    await assert.rejects(
      () => services.completeLogin.execute({ challengeId, code }),
      (error: unknown) => statusOf(error) === 401,
    );
  });

  it("enforces resend cooldown", async () => {
    const services = createIdentityServices();
    const { challengeId } = await requestCode(services, "09120000006");
    await assert.rejects(
      () => services.resendOtp.execute(challengeId),
      (error: unknown) => statusOf(error) === 429,
    );
  });

  it("resends after the cooldown and accepts the new code", async () => {
    const services = createIdentityServices();
    const { challengeId, code: firstCode } = await requestCode(
      services,
      "09120000007",
    );
    const challenge = await services.otps.findById(challengeId);
    assert.ok(challenge);
    challenge.lastSentAt = new Date(Date.now() - 61_000);
    await services.otps.save(challenge);
    await services.resendOtp.execute(challengeId);
    const newCode = services.delivery.peek("+989120000007");
    assert.ok(newCode);
    assert.notEqual(newCode, firstCode);
    const result = await services.completeLogin.execute({
      challengeId,
      code: newCode,
    });
    assert.equal(result.user.phone, "+989120000007");
  });

  it("creates a user on first login and reuses it on the next", async () => {
    const services = createIdentityServices();
    const first = await loginWithPhone(services, "09120000008");
    const second = await loginWithPhone(services, "09120000008");
    assert.equal(first.user.userId, second.user.userId);
  });

  it("rejects a revoked session after logout", async () => {
    const services = createIdentityServices();
    const result = await loginWithPhone(services, "09120000009");
    await services.sessionService.revokeByToken(result.token);
    const session = await services.sessionService.getByToken(result.token);
    assert.equal(session, undefined);
  });

  it("rejects an expired session", async () => {
    const services = createIdentityServices();
    const result = await loginWithPhone(services, "09120000010");
    const session = await services.sessions.findByTokenHash(sha256(result.token));
    assert.ok(session);
    session.expiresAt = new Date(Date.now() - 1000);
    await services.sessions.save(session);
    const found = await services.sessionService.getByToken(result.token);
    assert.equal(found, undefined);
  });
});
