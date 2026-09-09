import { Injectable } from "@nestjs/common";
import type { OtpChallenge } from "../domain/otp-challenge";
import type { OtpRepository } from "../application/ports/otp.repository";

@Injectable()
export class InMemoryOtpRepository implements OtpRepository {
  private readonly challenges = new Map<string, OtpChallenge>();

  async save(challenge: OtpChallenge): Promise<void> {
    this.challenges.set(challenge.id, challenge);
  }

  async findById(id: string): Promise<OtpChallenge | undefined> {
    return this.challenges.get(id);
  }
}
