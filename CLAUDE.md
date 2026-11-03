# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Amado is a PWA for tourists in Ilhéus (BA), built for the Hack Turismo Costa do Cacau 2026 (Challenge 3). Tagline: "Ilhéus contada por quem ama". Full context, decisions and open items are in `docs/CONTEXT.md`; read it before product-level work.

## Commands

Package manager is **pnpm** (not npm/yarn). Node 20+.

- `pnpm test` runs Vitest once; single file: `pnpm test src/features/emergency/__tests__/numbers.test.ts`
- `pnpm typecheck` / `pnpm lint` / `pnpm format:check` must all pass; CI runs them plus `pnpm build`
- `pnpm build` runs `tsc -b` first, so type errors fail the build

## Non-negotiables

These come from the product decisions in `docs/CONTEXT.md`. Breaking them is a product bug, not a style issue.

- **Emergency level 1** (190, 192, 193, 180, 199; nearest police, hospital/UPA, fire station) is free, verified, never sponsored, needs no signup, and must work offline. Never order or highlight it by payment.
- **Emergency location** is used on the spot and never stored or logged.
- Reports and analytics are **group-level only**; never identify a person.
- Location and data-collection permission is asked on first open; refusing must not block any feature.
- Scope is **Ilhéus only** in this version. WhatsApp is out of the MVP.
- Emergency data must come from a verified source. Never invent phone numbers, addresses or coordinates; leave a clearly marked TODO instead.

## Conventions

- Code, identifiers and comments in English; all user-facing text in pt-BR with correct accents.
- Tests live in a `__tests__/` folder inside the folder they cover (`src/features/account/__tests__/`); shared test helpers are in `src/test-utils/`.
- Editable content (places, photos, circuits, emergency numbers, providers, profile questions) lives in a `data.ts` per feature folder; the logic files import it and re-export what other code already used.
- Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`...).
- TypeScript is `strict` with `noUncheckedIndexedAccess`. TypeScript is pinned to 6.x because `typescript-eslint` does not support 7.x yet; do not upgrade until it does.
- Prettier: no semicolons, single quotes, 100 columns. A PostToolUse hook formats edited files.
- Sponsored content must be visibly labeled "patrocinado".

## Deadlines

Technical freeze is 29/10/2026 at 15:00 (pitch PDF + working MVP link). Demo Day is 16:30.
