# P2 screens checks

Mutations: 3
Build: `pnpm typecheck`; `pnpm lint`; `pnpm build`
Plan: `.specs/features/p2-screens/plan.md`

## Intent

41 checks in 4 slices · 3 one-way doors · 0 open

## Checks

### S1 - Four tabs and Explorar

**C1** - The bar shows Início, Explorar, Perto de mim and Emergência, in that order, on `#/inicio`, `#/explorar`, `#/explorar/<categoria>`, `#/circuito/<id>`, `#/perto-de-mim`, `#/lugar/<id>`, `#/emergencia`, `#/urgencias`, `#/perfil`, `#/privacidade`, on `#/idioma` once onboarding is done, and on no other route (AC 1)
Proof: `pnpm exec vitest run src/app/routes.test.ts -t "shows the bar only on in-app routes"`
Proof: `pnpm exec vitest run src/app/AppShell.test.tsx -t "the bar has four tabs in order"`

**C2** - Tapping the Explorar tab shows Explorar at `#/explorar` and marks it with `aria-current="page"`; `#/explorar/cultura` and `#/circuito/<id>` mark Explorar; `#/urgencias` marks Emergência; `#/lugar/<id>` keeps marking Perto de mim (AC 2)
Proof: `pnpm exec vitest run src/app/routes.test.ts -t "marks the selected tab"`
Proof: `pnpm exec vitest run src/app/AppShell.test.tsx -t "tapping the Explorar tab shows Explorar"`

**C3** - `#/explorar/hoteis` and `#/circuito/unknown` show Explorar; `#/circuito/` shows the first screen of the app (AC 3)
Proof: `pnpm exec vitest run src/app/routes.test.ts -t "falls back for an unknown category or circuit"`

**C4** - While onboarding is pending the Explorar tab shows Idioma and `#/urgencias` stays reachable (AC 4)
Proof: `pnpm exec vitest run src/app/routes.test.ts -t "while onboarding is pending the new routes"`
Proof: `pnpm exec vitest run src/app/AppShell.test.tsx -t "pending onboarding guards Explorar and keeps Urgências open"`

**C5** - Explorar matches `.specs/features/p2-screens/captures/explorar.png` (AC 5)
Proof: browser - reach the state, save `captures/explorar.running.png`

**C6** - Each of the four rows of Explorar is a link to `#/explorar/<categoria>`, and Explorar has the Perfil icon (AC 5)
Proof: `pnpm exec vitest run src/features/explore/ExploreScreen.test.tsx -t "lists the four categories as links"`

**C7** - Tapping Gastronomia, Cultura or Praias shows that category's example places with the "Exemplo" tag, and Back returns to Explorar (AC 6)
Proof: `pnpm exec vitest run src/features/explore/ExploreCategoryScreen.test.tsx -t "shows the places of the category"`
Proof: `pnpm exec vitest run src/app/AppShell.test.tsx -t "Back from a category returns to Explorar"`

**C8** - Cultura matches `.specs/features/p2-screens/captures/explorar-cultura.png` (AC 6)
Proof: browser - reach the state, save `captures/explorar-cultura.running.png`

**C9** - Praias shows the line "Nenhum lugar nesta categoria" (AC 7)
Proof: `pnpm exec vitest run src/features/explore/ExploreCategoryScreen.test.tsx -t "shows the empty line for a category without places"`

**C10** - While the places load or fail a category shows the loading blocks and the error block with "Tentar de novo" (AC 8)
Proof: `pnpm exec vitest run src/features/explore/ExploreCategoryScreen.test.tsx -t "shows the loading and error states"`

**C11** - Tapping Circuitos shows the example circuit as a card with the "Exemplo" tag, and the card opens the circuit (AC 9)
Proof: `pnpm exec vitest run src/features/explore/ExploreCategoryScreen.test.tsx -t "lists the circuits and opens one"`

**C12** - Circuitos matches `.specs/features/p2-screens/captures/explorar-circuitos.png` (AC 9)
Proof: browser - reach the state, save `captures/explorar-circuitos.running.png`

### S2 - Circuito

**C13** - A circuit shows its title and summary in the chosen language, the "Exemplo" tag, and its stops as a numbered list in the order of `stops`, each a link to that place (AC 10)
Proof: `pnpm exec vitest run src/features/circuits/CircuitScreen.test.tsx -t "shows the stops in order as links"`

**C14** - The circuit matches `.specs/features/p2-screens/captures/circuito.png` (AC 10)
Proof: browser - reach the state, save `captures/circuito.running.png`

