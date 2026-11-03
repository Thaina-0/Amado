---
name: verify
description: Run the full Amado quality gate (typecheck, lint, format check, tests, build) and report exactly what failed. Use when finishing a change, before saying work is done, or when asked to verify, check or validate the project.
---

Run these in order from the repo root, stopping at the first failure only to report it, then continue with the rest so the report is complete:

1. `pnpm typecheck`
2. `pnpm lint`
3. `pnpm format:check`
4. `pnpm test`
5. `pnpm build`

Report a table with one row per step: PASS or FAIL, and for failures the first error with `file:line`. Do not claim success unless all five exit 0. If a step fails, fix the cause (never delete or skip a test to get green) and rerun only the failed step plus the ones after it.

If the change touched `src/features/emergency/`, also confirm the level 1 numbers test still covers 190, 192, 193, 180 and 199.
