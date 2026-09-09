import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { isAllowedRedirect, type AppClientId } from "../../../shared/config/platform-env";
import { AuthConfigService } from "../../../shared/config/auth-config.service";
import { AUTH_CONSTANTS } from "../../../shared/kernel/auth-constants";
import { parseCookies, sessionCookieOptions } from "../../../shared/security/cookies";
import { RequestOtpUseCase } from "../../otp/application/request-otp.use-case";
import { ResendOtpUseCase } from "../../otp/application/resend-otp.use-case";
import { CompleteOtpLoginUseCase } from "../application/complete-otp-login.use-case";
import {
  createLoginContextToken,
  readLoginContext,
} from "../application/login-context";
import {
  applySessionCookies,
  clearSessionCookies,
} from "../../session/application/session-cookies";
import { SessionService } from "../../session/application/session.service";
import { phoneLoginPage, verifyOtpPage } from "./login.view";

@Controller()
export class LoginController {
  constructor(
    private readonly config: AuthConfigService,
    private readonly requestOtp: RequestOtpUseCase,
    private readonly resendOtp: ResendOtpUseCase,
    private readonly completeLogin: CompleteOtpLoginUseCase,
    private readonly sessions: SessionService,
  ) {}

  @Get("login")
  start(
    @Query("client_id") clientId: string | undefined,
    @Query("return_to") returnTo: string | undefined,
    @Res() res: Response,
  ): void {
    const token = createLoginContextToken(this.config, {
      clientId: (clientId ?? "dashboard") as AppClientId,
      returnTo: returnTo ?? this.config.values.urls.dashboardUrl,
    });
    if (!token) {
      res.status(400).type("html").send(phoneLoginPage({ error: "Invalid sign-in request" }));
      return;
    }
    res.cookie(
      this.config.values.cookie.login,
      token,
      sessionCookieOptions(this.config.values.cookie, AUTH_CONSTANTS.loginContextTtlMs),
    );
    res.type("html").send(phoneLoginPage({}));
  }

  @Post("login/otp")
  async requestFromForm(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const phoneNumber = String(req.body?.phoneNumber ?? "");
    try {
      const result = await this.requestOtp.execute({
        phoneNumber,
        ip: req.ip ?? "unknown",
      });
      res.type("html").send(verifyOtpPage({ challengeId: result.challengeId }));
    } catch {
      res.status(400).type("html").send(phoneLoginPage({ error: "Unable to send code" }));
    }
  }

  @Post("login/resend")
  async resendFromForm(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const challengeId = String(req.body?.challengeId ?? "");
    try {
      const result = await this.resendOtp.execute(challengeId);
      res.type("html").send(verifyOtpPage({ challengeId: result.challengeId }));
    } catch {
      res
        .status(400)
        .type("html")
        .send(verifyOtpPage({ challengeId, error: "Unable to send code" }));
    }
  }

  @Post("login/verify")
  async verifyFromForm(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const challengeId = String(req.body?.challengeId ?? "");
    const code = String(req.body?.code ?? "");
    const cookies = parseCookies(req.headers.cookie);
    const login = readLoginContext(
      this.config,
      cookies[this.config.values.cookie.login],
    );
    try {
      const result = await this.completeLogin.execute({ challengeId, code });
      applySessionCookies(res, this.config, result);
      const destination = login?.returnTo ?? this.config.values.urls.dashboardUrl;
      res.clearCookie(this.config.values.cookie.login, {
        path: this.config.values.cookie.path,
        domain: this.config.values.cookie.domain,
      });
      res.redirect(destination);
    } catch {
      res
        .status(401)
        .type("html")
        .send(verifyOtpPage({ challengeId, error: "Invalid or expired code" }));
    }
  }

  @Get("logout")
  async logout(
    @Query("return_to") returnTo: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const cookies = parseCookies(req.headers.cookie);
    const access = cookies[this.config.values.cookie.session];
    if (access) {
      await this.sessions.revokeByAccessToken(access);
    }
    clearSessionCookies(res, this.config);
    const fallback = this.config.values.urls.dashboardUrl;
    const destination =
      returnTo &&
      isAllowedRedirect(returnTo, this.config.values.allowedRedirectOrigins)
        ? returnTo
        : fallback;
    res.redirect(destination);
  }
}