**C15** - "Iniciar roteiro" shows the Lugar page of the first stop and Back returns to the circuit (AC 11)
Proof: `pnpm exec vitest run src/features/circuits/CircuitScreen.test.tsx -t "Iniciar roteiro opens the first stop"`
Proof: `pnpm exec vitest run src/app/AppShell.test.tsx -t "Back from the first stop returns to the circuit"`

**C16** - A circuit screen shows no duration, author, distance or route (AC 12)
Proof: `pnpm exec vitest run src/features/circuits/CircuitScreen.test.tsx -t "shows no duration author distance or route"`

**C17** - Every id in every `Circuit.stops` is the id of a place in `EXAMPLE_PLACES`, and a circuit has at least two stops (AC 13)
Proof: `pnpm exec vitest run src/features/circuits/circuits.test.ts -t "every stop is an example place"`

**C18** - With the chip Tudo and an empty search, Início shows the card "Circuito cultural do centro" first in "Para fazer hoje" as in `.specs/features/p2-screens/captures/inicio.png`, and tapping it opens the circuit (AC 14)
Proof: browser - reach the state, save `captures/inicio.running.png`
Proof: `pnpm exec vitest run src/features/places/HomeScreen.test.tsx -t "shows the circuit card first and opens it"`

**C19** - Início hides the circuit card while a chip other than Tudo is selected or the search holds text, and shows it again with Tudo and the search cleared (AC 15)
Proof: `pnpm exec vitest run src/features/places/HomeScreen.test.tsx -t "hides the circuit card while filtering"`

### S3 - Urgências do dia a dia

**C20** - Scrolled to the end, Emergência shows the row "Urgências do dia a dia" below "Mais perto de você" as in `.specs/features/p2-screens/captures/emergencia-urgencias.png` (AC 16)
Proof: browser - reach the state, save `captures/emergencia-urgencias.running.png`

**C21** - Tapping the row on Emergência shows Urgências at `#/urgencias`, and Back returns to Emergência (AC 16)
Proof: `pnpm exec vitest run src/app/AppShell.test.tsx -t "the Urgências row opens Urgências and Back returns"`

**C22** - Urgências matches `.specs/features/p2-screens/captures/urgencias.png`, with the title, the lead and the link "Ver números de emergência" to `#/emergencia` (AC 17)
Proof: browser - reach the state, save `captures/urgencias.running.png`
Proof: `pnpm exec vitest run src/features/urgencias/EverydayScreen.test.tsx -t "shows the lead and the link to Emergência"`

**C23** - Urgências shows the chips Tudo, Chaveiro, Mecânico, Guincho, Borracheiro, Farmácia de plantão, Eletricista and Encanador with Tudo selected on opening (AC 18)
Proof: `pnpm exec vitest run src/features/urgencias/EverydayScreen.test.tsx -t "shows the eight chips with Tudo selected"`

**C24** - Selecting a chip shows only the providers of that category (AC 19)
Proof: `pnpm exec vitest run src/features/urgencias/EverydayScreen.test.tsx -t "a chip filters the providers"`

**C25** - With no verified provider for the selected chip, Urgências shows "Ainda não há prestadores verificados aqui." and no row; the shipped dataset is empty so every chip shows it (AC 20)
Proof: `pnpm exec vitest run src/features/urgencias/EverydayScreen.test.tsx -t "shows the empty line when no provider matches"`

**C26** - A listed provider shows its name, category, "Aberto 24 h" when `open24h`, hours when given, "Verificado", "Ligar" as `tel:<phone>`, "Rota" as a directions link, and the distance when the position is known (AC 21)
Proof: `pnpm exec vitest run src/features/urgencias/EverydayScreen.test.tsx -t "a provider row shows its details and links"`

**C27** - Providers are ordered by distance when the position is known and by category then id when it is not, and by no other field (AC 22)
Proof: `pnpm exec vitest run src/features/urgencias/providers.test.ts -t "orders by distance then category then id"`

**C28** - Urgências shows no "patrocinado" and `EverydayProvider` has no field named rank, priority, promoted, sponsored or paid (AC 23)
Proof: `pnpm exec vitest run src/features/urgencias/EverydayScreen.test.tsx -t "shows no patrocinado"`
Proof: `pnpm exec vitest run src/features/urgencias/providers.test.ts -t "has no field that ranks or promotes"`

