/**
 * Request-scoped tenant boundary.
 *
 * Every use case in the API runs inside an organization/tenant context.
 * Persistence details are intentionally not defined yet.
 */
export type TenantContext = {
  tenantId: string;
};
