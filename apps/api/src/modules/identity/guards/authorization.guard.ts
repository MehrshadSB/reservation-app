import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Permission } from "@repo/contracts/authorization";
import { can } from "../can";
import { PERMISSION_METADATA } from "../decorators/require-permission.decorator";
import type { AuthenticatedRequest } from "../identity.types";

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permission = this.reflector.getAllAndOverride<Permission | undefined>(
      PERMISSION_METADATA,
      [context.getHandler(), context.getClass()],
    );
    if (!permission) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const auth = request.auth;
    if (!auth) {
      throw new ForbiddenException();
    }

    const organizationIdHeader = request.headers["x-organization-id"];
    const organizationId = Array.isArray(organizationIdHeader)
      ? organizationIdHeader[0]
      : organizationIdHeader;

    const allowedWithoutOrg = can({
      context: auth.authorization,
      permission,
    });
    if (allowedWithoutOrg) {
      return true;
    }

    if (!organizationId) {
      throw new ForbiddenException();
    }

    const allowed = can({
      context: auth.authorization,
      permission,
      organizationId,
    });
    if (!allowed) {
      throw new ForbiddenException();
    }

    request.tenantId = organizationId;
    return true;
  }
}
