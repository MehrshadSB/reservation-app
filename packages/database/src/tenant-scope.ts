/**
 * Users/profiles are platform-scoped. Tenant tables must always filter by
 * organization id in the query, never after fetch.
 */
export function requireOrganizationId(
  organizationId: string | undefined,
): string {
  if (!organizationId || organizationId.length === 0) {
    throw new Error("organizationId is required for tenant-scoped queries");
  }
  return organizationId;
}
