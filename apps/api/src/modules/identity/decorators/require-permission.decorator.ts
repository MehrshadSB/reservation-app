import { SetMetadata } from "@nestjs/common";
import type { Permission } from "@repo/contracts/authorization";

export const PERMISSION_METADATA = "permission";

export const RequirePermission = (permission: Permission) =>
  SetMetadata(PERMISSION_METADATA, permission);
