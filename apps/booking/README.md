# Booking

Public booking application for customers of a tenant.

This app must stay industry-agnostic. A hotel guest and a clinic patient
use the same booking flow configured by the tenant's services, resources,
and rules — not by a business-type switch in the UI.

Consumes `@repo/ui`, `@repo/contracts`, `@repo/config`, and `@repo/utils`.
