# Dashboard

Tenant staff application: bookings, resources, services, customers, and settings.

## Structure

- `app/(auth)` — sign-in and invite flows
- `app/(app)` — authenticated tenant workspace
- `components` — screens and widgets used only by this app
- `lib` — API client and session helpers

Consumes `@repo/ui`, `@repo/contracts`, `@repo/config`, and `@repo/utils`.
Talks to `apps/api` over HTTP. Never imports `@repo/database`.
