import { Global, Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthIntrospectionClient } from "./infrastructure/auth-introspection.client";
import { AuthenticationGuard } from "./guards/authentication.guard";
import { AuthorizationGuard } from "./guards/authorization.guard";
import { CookieOriginGuard } from "./guards/cookie-origin.guard";
import { MeController } from "./presentation/me.controller";

/**
 * Consumes Auth sessions. Does not implement OTP or login.
 */
@Global()
@Module({
  controllers: [MeController],
  providers: [
    AuthIntrospectionClient,
    AuthenticationGuard,
    AuthorizationGuard,
    { provide: APP_GUARD, useClass: CookieOriginGuard },
  ],
  exports: [AuthIntrospectionClient, AuthenticationGuard, AuthorizationGuard],
})
export class IdentityModule {}
