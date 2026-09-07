# Availability domain

Generic inventory for a bookable offering: capacity remaining, a date
window, and later slots or exclusive locks.

This module does not know about tours, rooms, or doctors. Industry
modules register inventory when they publish an occurrence.

Mode-specific rules live in `strategies/`, keyed by `BookingMode` — never
by industry.
