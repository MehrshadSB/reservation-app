import type { AuthenticatedUser } from "@repo/contracts/identity";
import type { Request } from "express";
import type { TenantContext } from "../../shared/kernel/tenant-context";

export type AuthenticatedRequest = Request & {
  user?: AuthenticatedUser;
  tenant?: TenantContext;
};
