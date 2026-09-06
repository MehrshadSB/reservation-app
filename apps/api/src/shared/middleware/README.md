# Middleware

NestJS middleware, guards, and interceptors: auth, tenant resolution,
request logging. Resolved tenant context is passed into application use
cases; it is not read from globals inside domain entities.
