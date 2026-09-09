import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { AuthenticatedIdentity } from "@repo/contracts/identity";
import type { AuthenticatedRequest } from "../identity.types";

export const CurrentIdentity = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedIdentity => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const identity = request.auth?.identity;
    if (!identity) {
      throw new Error("CurrentIdentity used without AuthenticationGuard");
    }
    return identity;
  },
);
