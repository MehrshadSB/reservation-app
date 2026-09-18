# Modules

Each folder is a NestJS domain module. Import boundaries are declared in
`<domain>.module.ts`. Modules talk through exported facades (`BookingService`,
`AvailabilityService`), not by reaching into another module's tables.

## Dependency direction

```text
travel  →  booking  →  availability
travel  →  availability          (register inventory on publish)
booking  ↛  travel
availability  ↛  travel
availability  ↛  booking
```

Industry modules are registered in `extensionModules`, never in `coreModules`.

## Layers

Use Clean Architecture folders only where invariants are real:

- `booking/`
- `availability/`
- `travel/tours/` and `travel/departures/` (product vs occurrence)

Those layers:

- `domain` — entities, value objects, invariants (framework-free)
- `application` — use cases, ports, mappers
- `infrastructure` — adapters that implement ports
- `presentation` — Nest controllers

Everything else stays flat (`customer/`, `travel/destinations/`, …).

## Tree

```text
modules/
├── booking/                 # generic reservation engine
│   ├── domain/
│   │   ├── entities/
│   │   ├── value-objects/
│   │   ├── rules/
│   │   └── events/
│   ├── application/
│   │   ├── ports/
│   │   └── use-cases/
│   ├── infrastructure/
│   └── presentation/
├── availability/            # generic inventory engine
│   ├── domain/
│   │   ├── entities/
│   │   └── strategies/
│   ├── application/
│   ├── infrastructure/
│   └── presentation/
├── customer/
├── identity/                # phone OTP, sessions, organization RBAC
├── organization/
├── payment/
├── notification/
├── analytics/
├── service/                 # optional catalog; not the booking target
├── resource/                # optional occupancy helper
├── extensions/              # composes verticals
└── travel/                  # first industry vertical
    ├── tours/
    ├── departures/
    ├── destinations/
    ├── itineraries/
    └── travelers/
```

Domain types stay in the module. HTTP shapes shared with frontends go in
`@repo/contracts/<domain>`.

Register new modules in `registry.ts` so `AppModule` stays a thin composer.
