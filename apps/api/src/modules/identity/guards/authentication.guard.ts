import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { IdentityService } from "../application/identity.service";
import { SessionService } from "../application/session.service";
import { extractAccessToken } from "../extract-access-token";
import { IdentityConfigService } from "../infrastructure/identity-config.service";
import type { AuthenticatedRequest } from "../identity.types";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly sessions: SessionService,
    private readonly identities: IdentityService,
    private readonly config: IdentityConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = extractAccessToken({
      cookieHeader: request.headers.cookie,
      authorization: request.headers.authorization,
      cookieName: this.config.values.cookie.session,
    });
    if (!token) {
      throw new UnauthorizedException();
    }

    const session = await this.sessions.getByToken(token);
    if (!session) {
      throw new UnauthorizedException();
    }

    const identity = await this.identities.getById(session.userId);
    if (!identity || identity.status !== "active") {
      throw new UnauthorizedException();
    }

    request.user = { userId: identity.id, phone: identity.phoneNumber };
    return true;
  }
}
