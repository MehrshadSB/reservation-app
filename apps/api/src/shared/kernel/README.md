# Kernel

Process-wide primitives. Multi-tenancy is visible here so modules do not
invent their own tenant type.

Also holds the three types Booking Core, Availability, and every industry
extension must share without importing each other:

- `BookableOfferingRef` — opaque bookable identity
- `BookingMode` — how inventory is consumed
- `TimeRange` — occupancy window

Do not grow this into a domain dump. If a type is useful to only one
module, it stays in that module.
