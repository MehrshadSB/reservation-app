import { Module } from "@nestjs/common";
import { InternalAuthController } from "../authorization/presentation/internal.controller";
import { AuthorizationModule } from "../authorization/authorization.module";
import { IdentityModule } from "../identity/identity.module";
import { OtpController } from "../otp/presentation/otp.controller";
import { OtpModule } from "../otp/otp.module";
import { SessionController } from "../session/presentation/session.controller";
import { SessionModule } from "../session/session.module";
import { CompleteOtpLoginUseCase } from "./application/complete-otp-login.use-case";
import { LoginController } from "./presentation/login.controller";

@Module({
  imports: [OtpModule, IdentityModule, SessionModule, AuthorizationModule],
  controllers: [
    LoginController,
    OtpController,
    SessionController,
    InternalAuthController,
  ],
  providers: [CompleteOtpLoginUseCase],
})
export class SsoModule {}
