import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Permission } from "@repo/contracts/authorization";
import { AuthorizationService } from "../application/authorization.service";
import { PERMISSION_METADATA } from "../decorators/require-permission.decorator";
import type { AuthenticatedRequest } from "../identity.types";

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authorization: AuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.getAllAndOverride<Permission | undefined>(
      PERMISSION_METADATA,
      [context.getHandler(), context.getClass()],
    );
    if (!permission) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;
    if (!user) {
      throw new ForbiddenException();
    }

    const organizationIdHeader = request.headers["x-organization-id"];
    const organizationId = Array.isArray(organizationIdHeader)
      ? organizationIdHeader[0]
      : organizationIdHeader;

    if (!organizationId) {
      throw new ForbiddenException();
    }

    const tenant = { organizationId };
    const allowed = await this.authorization.can(user, permission, tenant);
    if (!allowed) {
      throw new ForbiddenException();
    }

    request.tenant = tenant;
    return true;
  }
}
