# `@repo/contracts`

HTTP/API contracts shared by the Nest API and the Next.js apps.

Import a domain slice, not the whole package:

```ts
import type { CreateBookingRequest } from "@repo/contracts/booking";
import type { CreateTravelBookingRequest } from "@repo/contracts/travel";
import type { AuthenticatedIdentity } from "@repo/contracts/identity";
import { can, PERMISSIONS } from "@repo/contracts/authorization";
```

## What belongs here

- Request and response shapes that cross the process boundary
- Stable IDs and enums the UI and API must agree on

## What does not belong here

- Domain entities, value objects, and booking rules — those live in
  `apps/api/src/modules/<domain>`
- Database models
- React prop types

Do not turn this into a dumping ground (`common.ts`, `api.ts`, `random.ts`).
If only one app needs a type, it does not belong here.
