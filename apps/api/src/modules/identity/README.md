# Identity

Authentication and authorization for the API process.

```text
Phone → OTP → Identity → Session cookie
Authenticated user → organization membership → role → permission
```

Staff routes use `@UseGuards(AuthenticationGuard, AuthorizationGuard)` and
`@RequirePermission(PERMISSIONS.BOOKING_CONFIRM)`. Send `x-organization-id`
for the tenant. Other modules should depend on `AuthenticatedUser` and
`TenantContext`, not OTP or session storage.
