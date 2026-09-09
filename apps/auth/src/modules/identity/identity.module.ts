import { Module } from "@nestjs/common";
import { IdentityService } from "./application/identity.service";
import {
  IDENTITY_REPOSITORY,
  SYSTEM_USER_REPOSITORY,
} from "./application/ports/tokens";
import { InMemoryIdentityRepository } from "./infrastructure/in-memory-identity.repository";
import { InMemoryIdentityStore } from "./infrastructure/in-memory-identity.store";
import { InMemorySystemUserRepository } from "./infrastructure/in-memory-system-user.repository";

@Module({
  providers: [
    InMemoryIdentityStore,
    IdentityService,
    { provide: IDENTITY_REPOSITORY, useClass: InMemoryIdentityRepository },
    { provide: SYSTEM_USER_REPOSITORY, useClass: InMemorySystemUserRepository },
  ],
  exports: [IdentityService],
})
export class IdentityModule {}
