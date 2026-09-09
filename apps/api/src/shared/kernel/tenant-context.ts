/**
 * Request-scoped tenant boundary.
 *
 * Every use case in the API runs inside an organization/tenant context.
 * Identity comes from Auth; this only carries the active organization.
 */
export type TenantContext = {
  tenantId: string;
  identityId: string;
};
