# Organization (tenant)

SaaS tenancy root. An organization is the isolation boundary for users,
staff, customers, resources, services, and bookings.

Flat Nest module. Every command and query in other modules must run in an
organization context supplied by `src/shared/kernel`.
