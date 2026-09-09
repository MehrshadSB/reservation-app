import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import type { SessionIntrospection } from "@repo/contracts/auth";
import { AuthenticationGuard } from "../guards/authentication.guard";
import type { AuthenticatedRequest } from "../identity.types";

@Controller("v1/me")
@UseGuards(AuthenticationGuard)
export class MeController {
  @Get()
  me(@Req() request: AuthenticatedRequest): SessionIntrospection {
    const auth = request.auth;
    if (!auth) {
      throw new Error("AuthenticationGuard did not attach a session");
    }
    return auth;
  }
}
