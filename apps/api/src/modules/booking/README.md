# Booking Core

Generic reservation engine. Industry-agnostic by design.

A booking is: a customer books a service, requiring one or more resources,
during a time range, under booking rules.

## Allowed concepts

Booking, Resource references, Service references, Availability usage,
TimeRange, Capacity, BookingStatus, BookingRules, Pricing.

## Forbidden concepts

DoctorBooking, HotelBooking, SalonBooking, or any `if (businessType === ...)`
branch. Hotels, healthcare, salons, and rentals extend this module from
`../extensions` by composing ports — they never modify this core.

## Future capabilities

Time-slot vs date-range, multi-resource, capacity, duration modes,
deposits, cancellation, rescheduling, and dynamic pricing should plug in
through `application/ports`. Do not build a plugin runtime yet.
