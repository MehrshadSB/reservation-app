# Service

Optional catalog of named products some industries sell (haircut,
consultation). Flat Nest module.

This is **not** what Booking Core reserves. Booking Core reserves a
`BookableOfferingRef`. Travel does not use this module — `Tour` is Travel's
product definition.

A future salon or healthcare module may map Service + Resource + a slot
into a `BookableSnapshot` and call `BookingService`.
