import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { loadAuthRuntimeConfig } from "../../../shared/platform-env";
import { AuthIntrospectionClient } from "../infrastructure/auth-introspection.client";
import { extractAccessToken } from "../extract-access-token";
import type { AuthenticatedRequest } from "../identity.types";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private readonly config = loadAuthRuntimeConfig();

  constructor(private readonly auth: AuthIntrospectionClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = extractAccessToken({
      cookieHeader: request.headers.cookie,
      authorization: request.headers.authorization,
      cookieName: this.config.cookie.session,
    });
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      request.auth = await this.auth.introspect(token);
    } catch (error) {
      if (error instanceof Error && error.message === "auth_unavailable") {
        throw new ServiceUnavailableException();
      }
      throw new UnauthorizedException();
    }

    return true;
  }
}
