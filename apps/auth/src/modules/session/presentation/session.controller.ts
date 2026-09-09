import { Controller, Get, HttpException, HttpStatus, Post, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import type { SessionIntrospection } from "@repo/contracts/auth";
import { AuthConfigService } from "../../../shared/config/auth-config.service";
import { parseCookies } from "../../../shared/security/cookies";
import { AuthorizationService } from "../../authorization/application/authorization.service";
import { IdentityService } from "../../identity/application/identity.service";
import { SessionService } from "../application/session.service";
import {
  applySessionCookies,
  clearSessionCookies,
} from "../application/session-cookies";

@Controller("v1/sessions")
export class SessionController {
  constructor(
    private readonly sessions: SessionService,
    private readonly identities: IdentityService,
    private readonly authorization: AuthorizationService,
    private readonly config: AuthConfigService,
  ) {}

  @Get("current")
  async current(@Req() req: Request): Promise<SessionIntrospection> {
    const cookies = parseCookies(req.headers.cookie);
    const access = cookies[this.config.values.cookie.session];
    if (!access) {
      throw new HttpException({ message: "Unauthenticated" }, HttpStatus.UNAUTHORIZED);
    }
    return this.introspectAccess(access);
  }

  @Post("refresh")
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SessionIntrospection> {
    const cookies = parseCookies(req.headers.cookie);
    const refresh = cookies[this.config.values.cookie.refresh];
    if (!refresh) {
      throw new HttpException({ message: "Unauthenticated" }, HttpStatus.UNAUTHORIZED);
    }
    try {
      const rotated = await this.sessions.rotateByRefreshToken(refresh);
      applySessionCookies(res, this.config, rotated);
      return this.toIntrospection(rotated.session.identityId, rotated.session.id);
    } catch {
      clearSessionCookies(res, this.config);
      throw new HttpException({ message: "Unauthenticated" }, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post("logout")
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ ok: true }> {
    const cookies = parseCookies(req.headers.cookie);
    const access = cookies[this.config.values.cookie.session];
    if (access) {
      await this.sessions.revokeByAccessToken(access);
    }
    clearSessionCookies(res, this.config);
    return { ok: true };
  }

  private async introspectAccess(accessToken: string): Promise<SessionIntrospection> {
    const session = await this.sessions.getByAccessToken(accessToken);
    if (!session) {
      throw new HttpException({ message: "Unauthenticated" }, HttpStatus.UNAUTHORIZED);
    }
    return this.toIntrospection(session.identityId, session.id);
  }

  private async toIntrospection(
    identityId: string,
    sessionId: string,
  ): Promise<SessionIntrospection> {
    const identity = await this.identities.getById(identityId);
    const systemUser = await this.identities.getSystemUser(identityId);
    if (!identity || !systemUser || identity.status !== "active" || systemUser.status !== "active") {
      throw new HttpException({ message: "Unauthenticated" }, HttpStatus.UNAUTHORIZED);
    }
    const authorization = await this.authorization.getContext(identityId);
    return {
      sessionId,
      identity: {
        identityId: identity.id,
        systemUserId: systemUser.id,
        phoneNumber: identity.phoneNumber,
        status: identity.status,
      },
      authorization,
    };
  }
}
