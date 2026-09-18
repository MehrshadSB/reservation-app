# Platform auth

Phone OTP sign-in is handled by this app against `apps/api`. Platform
operators use the same Identity as tenant staff. Access is granted through
`isPlatformAdmin`, not a separate account type.
