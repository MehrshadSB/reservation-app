# Booking application

Use cases and ports. This is the extension seam.

- `BookingService` — facade industry modules call
- `ports/availability.port.ts` — Booking asks Availability; does not import it
- `ports/booking-repository.port.ts` — persistence
- Industry modules compose these use cases. They never fork them with `if (businessType)`.
