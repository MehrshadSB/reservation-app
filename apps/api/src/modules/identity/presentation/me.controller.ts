import { Controller, Get, UseGuards } from "@nestjs/common";
import type {
  AuthenticatedUser,
  CurrentUserResponse,
} from "@repo/contracts/identity";
import { AuthorizationService } from "../application/authorization.service";
import { IdentityService } from "../application/identity.service";
import { ProfileService } from "../application/profile.service";
import { CurrentUser } from "../decorators/current-user.decorator";
import { AuthenticationGuard } from "../guards/authentication.guard";
import { toProfileResponse } from "./profile.mapper";

@Controller("v1/me")
@UseGuards(AuthenticationGuard)
export class MeController {
  constructor(
    private readonly identities: IdentityService,
    private readonly authorization: AuthorizationService,
    private readonly profiles: ProfileService,
  ) {}

  @Get()
  async me(@CurrentUser() user: AuthenticatedUser): Promise<CurrentUserResponse> {
    const identity = await this.identities.getById(user.userId);
    const memberships = await this.authorization.listMemberships(user.userId);
    const profile = await this.profiles.getByUserId(user.userId);
    return {
      user,
      isPlatformAdmin: identity?.isPlatformAdmin ?? false,
      memberships: memberships.map((item) => ({
        organizationId: item.organizationId,
        role: item.role,
      })),
      profile: profile ? toProfileResponse(profile) : null,
    };
  }
}
