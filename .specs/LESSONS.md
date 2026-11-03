# LESSONS - auto-maintained by scripts/lessons.py

> Machine-owned. Do NOT hand-edit. Changes are overwritten on the next `lessons.py` write.
> Canonical state lives in `.specs/lessons.json`. Edit lessons only via the script.
> promote_threshold=2 distinct features · window_days=45 · quarantine_threshold=2

## Confirmed (load these at Plan/Checks)

Corroborated across multiple features. Safe to apply as guidance.

_none_

## Candidates (under observation - do NOT load as guidance yet)

Seen once or not yet corroborated. Tracked, not trusted.

### L-001 - Assert rounding with inputs where round and floor differ, not only values that land on a multiple of the step

- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `formatting` · harmful: 0
- features: emergency-near-me
- evidence: mutations.json#1 places.ts formatDistance round to floor (formatting)
- last seen: 2026-10-28T19:59:15Z

### L-002 - Test an inclusive numeric bound on the bound itself, not only on values outside it

- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `validation` · harmful: 0
- features: emergency-near-me
- evidence: mutations.json#2 places.ts isCoordinate <= to < (validation)
- last seen: 2026-10-28T19:59:15Z

### L-003 - Render the zero value of an optional number through the UI, because a falsy check hides it while the formatter test stays green

- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `ui` · harmful: 0
- features: emergency-near-me
- evidence: mutations.json#3 EmergencyScreen.tsx PlaceRow !meters (ui)
- last seen: 2026-10-28T19:59:15Z

### L-004 - Prove a storage ban by spying the API and asserting it was not called, not by checking that the global exists

- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `privacy` · harmful: 0
- features: emergency-near-me
- evidence: verification.md finding 4, EmergencyScreen.test.tsx never keeps the position (privacy)
- last seen: 2026-10-28T19:59:15Z

### L-005 - Assert a leak check against every component of the secret value, latitude and longitude, not one prefix

- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `privacy` · harmful: 0
- features: emergency-near-me
- evidence: verification.md finding 5, EmergencyScreen.test.tsx never keeps the position (privacy)
- last seen: 2026-10-28T19:59:15Z

### L-006 - Match text the spec fixes exactly by exact string, not by substring or regex

- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `ui` · harmful: 0
- features: emergency-near-me
- evidence: verification.md finding 6, EmergencyScreen.test.tsx lists the five numbers (ui)
- last seen: 2026-10-28T19:59:15Z

### L-007 - Prove distance ordering with two items closer together than any rounding bucket, the farther one first by the tie-break order

- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `urgencias` · harmful: 0
- features: p2-screens
- evidence: verification.md C27 (urgencias)
- last seen: 2026-10-29T08:50:25Z

### L-008 - Render a row with and without each optional flag and assert its label only when the flag is set

- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `urgencias` · harmful: 0
- features: p2-screens
- evidence: verification.md C26 (urgencias)
- last seen: 2026-10-29T08:50:25Z

### L-009 - Assert the inclusive bounds as accepted values next to the out-of-range cases

- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `validation` · harmful: 0
- features: p2-screens
- evidence: verification.md C29 (validation)
- last seen: 2026-10-29T08:50:25Z

### L-010 - Assert that an id containing a slash is not a route for every parameterised hash shape

- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `routes` · harmful: 0
- features: p2-screens
- evidence: verification.md C3 (routes)
- last seen: 2026-10-29T08:50:25Z

### L-011 - When a claim covers every member of a set, the test loops over the whole set

- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `urgencias` · harmful: 0
- features: p2-screens
- evidence: verification.md C25 (urgencias)
- last seen: 2026-10-29T08:50:25Z

### L-012 - Assert the content of each screen, not only that a heading exists, when a criterion says the same content

- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `offline` · harmful: 0
- features: p2-screens
- evidence: verification.md C35 (offline)
- last seen: 2026-10-29T08:50:25Z

### L-013 - A criterion that says visible label needs an assertion on the text content, not only the accessible name

- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `accessibility` · harmful: 0
- features: p2-screens
- evidence: verification.md C37 (accessibility)
- last seen: 2026-10-29T08:50:25Z

## Quarantined (failed when applied - ignore)

A confirmed lesson that recurred alongside failure. Kept for the maintainer to review.

_none_
