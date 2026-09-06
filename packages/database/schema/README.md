# Database schema

Canonical schema files will live here once a persistence library is chosen.

Do not put schema definitions inside individual API modules. Modules own
domain rules; this package owns the shared persistence contract and the
tenant isolation strategy.

Industry-specific tables (housekeeping, patient intake, vehicle mileage)
should be added later as extension tables, not as columns on core booking
records.
