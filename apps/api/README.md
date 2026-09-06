# API — NestJS modular monolith

Single NestJS process. Domain logic lives in `src/modules`. Each folder is a
Nest module (`*.module.ts`) with layered internals.

This app is not a microservice host. Modules communicate in-process through
Nest providers. A module can be extracted later only after its boundary has
proven stable.

## Layout

- `app.module.ts` — composition root
- `modules/registry.ts` — core and extension module lists
- `modules/<domain>/<domain>.module.ts` — Nest module boundary
- `modules/<domain>/domain` — entities and rules (no Nest decorators)
- `modules/<domain>/application` — use cases and ports
- `modules/<domain>/infrastructure` — database and adapters
- `modules/<domain>/presentation` — Nest controllers
- `shared` — tenant context, guards, filters, health

## Package consumption

- `@repo/database` — persistence client and tenant scoping
- `@repo/types` — cross-app contracts
- `@repo/config` — env and shared settings
- `@repo/utils` — generic helpers

Do not import `@repo/ui`.

The API uses TypeScript 6 because Nest CLI needs the compiler API, which
TypeScript 7.0 does not expose yet. Frontend apps can stay on the repo
TypeScript version.
