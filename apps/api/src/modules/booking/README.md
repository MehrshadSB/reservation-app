# Booking Core

Generic reservation engine. Industry-agnostic by design.

A booking is: a customer reserves a **bookable offering** during a time
range, consuming capacity or availability, under booking rules.

The core does not know what the offering is. A tour departure, a hotel
stay, and a doctor slot all arrive as the same `BookableSnapshot`.

## Allowed concepts

Booking, BookableOfferingRef, BookableSnapshot, TimeRange, Capacity,
BookingMode, BookingStatus, BookingRules, Availability usage (via port).

## Forbidden concepts

Tour, Destination, Doctor, Room, Salon, or any `if (businessType === …)`
branch. Industry modules (starting with `../travel`) call `BookingService`.

## Extension point

`BookableOffering` is **not** a rich core entity. It is an opaque
`BookableOfferingRef` plus a `BookableSnapshot` built by the industry
module. Core stores the reference and never loads Tour Departure.

```text
Tour Departure  →  BookableSnapshot  →  BookingService.create()
```

## Booking modes

`CAPACITY` is the first path (tours). `TIME_SLOT`, `DATE_RANGE`, and
`EXCLUSIVE_RESOURCE` are reserved strategy names — not implementations.

## HTTP

This module's controller is lifecycle and queries. Creating a tour booking
(with travelers) is Travel's HTTP, not this one.
