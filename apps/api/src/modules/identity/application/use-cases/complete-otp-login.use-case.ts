import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import type { AuthenticatedUser } from "@repo/contracts/identity";
import type { Session } from "../../domain/entities/session";
import { AuthorizationService } from "../authorization.service";
import { IdentityService } from "../identity.service";
import { SessionService } from "../session.service";
import { VerifyOtpUseCase } from "./verify-otp.use-case";

export type OtpLoginResult = {
  user: AuthenticatedUser;
  session: Session;
  token: string;
};

@Injectable()
export class CompleteOtpLoginUseCase {
  constructor(
    private readonly verifyOtp: VerifyOtpUseCase,
    private readonly identities: IdentityService,
    private readonly sessions: SessionService,
    private readonly authorization: AuthorizationService,
  ) {}

  async execute(input: {
    challengeId: string;
    code: string;
  }): Promise<OtpLoginResult> {
    const { phoneNumber } = await this.verifyOtp.execute(input);
    const { identity } = await this.identities.createOrGetByPhone(phoneNumber);

    if (identity.status !== "active") {
      throw new HttpException(
        { message: "Invalid or expired code" },
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.authorization.maybeBootstrapPlatformAdmin(
      identity.phoneNumber,
      identity.id,
    );

    const { session, token } = await this.sessions.create(identity.id);
    return {
      user: { userId: identity.id, phone: identity.phoneNumber },
      session,
      token,
    };
  }
}
