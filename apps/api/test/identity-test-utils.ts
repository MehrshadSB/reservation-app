import "reflect-metadata";
import { IdentityService } from "../src/modules/identity/application/identity.service";
import { SessionService } from "../src/modules/identity/application/session.service";
import { AuthorizationService } from "../src/modules/identity/application/authorization.service";
import { RequestOtpUseCase } from "../src/modules/identity/application/use-cases/request-otp.use-case";
import { VerifyOtpUseCase } from "../src/modules/identity/application/use-cases/verify-otp.use-case";
import { ResendOtpUseCase } from "../src/modules/identity/application/use-cases/resend-otp.use-case";
import { CompleteOtpLoginUseCase } from "../src/modules/identity/application/use-cases/complete-otp-login.use-case";
import { IdentityConfigService } from "../src/modules/identity/infrastructure/identity-config.service";
import { ConsoleOtpProvider } from "../src/modules/identity/infrastructure/otp/console-otp.provider";
import { InMemoryIdentityRepository } from "../src/modules/identity/infrastructure/persistence/in-memory-identity.repository";
import { InMemoryMembershipRepository } from "../src/modules/identity/infrastructure/persistence/in-memory-membership.repository";
import { InMemoryOtpRepository } from "../src/modules/identity/infrastructure/persistence/in-memory-otp.repository";
import { ProfileService } from "../src/modules/identity/application/profile.service";
import { InMemoryProfileRepository } from "../src/modules/identity/infrastructure/persistence/in-memory-profile.repository";
import { InMemorySessionRepository } from "../src/modules/identity/infrastructure/persistence/in-memory-session.repository";
import { normalizePhoneNumber } from "../src/modules/identity/infrastructure/phone";
import type { OtpRepository } from "../src/modules/identity/application/ports/otp.repository";
import type { SessionRepository } from "../src/modules/identity/application/ports/session.repository";

export function createIdentityServices() {
  const config = new IdentityConfigService();
  const identities = new InMemoryIdentityRepository();
  const sessions = new InMemorySessionRepository();
  const otps = new InMemoryOtpRepository();
  const memberships = new InMemoryMembershipRepository();
  const profiles = new InMemoryProfileRepository();
  const delivery = new ConsoleOtpProvider(config);
  const identityService = new IdentityService(identities);
  const profileService = new ProfileService(profiles);
  const sessionService = new SessionService(sessions);
  const authorization = new AuthorizationService(
    memberships,
    identityService,
    config,
  );
  const requestOtp = new RequestOtpUseCase(otps, delivery, config);
  const verifyOtp = new VerifyOtpUseCase(otps, config);
  const resendOtp = new ResendOtpUseCase(otps, delivery, config);
  const completeLogin = new CompleteOtpLoginUseCase(
    verifyOtp,
    identityService,
    sessionService,
    authorization,
  );

  return {
    config,
    identities,
    sessions: sessions as SessionRepository,
    otps: otps as OtpRepository,
    memberships,
    profiles,
    delivery,
    profileService,
    identityService,
    sessionService,
    authorization,
    requestOtp,
    verifyOtp,
    resendOtp,
    completeLogin,
  };
}

export async function requestCode(
  services: ReturnType<typeof createIdentityServices>,
  phoneNumber: string,
) {
  const result = await services.requestOtp.execute({
    phoneNumber,
    ip: "127.0.0.1",
  });
  const code = services.delivery.peek(normalizePhoneNumber(phoneNumber));
  if (!code) {
    throw new Error("Console OTP provider did not capture a code");
  }
  return { ...result, code };
}

export async function loginWithPhone(
  services: ReturnType<typeof createIdentityServices>,
  phoneNumber: string,
) {
  const { challengeId, code } = await requestCode(services, phoneNumber);
  return services.completeLogin.execute({ challengeId, code });
}
