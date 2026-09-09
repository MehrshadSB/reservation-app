import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { AuthConfigService } from "../../../shared/config/auth-config.service";
import { AUTH_CONSTANTS } from "../../../shared/kernel/auth-constants";
import { hmac, safeEqualHex } from "../../../shared/security/crypto";
import type { OtpRepository } from "./ports/otp.repository";
import { OTP_REPOSITORY } from "./ports/tokens";

@Injectable()
export class VerifyOtpUseCase {
  constructor(
    @Inject(OTP_REPOSITORY)
    private readonly otps: OtpRepository,
    private readonly config: AuthConfigService,
  ) {}

  async execute(input: { challengeId: string; code: string }): Promise<{
    phoneNumber: string;
  }> {
    const challenge = await this.otps.findById(input.challengeId);
    const now = Date.now();
    const invalid = () =>
      new HttpException(
        { message: "Invalid or expired code" },
        HttpStatus.UNAUTHORIZED,
      );

    if (
      !challenge ||
      challenge.status !== "pending" ||
      challenge.expiresAt.getTime() <= now
    ) {
      if (challenge && challenge.status === "pending") {
        challenge.status = "expired";
        await this.otps.save(challenge);
      }
      throw invalid();
    }

    if (challenge.attemptCount >= AUTH_CONSTANTS.maxVerifyAttempts) {
      challenge.status = "locked";
      await this.otps.save(challenge);
      throw invalid();
    }

    const expected = hmac(
      this.config.values.secrets.otpPepper,
      `${challenge.id}:${input.code.trim()}`,
    );
    const matches = safeEqualHex(expected, challenge.codeHash);

    if (!matches) {
      challenge.attemptCount += 1;
      if (challenge.attemptCount >= AUTH_CONSTANTS.maxVerifyAttempts) {
        challenge.status = "locked";
      }
      await this.otps.save(challenge);
      throw invalid();
    }

    challenge.status = "verified";
    await this.otps.save(challenge);
    return { phoneNumber: challenge.phoneNumber };
  }
}
