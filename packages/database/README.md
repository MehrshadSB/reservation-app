# `@repo/database`

Persistence boundary for the modular monolith.

## Responsibility

- Database client and connection lifecycle.
- Schema files (when added).
- Tenant-scoped query helpers.

## Consumers

Only `apps/api` and `apps/auth` may depend on this package. Next.js apps
use HTTP. Auth owns identity/session writes; the API reads sessions through
Auth introspection until a shared database exists.
