# Packages

Shared libraries. Keep this list short. Domain logic is not extracted here
until a second process actually needs it.

| Package | Consumed by |
| --- | --- |
| `@repo/ui` | dashboard, booking, admin |
| `@repo/contracts` | all apps (import per domain, e.g. `@repo/contracts/booking`) |
| `@repo/config` | all apps |
| `@repo/utils` | all apps |
| `@repo/database` | api only |
| `@repo/eslint-config` | all workspaces |
| `@repo/typescript-config` | all workspaces |

Do not add `@repo/booking` or per-domain packages. Booking Core stays in
`apps/api/src/modules/booking`. Domain types stay in those modules.
`@repo/contracts` is only for request/response shapes shared across apps. Domain types stay next to that domain.
`@repo/contracts` is only for HTTP request/response shapes that more than
one app must share — import `@repo/contracts/booking`, never a dump file.
