# Booking domain

Framework-free types and invariants for the generic booking engine.

- `entities/booking.ts` — Booking aggregate (points at a bookable offering)
- `value-objects/` — BookableOfferingRef, BookableSnapshot, BookingMode, TimeRange, Capacity, BookingStatus
- `rules/` — lifecycle map and future mode strategies
- `events/` — event names other modules can observe later

Industry concepts (Tour, Room, Doctor) do not belong here.

Cross-app HTTP shapes live in `@repo/contracts/booking`.
