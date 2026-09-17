import type { UserProfile } from "../../domain/entities/user-profile";

export type UserProfileRepository = {
  findByUserId(userId: string): Promise<UserProfile | undefined>;
  findByNationalId(nationalId: string): Promise<UserProfile | undefined>;
  save(profile: UserProfile): Promise<void>;
};
