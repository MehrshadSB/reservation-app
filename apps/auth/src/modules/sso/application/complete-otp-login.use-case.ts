import { Injectable } from "@nestjs/common";
import type { AuthenticatedIdentity } from "@repo/contracts/identity";
import type { AuthorizationContext } from "@repo/contracts/authorization";
import { AuthorizationService } from "../../authorization/application/authorization.service";
import { IdentityService } from "../../identity/application/identity.service";
import { VerifyOtpUseCase } from "../../otp/application/verify-otp.use-case";
import { SessionService, type IssuedTokens } from "../../session/application/session.service";

export type OtpLoginResult = IssuedTokens & {
  identity: AuthenticatedIdentity;
  authorization: AuthorizationContext;
};

@Injectable()
export class CompleteOtpLoginUseCase {
  constructor(
    private readonly verifyOtp: VerifyOtpUseCase,
    private readonly identities: IdentityService,
    private readonly sessions: SessionService,
    private readonly authorization: AuthorizationService,
  ) {}

  async execute(input: { challengeId: string; code: string }): Promise<OtpLoginResult> {
    const { phoneNumber } = await this.verifyOtp.execute(input);
    const { identity, systemUser } =
      await this.identities.createOrGetByPhone(phoneNumber);

    if (identity.status !== "active" || systemUser.status !== "active") {
      throw new Error("identity_disabled");
    }

    await this.authorization.maybeBootstrapSuperAdmin(
      identity.phoneNumber,
      identity.id,
    );

    const tokens = await this.sessions.create({
      identityId: identity.id,
      systemUserId: systemUser.id,
    });
    const authorization = await this.authorization.getContext(identity.id);

    return {
      ...tokens,
      identity: {
        identityId: identity.id,
        systemUserId: systemUser.id,
        phoneNumber: identity.phoneNumber,
        status: identity.status,
      },
      authorization,
    };
  }
}
