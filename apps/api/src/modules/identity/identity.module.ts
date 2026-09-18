import { Global, Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import type { Database } from "@repo/database";
import { DatabaseModule } from "../../shared/database/database.module";
import { DRIZZLE } from "../../shared/database/database.tokens";
import { AuthorizationService } from "./application/authorization.service";
import { IdentityService } from "./application/identity.service";
import { ProfileService } from "./application/profile.service";
import { SessionService } from "./application/session.service";
import {
  IDENTITY_REPOSITORY,
  MEMBERSHIP_REPOSITORY,
  OTP_DELIVERY,
  OTP_REPOSITORY,
  PROFILE_REPOSITORY,
  SESSION_REPOSITORY,
} from "./application/ports/tokens";
import { CompleteOtpLoginUseCase } from "./application/use-cases/complete-otp-login.use-case";
import { RequestOtpUseCase } from "./application/use-cases/request-otp.use-case";
import { ResendOtpUseCase } from "./application/use-cases/resend-otp.use-case";
import { VerifyOtpUseCase } from "./application/use-cases/verify-otp.use-case";
import { AuthenticationGuard } from "./guards/authentication.guard";
import { AuthorizationGuard } from "./guards/authorization.guard";
import { CookieOriginGuard } from "./guards/cookie-origin.guard";
import { IdentityConfigService } from "./infrastructure/identity-config.service";
import { ConsoleOtpProvider } from "./infrastructure/otp/console-otp.provider";
import { DrizzleIdentityRepository } from "./infrastructure/persistence/drizzle-identity.repository";
import { DrizzleProfileRepository } from "./infrastructure/persistence/drizzle-profile.repository";
import { InMemoryIdentityRepository } from "./infrastructure/persistence/in-memory-identity.repository";
import { InMemoryMembershipRepository } from "./infrastructure/persistence/in-memory-membership.repository";
import { InMemoryOtpRepository } from "./infrastructure/persistence/in-memory-otp.repository";
import { InMemoryProfileRepository } from "./infrastructure/persistence/in-memory-profile.repository";
import { InMemorySessionRepository } from "./infrastructure/persistence/in-memory-session.repository";
import { IdentityController } from "./presentation/identity.controller";
import { MeController } from "./presentation/me.controller";
import { OtpController } from "./presentation/otp.controller";
import { ProfileController } from "./presentation/profile.controller";

/**
 * Phone OTP, opaque sessions, organization RBAC, and KYC profiles.
 * Other modules should use AuthenticatedUser, TenantContext, and guards —
 * not OTP or session internals.
 */
@Global()
@Module({
  imports: [DatabaseModule],
  controllers: [
    OtpController,
    IdentityController,
    ProfileController,
    MeController,
  ],
  providers: [
    IdentityConfigService,
    {
      provide: IDENTITY_REPOSITORY,
      inject: [DRIZZLE],
      useFactory: (db: Database | null) =>
        db
          ? new DrizzleIdentityRepository(db)
          : new InMemoryIdentityRepository(),
    },
    { provide: SESSION_REPOSITORY, useClass: InMemorySessionRepository },
    { provide: OTP_REPOSITORY, useClass: InMemoryOtpRepository },
    { provide: MEMBERSHIP_REPOSITORY, useClass: InMemoryMembershipRepository },
    {
      provide: PROFILE_REPOSITORY,
      inject: [DRIZZLE],
      useFactory: (db: Database | null) =>
        db ? new DrizzleProfileRepository(db) : new InMemoryProfileRepository(),
    },
    ConsoleOtpProvider,
    { provide: OTP_DELIVERY, useExisting: ConsoleOtpProvider },
    IdentityService,
    SessionService,
    AuthorizationService,
    ProfileService,
    RequestOtpUseCase,
    VerifyOtpUseCase,
    ResendOtpUseCase,
    CompleteOtpLoginUseCase,
    AuthenticationGuard,
    AuthorizationGuard,
    CookieOriginGuard,
    { provide: APP_GUARD, useClass: CookieOriginGuard },
  ],
  exports: [
    IdentityService,
    AuthorizationService,
    ProfileService,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class IdentityModule {}
