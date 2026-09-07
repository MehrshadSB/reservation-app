# Tour departures

The bookable occurrence: dates, capacity, price.

This is the adapter to Booking Core. Mapping lives in
`application/tour-departure.mapper.ts`. Domain types here stay travel-only.

```text
publish → AvailabilityService.register
book    → BookingService.create(toBookableSnapshot(departure))
```
