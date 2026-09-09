import {
  Body,
  Controller,
  ForbiddenException,
  Headers,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import {
  isOrganizationRole,
  isPermission,
  isPlatformRole,
} from "../catalog";
import type { Permission } from "@repo/contracts/authorization";
import { AuthConfigService } from "../../../shared/config/auth-config.service";
import { AuthorizationService } from "../application/authorization.service";
import { SessionService } from "../../session/application/session.service";
import { IdentityService } from "../../identity/application/identity.service";
import type { SessionIntrospection } from "@repo/contracts/auth";

@Controller("v1/internal")
export class InternalAuthController {
  constructor(
    private readonly config: AuthConfigService,
    private readonly sessions: SessionService,
    private readonly identities: IdentityService,
    private readonly authorization: AuthorizationService,
  ) {}

  @Post("sessions/introspect")
  async introspect(
    @Headers("x-auth-internal-secret") secret: string | undefined,
    @Body() body: { accessToken?: string },
  ): Promise<SessionIntrospection> {
    this.assertInternal(secret);
    if (!body.accessToken) {
      throw new UnauthorizedException();
    }
    const session = await this.sessions.getByAccessToken(body.accessToken);
    if (!session) {
      throw new UnauthorizedException();
    }
    const identity = await this.identities.getById(session.identityId);
    const systemUser = await this.identities.getSystemUser(session.identityId);
    if (!identity || !systemUser) {
      throw new UnauthorizedException();
    }
    return {
      sessionId: session.id,
      identity: {
        identityId: identity.id,
        systemUserId: systemUser.id,
        phoneNumber: identity.phoneNumber,
        status: identity.status,
      },
      authorization: await this.authorization.getContext(identity.id),
    };
  }

  @Post("authorization/can")
  async can(
    @Headers("x-auth-internal-secret") secret: string | undefined,
    @Body()
    body: {
      identityId: string;
      permission: string;
      organizationId?: string;
    },
  ): Promise<{ allowed: boolean }> {
    this.assertInternal(secret);
    if (!isPermission(body.permission)) {
      return { allowed: false };
    }
    const allowed = await this.authorization.can({
      identityId: body.identityId,
      permission: body.permission as Permission,
      organizationId: body.organizationId,
    });
    return { allowed };
  }

  @Post("memberships")
  async grantMembership(
    @Headers("x-auth-internal-secret") secret: string | undefined,
    @Body()
    body: { identityId: string; organizationId: string; role: string },
  ): Promise<{ ok: true }> {
    this.assertInternal(secret);
    if (!isOrganizationRole(body.role)) {
      throw new ForbiddenException();
    }
    await this.authorization.grantOrganizationRole({
      identityId: body.identityId,
      organizationId: body.organizationId,
      role: body.role,
    });
    return { ok: true };
  }

  @Post("platform-roles")
  async grantPlatformRole(
    @Headers("x-auth-internal-secret") secret: string | undefined,
    @Body() body: { identityId: string; role: string },
  ): Promise<{ ok: true }> {
    this.assertInternal(secret);
    if (!isPlatformRole(body.role)) {
      throw new ForbiddenException();
    }
    await this.authorization.grantPlatformRole(body.identityId, body.role);
    return { ok: true };
  }

  private assertInternal(secret: string | undefined): void {
    if (!secret || secret !== this.config.values.secrets.internal) {
      throw new ForbiddenException();
    }
  }
}
