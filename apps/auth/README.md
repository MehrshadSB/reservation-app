# Auth — Identity Provider / SSO

Central authentication for the platform. Dashboard, Admin, Booking, and the
API do not implement OTP or login. They redirect here or introspect a session.

OTP login is the only factor in this phase. Sessions are opaque HttpOnly
cookies. Authorization (roles, memberships, `can()`) lives here and is
consumed by the API through session introspection.
