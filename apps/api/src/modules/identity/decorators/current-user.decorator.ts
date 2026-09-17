import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { AuthenticatedUser } from "@repo/contracts/identity";
import type { AuthenticatedRequest } from "../identity.types";

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;
    if (!user) {
      throw new Error("CurrentUser used without AuthenticationGuard");
    }
    return user;
  },
);
