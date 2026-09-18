# `@repo/database`

PostgreSQL + Drizzle persistence for the modular monolith.

## Responsibility

- Drizzle client and connection lifecycle.
- Canonical schema and migrations.
- Tenant-scoped query helpers for organization-owned tables.

## Auth tables

`users` is the login account (phone OTP). `user_profiles` is the optional
1:1 KYC record for the person behind that account. Profiles are **not**
Customers; Customers stay tenant-scoped in `modules/customer`.

## Local Postgres

```sh
docker compose up -d postgres
```

`DATABASE_URL` in the repo `.env`:

```
postgresql://reservation:reservation@localhost:5432/reservation
```

```sh
npm run db:migrate --workspace=@repo/database
# or, during schema iteration:
npm run db:push --workspace=@repo/database
```

## Consumers

Only `apps/api` may depend on this package. Next.js apps use HTTP.
