# Packages

Shared libraries. Keep this list short. Domain logic is not extracted here
until a second process actually needs it.

| Package | Consumed by |
| --- | --- |
| `@repo/ui` | dashboard, booking, admin |
| `@repo/types` | all apps |
| `@repo/config` | all apps |
| `@repo/utils` | all apps |
| `@repo/database` | api only |
| `@repo/eslint-config` | all workspaces |
| `@repo/typescript-config` | all workspaces |

Do not add `@repo/booking` or per-domain packages. Booking Core stays in
`apps/api/src/modules/booking`.
