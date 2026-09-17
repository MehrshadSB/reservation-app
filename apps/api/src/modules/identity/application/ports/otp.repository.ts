import type { OtpChallenge } from "../../domain/entities/otp-challenge";

export type OtpRepository = {
  save(challenge: OtpChallenge): Promise<void>;
  findById(id: string): Promise<OtpChallenge | undefined>;
};
