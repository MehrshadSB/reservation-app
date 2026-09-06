# `@repo/types`

Shared TypeScript contracts used by apps and packages.

## What belongs here

- Request/response DTOs that frontends and the API both import.
- Stable enums and IDs that cross process boundaries.
- Public booking widget types reused by `booking` and `dashboard`.

## What does not belong here

- Domain entities and booking rules (those live in the API booking module).
- Database models.
- React prop types (those live next to UI components).

Keep this package dependency-free so every app can import it safely.