**C29** - `validateProvider` rejects a record that lacks `id`, `name`, `phone`, `verifiedAt` or `source`, has an unknown category, or has a coordinate out of range, naming each field, and the shipped dataset passes (AC 24)
Proof: `pnpm exec vitest run src/features/urgencias/providers.test.ts -t "validateProvider"`

**C30** - Urgências does not ask the browser for the position while the list is empty, asks once when it has a provider, and never stores, logs or sends it (AC 25)
Proof: `pnpm exec vitest run src/features/urgencias/EverydayScreen.test.tsx -t "asks the position only with a provider"`
Proof: `pnpm exec vitest run src/features/emergency/privacy.test.ts -t "urgencias"`

**C31** - `EVERYDAY_PROVIDERS` ships empty with a `TODO(verify)` marker (AC 26)
Proof: `pnpm exec vitest run src/features/urgencias/providers.test.ts -t "ships empty"`

### S4 - Emergência and the whole round

**C32** - Emergência does not ask the browser for the position while `EMERGENCY_PLACES` is empty, and asks once when it has a place (AC 27)
Proof: `pnpm exec vitest run src/features/emergency/EmergencyScreen.test.tsx -t "does not ask the position while the places list is empty"`
Proof: `pnpm exec vitest run src/features/emergency/EmergencyScreen.test.tsx -t "asks the position once under StrictMode"`

**C33** - Emergência still shows the five numbers as `tel:190`, `tel:192`, `tel:193`, `tel:180` and `tel:199` and no "patrocinado", with the Urgências row after the numbers (AC 28)
Proof: `pnpm exec vitest run src/features/emergency/EmergencyScreen.test.tsx -t "lists the five numbers"`
Proof: `pnpm exec vitest run src/features/emergency/EmergencyScreen.test.tsx -t "shows no patrocinado label"`
Proof: `pnpm exec vitest run src/features/emergency/EmergencyScreen.test.tsx -t "puts the Urgências row after the numbers"`

**C34** - Every message key, the new ones included, has a non-empty text in `pt`, `en` and `es` (AC 29)
Proof: `pnpm exec vitest run src/i18n/i18n.test.ts -t "has a text in every language for every key"`

**C35** - Explorar, its categories, Circuito and Urgências show the same content while the device is offline as online, and make no network request (AC 30)
Proof: `pnpm exec vitest run src/app/AppShell.test.tsx -t "the new screens work offline without a request"`

**C36** - Opening each new screen writes nothing to `localStorage`: `amado.preferences.v1` is unchanged and no other key exists (AC 31)
Proof: `pnpm exec vitest run src/app/AppShell.test.tsx -t "the new screens write nothing to storage"`

**C37** - Each new screen, at 390 px, has every control reachable by role and name, and every control but the icon buttons Voltar and Abrir perfil has a visible text label, the Ligar and Rota links of a provider row included (AC 32)
Proof: `pnpm exec vitest run src/app/AppShell.test.tsx -t "every control of the new screens has a name"`
Proof: `pnpm exec vitest run src/features/urgencias/EverydayScreen.test.tsx -t "every control has a name and a visible label"`

**C38** - Each new screen is walked at 390 px wide with no horizontal scroll (AC 32)
Proof: walk - open Explorar, a category, Circuitos, a circuit, Início, Emergência at the end of the page and Urgências at 390 px wide and check that the page is not wider than the window

**C39** - Emergência still shows the bar with four tabs and no Perfil icon (AC 1, AC 28)
Proof: `pnpm exec vitest run src/app/AppShell.test.tsx -t "Emergência shows the bar with four tabs and no Perfil icon"`

**C40** - The doors hold: the P1 hashes parse and print exactly as before, and a circuit points at places by id with no place data (door 1, door 2)
Proof: `pnpm exec vitest run src/app/routes.test.ts -t "maps"`
Proof: `pnpm exec vitest run src/features/circuits/circuits.test.ts -t "holds ids and no place data"`

**C41** - A provider is not an `EmergencyPlace`: `EMERGENCY_PLACES` accepts no provider category and `EVERYDAY_PROVIDERS` is a separate list (door 3)
Proof: `pnpm exec vitest run src/features/urgencias/providers.test.ts -t "is kept apart from the emergency places"`

## Coverage

