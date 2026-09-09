import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import type { Request, Response } from "express";
import type { RequestOtpRequest, ResendOtpRequest, VerifyOtpRequest } from "@repo/contracts/auth";
import { AuthConfigService } from "../../../shared/config/auth-config.service";
import { RequestOtpUseCase } from "../application/request-otp.use-case";
import { ResendOtpUseCase } from "../application/resend-otp.use-case";
import { CompleteOtpLoginUseCase } from "../../sso/application/complete-otp-login.use-case";
import { applySessionCookies } from "../../session/application/session-cookies";

@Controller("v1/otp")
export class OtpController {
  constructor(
    private readonly requestOtp: RequestOtpUseCase,
    private readonly resendOtp: ResendOtpUseCase,
    private readonly completeLogin: CompleteOtpLoginUseCase,
    private readonly config: AuthConfigService,
  ) {}

  @Post("request")
  async request(
    @Body() body: RequestOtpRequest,
    @Req() req: Request,
  ): Promise<{
    challengeId: string;
    expiresAt: string;
    resendAvailableAt: string;
  }> {
    const result = await this.requestOtp.execute({
      phoneNumber: body.phoneNumber,
      ip: req.ip ?? "unknown",
    });
    return {
      challengeId: result.challengeId,
      expiresAt: result.expiresAt.toISOString(),
      resendAvailableAt: result.resendAvailableAt.toISOString(),
    };
  }

  @Post("resend")
  async resend(@Body() body: ResendOtpRequest): Promise<{
    challengeId: string;
    expiresAt: string;
    resendAvailableAt: string;
  }> {
    const result = await this.resendOtp.execute(body.challengeId);
    return {
      challengeId: result.challengeId,
      expiresAt: result.expiresAt.toISOString(),
      resendAvailableAt: result.resendAvailableAt.toISOString(),
    };
  }

  @Post("verify")
  async verify(
    @Body() body: VerifyOtpRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const result = await this.completeLogin.execute({
        challengeId: body.challengeId,
        code: body.code,
      });
      applySessionCookies(res, this.config, result);
      return {
        identity: result.identity,
        authorization: result.authorization,
        expiresAt: result.session.expiresAt.toISOString(),
        refreshExpiresAt: result.session.refreshExpiresAt.toISOString(),
      };
    } catch (error) {
      if (error instanceof Error && error.message === "identity_disabled") {
        throw new HttpException(
          { message: "Invalid or expired code" },
          HttpStatus.UNAUTHORIZED,
        );
      }
      throw error;
    }
  }
}
