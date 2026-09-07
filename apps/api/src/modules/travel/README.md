# Travel & Tours

First industry vertical. Owns tours, departures, destinations, itineraries,
and travelers.

Booking Core owns the reservation. This module maps a **Tour Departure**
to a `BookableSnapshot` and calls `BookingService`. It never asks Booking
Core to understand tours.

```text
Tour  (product, not bookable)
  └── Tour Departure  (occurrence: dates, capacity, price)
        └── toBookableSnapshot()
              └── BookingService.create()
                    └── Booking
```

`TOUR_DEPARTURE_OFFERING_TYPE` is owned here. Core stores it as an opaque
string and must never branch on it.

Allowed dependencies: Booking, Availability, Customer.
Forbidden: Booking or Availability importing this module.
