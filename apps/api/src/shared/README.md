# Shared kernel

Cross-cutting Nest providers and types used by every module. Keep this
folder small and flat.

`kernel/` holds tenant context and the three primitives Booking Core,
Availability, and industry extensions must share:

- `BookableOfferingRef`
- `BookingMode`
- `TimeRange`

If something is only useful to one domain, it belongs in that module.
