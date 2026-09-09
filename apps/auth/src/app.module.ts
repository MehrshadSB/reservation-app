import { Module } from "@nestjs/common";
import { SharedModule } from "./shared/shared.module";
import { AuthorizationModule } from "./modules/authorization/authorization.module";
import { IdentityModule } from "./modules/identity/identity.module";
import { OtpModule } from "./modules/otp/otp.module";
import { SessionModule } from "./modules/session/session.module";
import { SsoModule } from "./modules/sso/sso.module";

@Module({
  imports: [
    SharedModule,
    IdentityModule,
    OtpModule,
    SessionModule,
    AuthorizationModule,
    SsoModule,
  ],
})
export class AppModule {}
