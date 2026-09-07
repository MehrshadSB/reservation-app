# Availability application

`AvailabilityService` is the in-process API.

- Industry modules call `register` when an occurrence becomes bookable
- Booking Core calls `check` / `reserve` / `release` through its adapter
