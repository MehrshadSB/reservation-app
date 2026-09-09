# Identity (API consumer)

This module does **not** authenticate users. OTP, login, and session
issuance live in `apps/auth`.

The API:

1. Reads the session cookie or Bearer token
2. Introspects the session against Auth
3. Attaches `AuthenticatedIdentity` and `AuthorizationContext`
4. Checks `can(context, permission, organizationId)`

Use `@UseGuards(AuthenticationGuard, AuthorizationGuard)` and
`@RequirePermission(PERMISSIONS.BOOKING_CANCEL)` on protected routes.
Never import Auth OTP internals from Booking, Travel, or Availability.
