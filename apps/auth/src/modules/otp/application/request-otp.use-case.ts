import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from "@nestjs/common";
import { createId } from "../../../shared/security/crypto";
import {
  InvalidPhoneNumberError,
  normalizePhoneNumber,
} from "../../../shared/security/phone";
import { AuthConfigService } from "../../../shared/config/auth-config.service";
import { AUTH_CONSTANTS } from "../../../shared/kernel/auth-constants";
import { hmac, randomOtpCode } from "../../../shared/security/crypto";
import { SlidingWindowRateLimiter } from "../../../shared/security/rate-limiter";
import type { OtpChallenge } from "../domain/otp-challenge";
import type { OtpDeliveryPort } from "./ports/otp-delivery.port";
import type { OtpRepository } from "./ports/otp.repository";
import { OTP_DELIVERY, OTP_REPOSITORY } from "./ports/tokens";

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
    private readonly config: AuthConfigService,
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
    const phoneKey = `phone:${phone}`;
    const ipKey = `ip:${input.ip}`;

    if (
      !this.limiter.allow(
        phoneKey,
        AUTH_CONSTANTS.otpPerPhoneMax,
        AUTH_CONSTANTS.otpPerPhoneWindowMs,
        now,
      ) ||
      !this.limiter.allow(
        ipKey,
        AUTH_CONSTANTS.otpPerIpMax,
        AUTH_CONSTANTS.otpPerIpWindowMs,
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
      expiresAt: new Date(now + AUTH_CONSTANTS.otpTtlMs),
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
      resendAvailableAt: new Date(now + AUTH_CONSTANTS.resendCooldownMs),
    };
  }
}