| Set (size)                          | Member -> proof                                                                                                                                                               | Unproven |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| tab order (4)                       | Início · Explorar · Perto de mim · Emergência C1, table-driven over the 4                                                                                                     | -        |
| new routes (4)                      | `#/explorar` C2 · `#/explorar/<categoria>` C2 · `#/circuito/<id>` C2 · `#/urgencias` C2                                                                                       | -        |
| bar routes (11)                     | C1, table-driven over the 11                                                                                                                                                  | -        |
| Explorar categories (4)             | Gastronomia C6 · Cultura C6 · Praias C6 · Circuitos C6                                                                                                                        | -        |
| category pages (4)                  | Gastronomia C7 · Cultura C7 · Praias C9 · Circuitos C11                                                                                                                       | -        |
| unknown route inputs (3)            | `#/explorar/hoteis` C3 · `#/circuito/unknown` C3 · `#/circuito/` C3                                                                                                           | -        |
| circuit stops (3)                   | Casa de Jorge Amado C13 · Catedral de São Sebastião C13 · Bar Vesúvio C13                                                                                                     | -        |
| provider chips (8)                  | Tudo C23 · Chaveiro C23 · Mecânico C23 · Guincho C23 · Borracheiro C23 · Farmácia de plantão C23 · Eletricista C23 · Encanador C23                                            | -        |
| `validateProvider` rules (9)        | id C29 · name C29 · phone C29 · verifiedAt C29 · source C29 · category C29 · lat C29 · lng C29 · hours C29                                                                    | -        |
| provider ordering examples (4)      | 300 m vs 100 m C27 · equal distance C27 · no position C27 · category order C27                                                                                                | -        |
| Início circuit card states (3)      | Tudo and empty C18 · chip Cultura C19 · search "jorge" C19                                                                                                                    | -        |
| position asks (4)                   | Emergência empty C32 · Emergência with a place C32 · Urgências empty C30 · Urgências with a provider C30                                                                      | -        |
| source controls: Explorar (5)       | Gastronomia C6 · Cultura C6 · Praias C6 · Circuitos C6 · Perfil icon C6                                                                                                       | -        |
| source controls: Cultura (3)        | Back C7 · Casa de Jorge Amado card C7 · Catedral de São Sebastião card C7                                                                                                     | -        |
| source controls: Circuitos (2)      | Back C11 · circuit card C11                                                                                                                                                   | -        |
| source controls: Circuito (5)       | Back C15 · stop 1 C13 · stop 2 C13 · stop 3 C13 · Iniciar roteiro C15                                                                                                         | -        |
| source controls: Urgências (10)     | Back C21 · Ver números de emergência C22 · Tudo C23 · Chaveiro C23 · Mecânico C23 · Guincho C23 · Borracheiro C23 · Farmácia de plantão C23 · Eletricista C23 · Encanador C23 | -        |
| source controls: Emergência row (1) | Urgências do dia a dia C21                                                                                                                                                    | -        |
| doors (3)                           | route shapes C40 · circuit shape C40 · provider shape C41                                                                                                                     | -        |

## Swept

- validation: C29
- failure modes: C10
- idempotency: n/a - no write, request or retry exists in these screens
- authorization: n/a - no account, role or protected data; the screens are public and read only
- concurrency: C32 (a single position ask under StrictMode)
- data lifecycle: C36
- dependency failure: C10, C32
- state transitions: C4, C18, C19
- observability: C30 (the position is never logged); n/a - no metrics requirement in this round

## Handoff

- **Settled mid-build:** user: "Aprovado, pode seguir com o plano da P2, implemente usando as skill que temos disponíveis par auxiliar nesse processo" (the plan approval, 2026-10-29); AD-015, AD-016 and AD-017 from the three scope questions
- **Dispatched:** on the user's request (2026-10-29): the Verifier (FAIL, 7 findings, 5 of 9 mutations killed) and the screens sub-agent round 1 (6 of 7 pictures diverging) at code `HEAD` dae5305, both `returned`. Fixed in 07c4279 and 16821ea. Screens round 2 (resumed sub-agent) at code `HEAD` 99453c4, `returned`: all 7 pictures match
- **Boundary:** C1-C41 built and proven by tests in a9ee9d9; the tab label fix in 3d924e9; the Verifier and screens fixes in 07c4279; the 7 running pictures were re-saved after 07c4279
- **Abandoned:** none
- **Walked:** `pnpm exec vite` on 5180 at 390x844 with Playwright, onboarding done and Portuguese stored, reaching each state by tapping: Início, then the Explorar tab, Cultura, Back, Circuitos, the circuit card, the Emergência tab scrolled to the end, and the "Urgências do dia a dia" row. At each step the page was not wider than the window. The four tab labels sit on one line at 390 px
