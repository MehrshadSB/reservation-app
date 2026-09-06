# Reservation Platform

Generic, multi-tenant reservation and booking platform. It is not built for
one industry. Doctors, hotels, salons, rentals, and consultants all book
through the same Booking Core: a customer books a service that requires
one or more resources during a time range, under booking rules.

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
  types/          Cross-app TypeScript contracts
  typescript-config/
  ui/             Shared React design system
  utils/          Generic helpers
```

Business logic lives in `apps/api/src/modules`. Shared packages exist only
for real reuse across applications. Domain packages are not split out yet.

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

- Next.js apps depend on `@repo/ui`, `@repo/types`, `@repo/config`, `@repo/utils`
- API depends on `@repo/database`, `@repo/types`, `@repo/config`, `@repo/utils`
- Frontends never import `@repo/database`

See `apps/README.md` and `packages/README.md` for ownership rules.
Industry extensions will live in `apps/api/src/modules/extensions`.
