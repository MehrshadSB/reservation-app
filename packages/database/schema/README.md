# Database schema

Canonical Drizzle tables live in `src/schema`. Generate or edit SQL under
`drizzle/` — do not put schema definitions inside API modules.

`users` and `user_profiles` are platform-scoped. Tenant-owned tables must
include `organization_id` and always filter by it.

Industry-specific tables (housekeeping, patient intake, vehicle mileage)
should be added later as extension tables, not as columns on core booking
records.
