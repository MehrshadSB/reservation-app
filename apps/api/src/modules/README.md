# Core modules

Each folder is a NestJS domain module. Import boundaries are declared in
`<domain>.module.ts`. Modules talk through exported services, not by
reaching into another module's database tables.

Industry-specific Nest modules belong in `extensions/`, never inside these
folders.

## When to use layers

Only Booking Core modules use Clean Architecture folders:

- `booking/`
- `availability/`
- `resource/`

Those have real invariants (time, capacity, occupancy). Layers there:

- `domain` — entities, value objects, invariants (framework-free)
- `application` — use cases and ports
- `infrastructure` — adapters that implement ports
- `presentation` — Nest controllers

## Simple modules

Everything else stays flat:

```text
customer/
  customer.module.ts
  customer.controller.ts
  customer.service.ts
  customer.repository.ts
  customer.types.ts
  dto/
```

Do not add `application/domain/infrastructure/presentation` for tags,
settings, or other small features. Promote a module to layers only after
the rules get hard to keep in a service.

Domain types stay in the module (`*.types.ts`). HTTP shapes shared with
frontends go in `@repo/contracts/<domain>`, never in a global type dump.

Register new modules in `registry.ts` so `AppModule` stays a thin composer.
