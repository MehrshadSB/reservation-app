import type { SessionIntrospection } from "@repo/contracts/auth";
import type { Request } from "express";

export type AuthenticatedRequest = Request & {
  auth?: SessionIntrospection;
  tenantId?: string;
};
