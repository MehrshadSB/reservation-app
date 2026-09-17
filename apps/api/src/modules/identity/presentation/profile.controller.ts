import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import type { AuthenticatedUser } from "@repo/contracts/identity";
import { ProfileService } from "../application/profile.service";
import { CurrentUser } from "../decorators/current-user.decorator";
import type {
  UpsertUserProfileRequest,
  UserProfileResponse,
} from "../dto/profile.dto";
import { AuthenticationGuard } from "../guards/authentication.guard";
import { toProfileResponse } from "./profile.mapper";

@Controller("v1/identity/profile")
@UseGuards(AuthenticationGuard)
export class ProfileController {
  constructor(private readonly profiles: ProfileService) {}

  @Get()
  async get(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UserProfileResponse | null> {
    const profile = await this.profiles.getByUserId(user.userId);
    return profile ? toProfileResponse(profile) : null;
  }

  @Put()
  async upsert(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: UpsertUserProfileRequest,
  ): Promise<UserProfileResponse> {
    const profile = await this.profiles.upsert(user.userId, body);
    return toProfileResponse(profile);
  }
}
