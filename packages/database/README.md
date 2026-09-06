# `@repo/database`

Persistence boundary for the modular monolith.

## Responsibility

- Database client and connection lifecycle.
- Schema files (when added).
- Tenant-scoped query helpers.

## Consumers

Only `apps/api` may depend on this package. Next.js apps use the API.

Repository implementations in `apps/api/src/modules/*/infrastructure`
import the client from here. Domain modules never import the ORM directly.
