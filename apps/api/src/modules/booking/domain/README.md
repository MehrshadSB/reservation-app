# Booking domain

Entities, value objects, and invariants for the generic booking engine.

- `entities` — Booking aggregate
- `value-objects` — TimeRange, Capacity, BookingStatus, Pricing
- `rules` — BookingRules (cancellation, rescheduling, duration constraints)
- `events` — domain events other modules (payments, notifications) can observe
