# API — NestJS modular monolith

Single NestJS process. Domain logic lives in `src/modules`.

This app is not a microservice host. Modules communicate in-process through
Nest providers. A module can be extracted later only after its boundary has
proven stable.

## Layout

- `app.module.ts` — composition root
- `modules/registry.ts` — core and extension module lists
- `modules/booking`, `availability` — layered Booking Core
- `modules/travel` — first industry vertical (tours), registered as an extension
- other modules — flat Nest files (controller, service, repository, dto)
- `shared` — tenant context, guards, filters, health
- Authentication is owned by `apps/auth`. This API introspects sessions
  and enforces permissions.

## Package consumption

- `@repo/database` — persistence client and tenant scoping
- `@repo/contracts` — HTTP contracts shared with Next.js apps
- `@repo/config` — env and shared settings
- `@repo/utils` — generic helpers

Do not import `@repo/ui`.

The API uses TypeScript 6 because Nest CLI needs the compiler API, which
TypeScript 7.0 does not expose yet. Frontend apps can stay on the repo
TypeScript version.
