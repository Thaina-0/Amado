# Emergency: nearest places checks

Mutations: 3
Build: `pnpm build`; `pnpm lint`
Plan: `.specs/features/emergency-near-me/plan.md`

## Intent

21 checks in 4 slices · 3 one-way doors · 0 open

## Checks

### S1 - The five numbers

**C1** - The app opens on the screen in `.specs/features/emergency-near-me/captures/emergencia.png` (AC 1)
Proof: browser - reach the state, save `captures/emergencia.running.png`
Proof: `pnpm exec vitest run src/App.test.tsx -t "opens on the Emergência screen"`

**C2** - The five numbers are links `tel:<number>` in the order 190, 192, 193, 180, 199, each with the title and second line the capture draws (AC 2)
Proof: `pnpm exec vitest run src/features/emergency/EmergencyScreen.test.tsx -t "lists the five numbers"`

**C3** - The five number links stay visible with the same `href`s while the position is pending, denied or failed and while the device is offline (AC 3)
Proof: `pnpm exec vitest run src/features/emergency/EmergencyScreen.test.tsx -t "keeps the five numbers"`

**C4** - The screen shows no "patrocinado" label (AC 4)
Proof: `pnpm exec vitest run src/features/emergency/EmergencyScreen.test.tsx -t "shows no patrocinado"`

### S2 - Nearest places

**C5** - Opening the screen calls `getCurrentPosition` exactly once with `maximumAge: 0` and `timeout: 10000`, also under `StrictMode`, and never calls `watchPosition` (AC 5)
Proof: `pnpm exec vitest run src/features/emergency/location.test.ts -t "asks the position once"`
Proof: `pnpm exec vitest run src/features/emergency/EmergencyScreen.test.tsx -t "asks the position once under StrictMode"`

**C6** - With a position, "Mais perto de você" shows the one nearest place of each category that has a place, ordered by ascending distance, ties in `police`, `hospital`, `upa`, `fire` order (AC 6)
Proof: `pnpm exec vitest run src/features/emergency/places.test.ts -t "nearest place of each category"`
Proof: `pnpm exec vitest run src/features/emergency/EmergencyScreen.test.tsx -t "lists the nearest place of each category"`

**C7** - Distance reads as metres rounded to 10 below 995 m and as kilometres with one decimal and a comma from 995 m (AC 7)
Proof: `pnpm exec vitest run src/features/emergency/places.test.ts -t "formats the distance"`

**C8** - Each place row shows its name, category, distance, "Verificado pela equipe do Amado" and its `hours` when it has one (AC 8)
Proof: `pnpm exec vitest run src/features/emergency/EmergencyScreen.test.tsx -t "shows the place row"`

**C9** - Using "Ligar" on a place row opens the dialer with `tel:<place phone>` (AC 9)
Proof: `pnpm exec vitest run src/features/emergency/EmergencyScreen.test.tsx -t "Ligar opens the dialer"`

**C10** - Using "Rota" on a place row opens the Google Maps directions link whose `destination` is that place's `<lat>,<lng>`, with none of the user's position in it (AC 10)
Proof: `pnpm exec vitest run src/features/emergency/EmergencyScreen.test.tsx -t "Rota opens the directions link"`

**C11** - Without a position (denied, unavailable or 10 s timeout) every place shows with no distance, ordered by category then `id`, under "Sem a sua localização, não dá para ordenar por distância." (AC 11)
Proof: `pnpm exec vitest run src/features/emergency/places.test.ts -t "without a position orders"`
Proof: `pnpm exec vitest run src/features/emergency/EmergencyScreen.test.tsx -t "without a position"`

**C12** - While the position is pending a loading block shows under "Mais perto de você" and the number links are not delayed or disabled (AC 12)
Proof: `pnpm exec vitest run src/features/emergency/EmergencyScreen.test.tsx -t "loading block"`

**C13** - With no place in `EMERGENCY_PLACES` the screen shows "Ainda não há lugares verificados para mostrar. Os números acima funcionam sempre." (AC 13)
Proof: `pnpm exec vitest run src/features/emergency/EmergencyScreen.test.tsx -t "empty state"`

**C14** - `validatePlace` rejects a place missing `id`, `name`, `phone`, `lat`, `lng`, `verifiedAt` or `source`, or with a coordinate out of range, and every bundled place passes it (AC 14)
Proof: `pnpm exec vitest run src/features/emergency/places.test.ts -t "validatePlace"`

### S3 - Works offline

**C15** - While offline the screen shows the same places and distances as online and the feature makes no network request (AC 15)
Proof: `pnpm exec vitest run src/features/emergency/EmergencyScreen.test.tsx -t "offline shows the same places"`

**C16** - The alert appears when the `offline` event fires and disappears when `online` fires, without a reload (AC 16)
Proof: `pnpm exec vitest run src/features/emergency/EmergencyScreen.test.tsx -t "offline and online events"`

**C17** - While offline the screen matches `.specs/features/emergency-near-me/captures/emergencia-sem-internet.png`, with the alert title "Sem internet" and the text "Os números de emergência e os lugares salvos no aparelho continuam funcionando." (AC 17)
Proof: browser - reach the state, save `captures/emergencia-sem-internet.running.png`

