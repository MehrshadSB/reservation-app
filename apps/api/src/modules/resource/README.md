# Resource

Generic occupiable unit: person, room, vehicle, chair, court.

This is a Booking Core helper for industries that book exclusive occupancy.
Travel's first path (`CAPACITY` on a tour departure) does not use resources.

A future car-rental or meeting-room module may occupy a resource and map
that occupancy to a `BookableSnapshot` with mode `EXCLUSIVE_RESOURCE`.
