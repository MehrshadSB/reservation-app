import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { RequestOtpResponse } from "@repo/contracts/auth";
import { IDENTITY_CONSTANTS } from "../../domain/identity-constants";
import { hmac, randomOtpCode } from "../../infrastructure/crypto";
import { IdentityConfigService } from "../../infrastructure/identity-config.service";
import type { OtpDeliveryPort } from "../ports/otp-delivery.port";
import type { OtpRepository } from "../ports/otp.repository";
import { OTP_DELIVERY, OTP_REPOSITORY } from "../ports/tokens";

@Injectable()
export class ResendOtpUseCase {
  constructor(
    @Inject(OTP_REPOSITORY)
    private readonly otps: OtpRepository,
    @Inject(OTP_DELIVERY)
    private readonly delivery: OtpDeliveryPort,
    private readonly config: IdentityConfigService,
  ) {}

  async execute(challengeId: string): Promise<{
    challengeId: string;
    expiresAt: Date;
    resendAvailableAt: Date;
  }> {
    const challenge = await this.otps.findById(challengeId);
    const now = Date.now();

    if (!challenge || challenge.status !== "pending") {
      throw new HttpException(
        { message: "Unable to send code" },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (challenge.resendCount >= IDENTITY_CONSTANTS.maxResends) {
      throw new HttpException(
        { message: "Unable to send code" },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (
      now - challenge.lastSentAt.getTime() <
      IDENTITY_CONSTANTS.resendCooldownMs
    ) {
      throw new HttpException(
        { message: "Unable to send code" },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const code = randomOtpCode();
    challenge.codeHash = hmac(
      this.config.values.secrets.otpPepper,
      `${challenge.id}:${code}`,
    );
    challenge.expiresAt = new Date(now + IDENTITY_CONSTANTS.otpTtlMs);
    challenge.resendCount += 1;
    challenge.lastSentAt = new Date(now);
    challenge.attemptCount = 0;
    await this.otps.save(challenge);
    await this.delivery.send({ phoneNumber: challenge.phoneNumber, code });

    return {
      challengeId: challenge.id,
      expiresAt: challenge.expiresAt,
      resendAvailableAt: new Date(now + IDENTITY_CONSTANTS.resendCooldownMs),
    };
  }

  toResponse(result: {
    challengeId: string;
    expiresAt: Date;
    resendAvailableAt: Date;
  }): RequestOtpResponse {
    return {
      challengeId: result.challengeId,
      expiresAt: result.expiresAt.toISOString(),
      resendAvailableAt: result.resendAvailableAt.toISOString(),
    };
  }
}
