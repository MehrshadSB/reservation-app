# Industry extensions

Verticals compose Booking Core. They never patch it with industry
conditionals.

The first vertical is `../travel`, imported from `extensions.module.ts`.

Future siblings follow the same pattern:

```text
modules/hotel/        → Room stay  → BookableSnapshot → BookingService
modules/healthcare/   → Slot       → BookableSnapshot → BookingService
modules/salon/        → Appointment → BookableSnapshot → BookingService
```

Register new verticals here and in `registry.ts` `extensionModules`.
Do not add them to `coreModules`.
