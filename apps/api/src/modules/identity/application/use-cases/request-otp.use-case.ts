import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from "@nestjs/common";
import type { RequestOtpResponse } from "@repo/contracts/auth";
import { IDENTITY_CONSTANTS } from "../../domain/identity-constants";
import type { OtpChallenge } from "../../domain/entities/otp-challenge";
import { createId, hmac, randomOtpCode } from "../../infrastructure/crypto";
import { IdentityConfigService } from "../../infrastructure/identity-config.service";
import {
  InvalidPhoneNumberError,
  normalizePhoneNumber,
} from "../../infrastructure/phone";
import { SlidingWindowRateLimiter } from "../../infrastructure/rate-limiter";
import type { OtpDeliveryPort } from "../ports/otp-delivery.port";
import type { OtpRepository } from "../ports/otp.repository";
import { OTP_DELIVERY, OTP_REPOSITORY } from "../ports/tokens";

export type RequestOtpResult = {
  challengeId: string;
  expiresAt: Date;
  resendAvailableAt: Date;
};

@Injectable()
export class RequestOtpUseCase {
  private readonly limiter = new SlidingWindowRateLimiter();

  constructor(
    @Inject(OTP_REPOSITORY)
    private readonly otps: OtpRepository,
    @Inject(OTP_DELIVERY)
    private readonly delivery: OtpDeliveryPort,
    private readonly config: IdentityConfigService,
  ) {}

  async execute(input: {
    phoneNumber: string;
    ip: string;
  }): Promise<RequestOtpResult> {
    let phone: string;
    try {
      phone = normalizePhoneNumber(input.phoneNumber);
    } catch (error) {
      if (error instanceof InvalidPhoneNumberError) {
        throw new HttpException(
          { message: "Unable to send code" },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }

    const now = Date.now();
    if (
      !this.limiter.allow(
        `phone:${phone}`,
        IDENTITY_CONSTANTS.otpPerPhoneMax,
        IDENTITY_CONSTANTS.otpPerPhoneWindowMs,
        now,
      ) ||
      !this.limiter.allow(
        `ip:${input.ip}`,
        IDENTITY_CONSTANTS.otpPerIpMax,
        IDENTITY_CONSTANTS.otpPerIpWindowMs,
        now,
      )
    ) {
      throw new HttpException(
        { message: "Unable to send code" },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const challengeId = createId();
    const code = randomOtpCode();
    const challenge: OtpChallenge = {
      id: challengeId,
      phoneNumber: phone,
      codeHash: hmac(
        this.config.values.secrets.otpPepper,
        `${challengeId}:${code}`,
      ),
      expiresAt: new Date(now + IDENTITY_CONSTANTS.otpTtlMs),
      attemptCount: 0,
      resendCount: 0,
      status: "pending",
      createdAt: new Date(now),
      lastSentAt: new Date(now),
    };

    await this.otps.save(challenge);
    await this.delivery.send({ phoneNumber: phone, code });

    return {
      challengeId,
      expiresAt: challenge.expiresAt,
      resendAvailableAt: new Date(now + IDENTITY_CONSTANTS.resendCooldownMs),
    };
  }

  toResponse(result: RequestOtpResult): RequestOtpResponse {
    return {
      challengeId: result.challengeId,
      expiresAt: result.expiresAt.toISOString(),
      resendAvailableAt: result.resendAvailableAt.toISOString(),
    };
  }
}
