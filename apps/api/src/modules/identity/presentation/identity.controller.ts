import { Controller, Post, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import { clearSessionCookie } from "../application/session-cookies";
import { SessionService } from "../application/session.service";
import { extractAccessToken } from "../extract-access-token";
import { IdentityConfigService } from "../infrastructure/identity-config.service";

@Controller("v1/identity")
export class IdentityController {
  constructor(
    private readonly sessions: SessionService,
    private readonly config: IdentityConfigService,
  ) {}

  @Post("logout")
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ ok: true }> {
    const token = extractAccessToken({
      cookieHeader: req.headers.cookie,
      authorization: req.headers.authorization,
      cookieName: this.config.values.cookie.session,
    });
    if (token) {
      await this.sessions.revokeByToken(token);
    }
    clearSessionCookie(res, this.config);
    return { ok: true };
  }
}
