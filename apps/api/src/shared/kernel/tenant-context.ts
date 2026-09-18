/**
 * Which organization this request is operating in.
 *
 * Identity, roles, and permissions are not stored here.
 */
export type TenantContext = {
  organizationId: string;
};

export function isResourceInTenant(
  resourceOrganizationId: string,
  tenant: TenantContext,
): boolean {
  return resourceOrganizationId === tenant.organizationId;
}
