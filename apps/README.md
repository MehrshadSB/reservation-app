# Apps

Runnable applications. Each app is a deployable unit. Business rules live
in `api`; the Next.js apps are clients of that API.

| App | Port | Audience |
| --- | --- | --- |
| `dashboard` | 3000 | Tenant staff |
| `booking` | 3001 | Customers |
| `admin` | 3002 | Platform operators |
| `api` | 4000 | NestJS backend |

Future siblings can be added without changing this layout: `mobile`, `docs`,
`website`.
