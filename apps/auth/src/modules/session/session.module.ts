import { Module } from "@nestjs/common";
import { SessionService } from "./application/session.service";
import { SESSION_REPOSITORY } from "./application/ports/tokens";
import { InMemorySessionRepository } from "./infrastructure/in-memory-session.repository";

@Module({
  providers: [
    SessionService,
    { provide: SESSION_REPOSITORY, useClass: InMemorySessionRepository },
  ],
  exports: [SessionService],
})
export class SessionModule {}
