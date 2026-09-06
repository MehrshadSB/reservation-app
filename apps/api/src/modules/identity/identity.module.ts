import { Module } from "@nestjs/common";

/**
 * Authentication, platform/staff users, roles, and permissions.
 *
 * Domain code in `domain/` stays free of NestJS decorators.
 */
@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class IdentityModule {}
