# `@repo/ui`

Shared React design system for the Next.js applications.

This package is consumed by `dashboard`, `booking`, and `admin`. It must stay
presentation-only: no API calls, no tenant business rules, no booking logic.

## Layout

- `src/primitives` — low-level building blocks (button, input, dialog).
- `src/components` — composed product UI reused across apps.
- `src/layouts` — shells such as app chrome, public booking chrome, admin chrome.
- `src/hooks` — view-layer hooks only.
- `src/styles` — tokens and shared CSS.

App-specific screens belong in each app's `components/` folder, not here.
Extract a component into this package only after a second app needs it.
