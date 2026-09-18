import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import type {
  RequestOtpRequest,
  RequestOtpResponse,
  ResendOtpRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from "../dto/otp.dto";
import { applySessionCookie } from "../application/session-cookies";
import { RequestOtpUseCase } from "../application/use-cases/request-otp.use-case";
import { ResendOtpUseCase } from "../application/use-cases/resend-otp.use-case";
import { CompleteOtpLoginUseCase } from "../application/use-cases/complete-otp-login.use-case";
import { IdentityConfigService } from "../infrastructure/identity-config.service";

@Controller("v1/identity/otp")
export class OtpController {
  constructor(
    private readonly requestOtp: RequestOtpUseCase,
    private readonly resendOtp: ResendOtpUseCase,
    private readonly completeLogin: CompleteOtpLoginUseCase,
    private readonly config: IdentityConfigService,
  ) {}

  @Post("request")
  async request(
    @Body() body: RequestOtpRequest,
    @Req() req: Request,
  ): Promise<RequestOtpResponse> {
    const result = await this.requestOtp.execute({
      phoneNumber: body.phoneNumber,
      ip: req.ip ?? "unknown",
    });
    return this.requestOtp.toResponse(result);
  }

  @Post("resend")
  async resend(@Body() body: ResendOtpRequest): Promise<RequestOtpResponse> {
    const result = await this.resendOtp.execute(body.challengeId);
    return this.resendOtp.toResponse(result);
  }

  @Post("verify")
  async verify(
    @Body() body: VerifyOtpRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<VerifyOtpResponse> {
    const result = await this.completeLogin.execute({
      challengeId: body.challengeId,
      code: body.code,
    });
    applySessionCookie(res, this.config, result.token);
    return {
      user: result.user,
      expiresAt: result.session.expiresAt.toISOString(),
    };
  }
}
