# Reservation Platform

Generic, multi-tenant reservation and booking platform. It is not built for
one industry. A customer books a **bookable offering** during a time range,
consuming capacity or availability. The first vertical is Travel & Tours:
a Tour Departure becomes that offering. Hotels, healthcare, and rentals
will map their own occurrences the same way without changing Booking Core.

## Layout

```text
apps/
  admin/          Platform super-admin (Next.js)
  api/            NestJS modular-monolith backend
  booking/        Public customer booking (Next.js)
  dashboard/      Tenant staff dashboard (Next.js)
packages/
  config/         Shared env and app config
  database/       Persistence client (API only)
  eslint-config/  Shared ESLint
  contracts/      Cross-app HTTP/API contracts
  typescript-config/
  ui/             Shared React design system
  utils/          Generic helpers
```

Business logic lives in `apps/api/src/modules`. Shared packages exist only
for real reuse across applications. Domain packages are not split out yet.

Authentication lives in `apps/api` (`modules/identity`): phone OTP, HttpOnly
sessions, and organization RBAC.

## Commands

```sh
npm install
npm run dev
```

| App | URL |
| --- | --- |
| dashboard | http://localhost:3000 |
| booking | http://localhost:3001 |
| admin | http://localhost:3002 |
| api | http://localhost:4000/health |

## Package graph

- Next.js apps depend on `@repo/ui`, `@repo/contracts`, `@repo/config`, `@repo/utils`
- API depends on `@repo/database`, `@repo/contracts`, `@repo/config`, `@repo/utils`
- Frontends never import `@repo/database`

See `apps/README.md` and `packages/README.md` for ownership rules.
Industry verticals are registered via `modules/extensions`. Travel is the
first one (`apps/api/src/modules/travel`).
