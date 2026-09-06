# Core modules

Each folder is a NestJS domain module. Import boundaries are declared in
`<domain>.module.ts`. Modules talk through application services and ports,
not by reaching into another module's database tables.

Industry-specific Nest modules belong in `extensions/`, never inside these
folders.

## Layering

Use all four layers only where the domain has real rules:

- `domain` — entities, value objects, invariants (framework-free)
- `application` — use cases and ports (interfaces)
- `infrastructure` — Nest providers that implement ports
- `presentation` — Nest controllers and DTO mapping

Thin modules (payment, notification, analytics) skip `domain` until they
grow real invariants of their own.

Register new modules in `registry.ts` so `AppModule` stays a thin composer.
