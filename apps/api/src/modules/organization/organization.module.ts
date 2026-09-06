import { Module } from "@nestjs/common";

/**
 * SaaS tenancy root. Isolation boundary for all tenant-owned data.
 */
@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class OrganizationModule {}
