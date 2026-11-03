---
description: Pre-freeze checklist for the Hack Turismo technical freeze (29/10 at 15:00)
---

Run the `verify` skill first and stop if anything fails. Then check, and report each as DONE, MISSING or UNKNOWN:

1. Production build works and `pnpm preview` serves the app.
2. The MVP is reachable at a public link (ask the user for the URL; do not invent one).
3. The app opens from a phone without installing (PWA manifest and service worker present in `dist/`).
4. Level 1 emergency numbers (190, 192, 193, 180, 199) render as one-tap `tel:` links and work offline.
5. Nothing sponsored appears in the emergency block.
6. The pitch PDF exists (ask the user; it is not in this repo).

Freeze is 29/10/2026 at 15:00, no exceptions. End with the list of MISSING and UNKNOWN items, most urgent first.
