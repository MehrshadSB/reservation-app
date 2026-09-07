# Availability

Generic inventory engine for bookable offerings. Separate from Booking.

Booking asks: can this offering be reserved? This module answers with yes/no,
remaining capacity, and (later) slots or date ranges.

Industry modules **register** inventory when they publish an occurrence.
Booking Core **checks / reserves / releases** through `AvailabilityPort`.
This module never imports Booking or Travel.

A tour departure, a doctor slot, and a hotel stay all register the same
`AvailabilityInventory` shape. Strategies differ by `BookingMode`, not by
industry type.