**C21** - The built service worker precaches both font files (`latin` and `latin-ext`), so the screen keeps its type offline (AC 15, found while building)
Proof: `pnpm build && grep -q "atkinson-hyperlegible-next-latin-wght-normal" dist/sw.js && grep -q "atkinson-hyperlegible-next-latin-ext-wght-normal" dist/sw.js`

### S4 - The position is never kept

**C18** - After a look-up nothing from the position is in `localStorage`, `sessionStorage`, `indexedDB` or `document.cookie`, no console call carries a coordinate, and `fetch` and `XMLHttpRequest` are not called (AC 18)
Proof: `pnpm exec vitest run src/features/emergency/EmergencyScreen.test.tsx -t "never keeps the position"`

**C19** - No file in `src/features/emergency/` imports a storage, analytics or logging module, and only `location.ts` touches `navigator.geolocation` (AC 19)
Proof: `pnpm exec vitest run src/features/emergency/privacy.test.ts -t "feature imports no storage"`

**C20** - Places are ordered by distance only: two places at the same coordinates order by `id`, and an extra `priority` value on a place changes nothing (AC 20)
Proof: `pnpm exec vitest run src/features/emergency/places.test.ts -t "orders by distance only"`

## Coverage

| Set (size)                                         | Member -> proof                                                                                                                                                                | Unproven |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| level 1 numbers (5)                                | 190 C2 · 192 C2 · 193 C2 · 180 C2 · 199 C2, table-driven over all 5; the five stay in 4 conditions C3                                                                          | -        |
| position states (5)                                | pending C12 · granted C6 · denied C11 · unavailable C11 · timeout C11                                                                                                          | -        |
| place categories (4)                               | `police` C6 · `hospital` C6 · `upa` C6 · `fire` C6, one table-driven proof over all 4                                                                                          | -        |
| distance reading, AC 7 (4 examples)                | 994 m C7 · 995 m C7 · 1234 m C7 · 0 m C7                                                                                                                                       | -        |
| `validatePlace` examples, AC 14 (10)               | no `id` C14 · no `name` C14 · no `phone` C14 · no `lat` C14 · no `lng` C14 · no `verifiedAt` C14 · no `source` C14 · `lat` 91 C14 · `lng` -181 C14 · valid without `hours` C14 | -        |
| ordering rule, AC 6 and AC 20 (4 examples)         | police 500 m before hospital 1.2 km C6 · equal distance in category order C6 · category with no place gives no row C6 · same coordinates by `id` C20                           | -        |
| network and storage the feature must not touch (6) | `localStorage` C18 · `sessionStorage` C18 · `indexedDB` C18 · `document.cookie` C18 · console C18 · `fetch` and `XMLHttpRequest` C18 and C15                                   | -        |
| font files in the offline precache (2)             | `latin` C21 · `latin-ext` C21                                                                                                                                                  | -        |
| source controls: `emergencia.png` (3)              | number link C2 · Ligar C9 · Rota C10                                                                                                                                           | -        |
| source controls: `emergencia-sem-internet.png` (1) | number link C3                                                                                                                                                                 | -        |
| entities: `EmergencyPlace`, `PlaceCategory` (2)    | `EmergencyPlace` C14 and C20 · `PlaceCategory` C6                                                                                                                              | -        |
| one-way doors (3)                                  | door 1 `EmergencyPlace` has no rank field C20 · door 2 only `getPosition` touches the geolocation API C19 · door 3 static dataset import, no runtime fetch C15                 | -        |

- Claims naming a URL, route or response shape: C9, C10 - each has a proof that reads the rendered link
- No other check claims more than the single case its proof exercises

## Swept

- validation: C14, C7
- failure modes: C11, C13
- idempotency: n/a - nothing is written; the look-up repeats on every open and keeps nothing
- authorization: n/a - level 1 needs no signup and no identity, so there is nothing to authorize
- concurrency: C5
- data lifecycle: C18
- dependency failure: C11, C15, C21
- state transitions: C12, C16
- observability: C18

## Handoff

- **Settled mid-build:** none
- **Dispatched:** the Verifier and the screens sub-agent (round 1), sent in parallel on 2026-10-28 at `HEAD` unknown while `git` was blocked, both `returned`: screens matched, Verifier FAIL with 6 findings closed in `f8053e8`. Screens round 2 (resumed sub-agent `a1d87365d831ace6f`) sent at `HEAD` d5ae121 to re-judge the pictures re-saved at b9e4825, because the `lucide-react` pin changed from 1.63.0 to 1.61.0 after round 1
- **Boundary:** C1-C21 built and proven; `check_proofs.py` at d5ae121: 27 pass, 0 fail, 3 mutations killed; commits 1d0add8, 62c8d39, cb4a013, f8053e8, 7b24ee9, b9e4825, d5ae121 on `feat/emergency-near-me`; `.tlc/` left untracked on purpose
- **Abandoned:** none
- **Walked:** `pnpm exec vite` at 390x844, after the Tailwind move. Opening the app shows the Emergência screen with the five numbers and, with the dataset empty (AD-002), the empty state under "Mais perto de você" (`captures/emergencia.running.png`). Going offline (Playwright `setOffline(true)`) shows the "Sem internet" alert with the AD-001 text, and it goes away when back online with no reload (`captures/emergencia-sem-internet.running.png`). The top margin is 16 px here; the capture's extra top space is the phone status bar, which `env(safe-area-inset-top)` supplies on a notched phone
