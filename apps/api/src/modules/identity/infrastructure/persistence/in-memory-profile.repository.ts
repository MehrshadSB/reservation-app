import { Injectable } from "@nestjs/common";
import type { UserProfile } from "../../domain/entities/user-profile";
import type { UserProfileRepository } from "../../application/ports/profile.repository";

@Injectable()
export class InMemoryProfileRepository implements UserProfileRepository {
  private readonly byUserId = new Map<string, UserProfile>();

  async findByUserId(userId: string): Promise<UserProfile | undefined> {
    return this.byUserId.get(userId);
  }

  async findByNationalId(nationalId: string): Promise<UserProfile | undefined> {
    for (const profile of this.byUserId.values()) {
      if (profile.nationalId === nationalId) {
        return profile;
      }
    }
    return undefined;
  }

  async save(profile: UserProfile): Promise<void> {
    this.byUserId.set(profile.userId, profile);
  }
}
