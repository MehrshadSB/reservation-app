# Booking application

Use cases (create, confirm, cancel, reschedule) and ports.

`ports/` is the extension seam: persistence, availability checks, and
future pricing/capability strategies. Industry modules implement extra
ports; they do not fork these use cases with business-type conditionals.
