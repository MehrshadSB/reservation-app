# API — NestJS modular monolith

Single NestJS process. Domain logic lives in `src/modules`.

This app is not a microservice host. Modules communicate in-process through
Nest providers. A module can be extracted later only after its boundary has
proven stable.

## Layout

- `app.module.ts` — composition root
- `modules/registry.ts` — core and extension module lists
- `modules/identity` — phone OTP, sessions, organization RBAC, and KYC profiles
- `shared/database` — Drizzle connection; empty `DATABASE_URL` keeps identity in-memory
- `modules/booking`, `availability` — layered Booking Core
- `modules/travel` — first industry vertical (tours), registered as an extension
- other modules — flat Nest files (controller, service, repository, dto)
- `shared` — tenant context, filters, health

## Package consumption

- `@repo/database` — persistence client and tenant scoping
- `@repo/contracts` — HTTP contracts shared with Next.js apps
- `@repo/config` — env and shared settings
- `@repo/utils` — generic helpers

Do not import `@repo/ui`.

With Postgres running, migrate then start the API:

```sh
docker compose up -d postgres
npm run db:migrate --workspace=@repo/database
```

`GET`/`PUT /v1/identity/profile` is the authenticated KYC record. It is not a
Customer. `GET /v1/me` includes `profile` when one exists.

The API uses TypeScript 6 because Nest CLI needs the compiler API, which
TypeScript 7.0 does not expose yet. Frontend apps can stay on the repo
TypeScript version.
