import { Module } from "@nestjs/common";
import { IdentityModule } from "../identity/identity.module";
import { AuthorizationService } from "./application/authorization.service";
import {
  MEMBERSHIP_REPOSITORY,
  PLATFORM_ACCESS_REPOSITORY,
} from "./application/ports/tokens";
import { InMemoryAuthorizationStore } from "./infrastructure/in-memory-authorization.store";

@Module({
  imports: [IdentityModule],
  providers: [
    InMemoryAuthorizationStore,
    AuthorizationService,
    {
      provide: MEMBERSHIP_REPOSITORY,
      useExisting: InMemoryAuthorizationStore,
    },
    {
      provide: PLATFORM_ACCESS_REPOSITORY,
      useExisting: InMemoryAuthorizationStore,
    },
  ],
  exports: [AuthorizationService],
})
export class AuthorizationModule {}
