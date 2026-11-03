# P1 screens checks

Mutations: 3
Build: `pnpm build`; `pnpm lint`
Plan: `.specs/features/p1-screens/plan.md`

## Intent

47 checks in 6 slices · 4 one-way doors · 0 open

## Checks

### S1 - Navigation

**C1** - With no stored preferences the app opens on Idioma at `#/idioma` and matches `.specs/features/p1-screens/captures/idioma.png` (AC 1)
Proof: browser - reach the state, save `captures/idioma.running.png`
Proof: `pnpm exec vitest run src/app/AppShell.test.tsx -t "opens on Idioma with no preferences"`

**C2** - With onboarding done and no hash the app opens on Início at `#/inicio` and matches `.specs/features/p1-screens/captures/inicio.png` (AC 2)
Proof: browser - reach the state, save `captures/inicio.running.png`
Proof: `pnpm exec vitest run src/app/AppShell.test.tsx -t "opens on Início when onboarding is done"`

**C3** - An unknown hash shows Início when onboarding is done and Idioma when it is pending; an unknown place id shows Perto de mim (AC 3)
Proof: `pnpm exec vitest run src/app/routes.test.ts -t "falls back"`

**C4** - The bar shows on `#/inicio`, `#/perto-de-mim`, `#/lugar/<id>`, `#/emergencia`, `#/perfil`, `#/privacidade`, on `#/idioma` once onboarding is done, and on no other route (AC 4)
Proof: `pnpm exec vitest run src/app/routes.test.ts -t "shows the bar only on in-app routes"`

**C5** - Tapping a tab goes to its route and marks it with `aria-current="page"`; Lugar marks Perto de mim; Perfil and Privacidade mark none (AC 5)
Proof: `pnpm exec vitest run src/app/routes.test.ts -t "marks the selected tab"`
Proof: `pnpm exec vitest run src/app/AppShell.test.tsx -t "tapping a tab goes to its route"`

**C6** - Back returns to the previous screen without reloading (AC 6)
Proof: `pnpm exec vitest run src/app/AppShell.test.tsx -t "Back returns to the previous screen"`

**C7** - While onboarding is pending the Início and Perto de mim tabs show Idioma and Emergência stays reachable (AC 7)
Proof: `pnpm exec vitest run src/app/routes.test.ts -t "while onboarding is pending"`
Proof: `pnpm exec vitest run src/app/AppShell.test.tsx -t "pending onboarding guards the tabs"`

**C8** - Emergência shows the three-tab bar and each service name by C36, and matches `.specs/features/p1-screens/captures/emergencia.png` (AC 8)
Proof: browser - reach the state, save `captures/emergencia.running.png`
Proof: `pnpm exec vitest run src/app/AppShell.test.tsx -t "Emergência shows the bar"`

### S2 - Languages and preferences

**C9** - The language is `en` or `es` when `navigator.language` starts with them, ignoring case, and `pt` otherwise (AC 9)
Proof: `pnpm exec vitest run src/i18n/i18n.test.ts -t "detects the language"`

**C10** - Picking a language on Idioma changes every text of the screen at once and sets `document.documentElement.lang` to `pt-BR`, `en` or `es` (AC 10)
Proof: `pnpm exec vitest run src/app/AppShell.test.tsx -t "picking a language changes the text and lang"`

**C11** - Every message key has a non-empty text in `pt`, `en` and `es` (AC 11)
Proof: `pnpm exec vitest run src/i18n/i18n.test.ts -t "has a text in every language for every key"`

**C12** - Language, theme, onboarding and countVisit are stored under `amado.preferences.v1` and read the same on the next open (AC 12)
Proof: `pnpm exec vitest run src/preferences/preferences.test.ts -t "stores and reads the same values"`

**C13** - Missing, unparseable or unknown stored values give the default for that field and never throw (AC 13)
Proof: `pnpm exec vitest run src/preferences/preferences.test.ts -t "uses the default for bad stored values"`

**C14** - A `localStorage` that throws on read or write keeps the preferences in memory and never throws (AC 14)
Proof: `pnpm exec vitest run src/preferences/preferences.test.ts -t "keeps working when localStorage throws"`

**C15** - Nothing but the four fields is stored under `amado.preferences.v1` (AC 15)
Proof: `pnpm exec vitest run src/preferences/preferences.test.ts -t "stores only the four fields"`

### S3 - First open

**C16** - Tapping a language marks it and Continuar stores it and shows Localização, which matches `.specs/features/p1-screens/captures/localizacao.png` (AC 16)
Proof: browser - reach the state, save `captures/localizacao.running.png`
Proof: `pnpm exec vitest run src/features/onboarding/onboarding.test.tsx -t "Continuar stores the language"`

**C17** - Idioma shows the three titles in every language and the hint in the chosen language (AC 17)
Proof: `pnpm exec vitest run src/features/onboarding/onboarding.test.tsx -t "shows the three titles"`

**C18** - The Emergência shortcut on Idioma and Localização shows Emergência and leaves onboarding pending (AC 18)
Proof: `pnpm exec vitest run src/features/onboarding/onboarding.test.tsx -t "Emergência shortcut"`

**C19** - "Permitir localização" asks the browser once, stores onboarding `done` and countVisit by the answer, and shows Início (AC 19)
Proof: `pnpm exec vitest run src/features/onboarding/onboarding.test.tsx -t "Permitir localização"`

**C20** - "Agora não" stores onboarding `done` and countVisit `false`, does not ask the browser and shows Início (AC 20)
Proof: `pnpm exec vitest run src/features/onboarding/onboarding.test.tsx -t "Agora não"`

**C21** - Idioma and Localização show no bar while onboarding is pending (AC 21)
Proof: `pnpm exec vitest run src/app/AppShell.test.tsx -t "no bar on the first two screens"`

**C22** - Opening Idioma from Perfil shows no shortcut but shows the bar, and Continuar stores the language and returns to Perfil (AC 22)
Proof: `pnpm exec vitest run src/features/onboarding/onboarding.test.tsx -t "Idioma from Perfil"`

### S4 - Discover

**C23** - Início shows the title, today's date in the chosen language, the search field, the chips, the list and the Perfil icon, and matches `.specs/features/p1-screens/captures/inicio.png` (AC 23)
Proof: browser - reach the state, save `captures/inicio.running.png`
Proof: `pnpm exec vitest run src/features/places/HomeScreen.test.tsx -t "shows the title and the date"`
Proof: `pnpm exec vitest run src/i18n/i18n.test.ts -t "formats today"`

**C24** - The search field lists the places whose name or summary contains the text, ignoring case and accents, and all of them when empty (AC 24)
Proof: `pnpm exec vitest run src/features/places/places.test.ts -t "searches ignoring case and accents"`
Proof: `pnpm exec vitest run src/features/places/HomeScreen.test.tsx -t "typing in the search filters"`

**C25** - Tapping a chip shows only that category and marks it selected; "Tudo" is selected on opening and only one chip is selected (AC 25)
Proof: `pnpm exec vitest run src/features/places/HomeScreen.test.tsx -t "tapping a chip filters"`

**C26** - Tapping a place card shows Lugar for that place, which matches `.specs/features/p1-screens/captures/lugar.png` (AC 26)
Proof: browser - reach the state, save `captures/lugar.running.png`
Proof: `pnpm exec vitest run src/features/places/HomeScreen.test.tsx -t "tapping a card opens Lugar"`

**C27** - The Perfil icon, named "Abrir perfil", shows Perfil from Início and from Perto de mim (AC 27)
Proof: `pnpm exec vitest run src/features/places/HomeScreen.test.tsx -t "the Perfil icon"`
Proof: `pnpm exec vitest run src/features/places/NearbyScreen.test.tsx -t "the Perfil icon"`

**C28** - Perto de mim shows the title, chips and list with every place tagged "Exemplo" and "Sem distância", and matches `.specs/features/p1-screens/captures/perto-de-mim.png` (AC 28)
Proof: browser - reach the state, save `captures/perto-de-mim.running.png`
Proof: `pnpm exec vitest run src/features/places/NearbyScreen.test.tsx -t "shows the list with Exemplo"`

**C29** - While `loadPlaces()` is pending the loading blocks show and the bar stays usable, matching `.specs/features/p1-screens/captures/perto-de-mim-carregando.png` (AC 29)
Proof: browser - reach the state, save `captures/perto-de-mim-carregando.running.png`
Proof: `pnpm exec vitest run src/features/places/NearbyScreen.test.tsx -t "loading blocks"`
Proof: `pnpm exec vitest run src/app/AppShell.test.tsx -t "loading keeps the bar usable"`

**C30** - A category with no place shows the empty state with "Ver todos os lugares", which selects "Tudo", matching `.specs/features/p1-screens/captures/perto-de-mim-sem-resultado.png` (AC 30)
Proof: browser - reach the state, save `captures/perto-de-mim-sem-resultado.running.png`
Proof: `pnpm exec vitest run src/features/places/NearbyScreen.test.tsx -t "empty state"`

**C31** - A rejected `loadPlaces()` shows the error block and "Tentar de novo" loads again, matching `.specs/features/p1-screens/captures/perto-de-mim-com-erro.png` (AC 31)
Proof: browser - reach the state, save `captures/perto-de-mim-com-erro.running.png`
Proof: `pnpm exec vitest run src/features/places/NearbyScreen.test.tsx -t "error block"`

**C32** - While the location permission is not granted Perto de mim shows the warning and "Como ligar a localização", which shows Privacidade e dados, matching `.specs/features/p1-screens/captures/perto-de-mim-sem-localizacao.png` (AC 32)
Proof: browser - reach the state, save `captures/perto-de-mim-sem-localizacao.running.png`
Proof: `pnpm exec vitest run src/features/places/NearbyScreen.test.tsx -t "location warning"`

**C33** - Lugar shows Voltar, the photo area, the "Exemplo" tag, the name and the summary in the chosen language, and Voltar returns (AC 33)
Proof: `pnpm exec vitest run src/features/places/PlaceScreen.test.tsx -t "shows the place page"`

**C34** - A place with no coordinate shows no distance and no route action (AC 34)
Proof: `pnpm exec vitest run src/features/places/PlaceScreen.test.tsx -t "no distance and no route"`

**C35** - No P1 screen shows a "patrocinado" label (AC 35)
Proof: `pnpm exec vitest run src/app/AppShell.test.tsx -t "shows no patrocinado on any screen"`

### S5 - Emergência in three languages

**C36** - Each service name has the title in the chosen language and the other two languages as the second line (AC 36)
Proof: `pnpm exec vitest run src/features/emergency/numbers.test.ts -t "names each service in three languages"`
Proof: `pnpm exec vitest run src/features/emergency/EmergencyScreen.test.tsx -t "lists the five numbers"`

**C37** - The Emergência title, lead, "Mais perto de você", the empty and no-position lines, "Ligar" and "Rota" read in the chosen language (AC 37)
Proof: `pnpm exec vitest run src/features/emergency/EmergencyScreen.test.tsx -t "reads in the chosen language"`

**C38** - Offline the alert shows in the chosen language above the numbers, matching `.specs/features/p1-screens/captures/emergencia-sem-internet.png` (AC 38)
Proof: browser - reach the state, save `captures/emergencia-sem-internet.running.png`
Proof: `pnpm exec vitest run src/features/emergency/EmergencyScreen.test.tsx -t "offline and online events"`

**C39** - The five numbers link `tel:190`, `tel:192`, `tel:193`, `tel:180` and `tel:199` in every language (AC 39)
Proof: `pnpm exec vitest run src/features/emergency/EmergencyScreen.test.tsx -t "keeps the tel links in every language"`

### S6 - Perfil and Privacidade

**C40** - Perfil shows Voltar, the Idioma row with the language's own name, the four appearance options and the Privacidade row, and matches `.specs/features/p1-screens/captures/perfil.png` (AC 40)
Proof: browser - reach the state, save `captures/perfil.running.png`
Proof: `pnpm exec vitest run src/features/profile/ProfileScreen.test.tsx -t "shows the rows"`
Proof: `pnpm exec vitest run src/features/profile/ProfileScreen.test.tsx -t "writes the Idioma row with its own name"`

**C41** - Tapping the Idioma row shows Idioma by C22 (AC 41)
Proof: `pnpm exec vitest run src/features/profile/ProfileScreen.test.tsx -t "the Idioma row"`

**C42** - Tapping an appearance option marks it, stores it and sets `data-theme` to `light`, `dark` or `contrast`, and removes it for Automático (AC 42)
Proof: `pnpm exec vitest run src/features/profile/ProfileScreen.test.tsx -t "appearance option"`

**C43** - Tapping the Privacidade row shows Privacidade e dados, which matches `.specs/features/p1-screens/captures/privacidade.png` (AC 43)
Proof: browser - reach the state, save `captures/privacidade.running.png`
Proof: `pnpm exec vitest run src/features/profile/ProfileScreen.test.tsx -t "the Privacidade row"`

**C44** - Tapping the "Contar a minha visita" switch flips countVisit, stores it and writes "Ligado" or "Desligado" (AC 44)
Proof: `pnpm exec vitest run src/features/profile/PrivacyScreen.test.tsx -t "the switch"`

**C45** - "Localização do aparelho" reads "Permitida", "Negada" or "Não perguntada" for granted, denied and prompt, and "Não perguntada" when the browser cannot tell (AC 45)
Proof: `pnpm exec vitest run src/features/profile/PrivacyScreen.test.tsx -t "location row"`

**C46** - Voltar on Perfil and Privacidade returns to the previous screen and to Início when there is none (AC 46)
Proof: `pnpm exec vitest run src/features/profile/ProfileScreen.test.tsx -t "Voltar"`
Proof: `pnpm exec vitest run src/features/profile/PrivacyScreen.test.tsx -t "Voltar"`

**C47** - The switch draws the knob on the right when on and on the left when off, matching `.specs/features/p1-screens/captures/privacidade.png` (AC 44, found by the screens review)
Proof: `pnpm exec vitest run src/ui/ToggleRow.test.tsx -t "draws the knob on the right when on"`

## Coverage

| Set (size)                                                                 | Member -> proof                                                                                                                                            | Unproven |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| routes (8)                                                                 | `#/idioma` C1 · `#/localizacao` C16 · `#/inicio` C2 · `#/perto-de-mim` C28 · `#/lugar/<id>` C26 · `#/emergencia` C8 · `#/perfil` C40 · `#/privacidade` C43 | -        |
| route fallbacks (4 examples)                                               | `#/xyz` done C3 · `#/lugar/` C3 · unknown id C3 · `#/xyz` pending C3                                                                                       | -        |
| bar routes (8)                                                             | `#/inicio` C4 · `#/perto-de-mim` C4 · `#/lugar/<id>` C4 · `#/emergencia` C4 · `#/perfil` C4 · `#/privacidade` C4 · `#/idioma` C21 · `#/localizacao` C21    | -        |
| languages (3)                                                              | `pt` C9 · `en` C9 · `es` C9, each also in C10, C11 and C36                                                                                                 | -        |
| language detection (6 examples)                                            | en-US C9 · es-419 C9 · ES C9 · pt-BR C9 · fr C9 · empty C9                                                                                                 | -        |
| themes (4)                                                                 | auto C42 · light C42 · dark C42 · contrast C42                                                                                                             | -        |
| stored fields (4)                                                          | language C12 · theme C12 · onboarding C12 · countVisit C12, bad values C13                                                                                 | -        |
| bad stored values (5)                                                      | invalid JSON C13 · language `fr` C13 · theme `neon` C13 · countVisit `"yes"` C13 · valid next to bad C13                                                   | -        |
| category chips (4)                                                         | Tudo C25 · Gastronomia C25 · Cultura C25 · Praias C30                                                                                                      | -        |
| search examples (3)                                                        | "vesuvio" C24 · "JORGE" C24 · "xyz" C24                                                                                                                    | -        |
| date examples (4)                                                          | pt 2026-10-28 C23 · en C23 · es C23 · pt 2026-01-01 C23                                                                                                    | -        |
| permission states (4)                                                      | granted C45 · denied C45 · prompt C45 · unknown C45                                                                                                        | -        |
| level 1 numbers (5)                                                        | 190 C39 · 192 C39 · 193 C39 · 180 C39 · 199 C39, each in 3 languages C36                                                                                   | -        |
| source controls: `idioma.png` (3)                                          | language switch C10 · Continuar C16 · Emergência shortcut C18                                                                                              | -        |
| source controls: `localizacao.png` (3)                                     | Permitir localização C19 · Agora não C20 · Emergência shortcut C18                                                                                         | -        |
| source controls: `inicio.png` (4)                                          | search field C24 · chips C25 · card C26 · Perfil icon C27                                                                                                  | -        |
| source controls: `perto-de-mim.png` (3)                                    | chips C25 · card C26 · Perfil icon C27                                                                                                                     | -        |
| source controls: states (3)                                                | Ver todos os lugares C30 · Tentar de novo C31 · Como ligar a localização C32                                                                               | -        |
| source controls: `lugar.png` (1)                                           | Voltar C33                                                                                                                                                 | -        |
| source controls: `perfil.png` (7)                                          | Voltar C46 · Idioma row C41 · Automático C42 · Claro C42 · Escuro C42 · Alto contraste C42 · Privacidade row C43                                           | -        |
| source controls: switch knob (1)                                           | knob on the right when on C47                                                                                                                              | -        |
| source controls: `privacidade.png` (2)                                     | Voltar C46 · Contar a minha visita switch C44                                                                                                              | -        |
| source controls: `emergencia.png` (3)                                      | number links C39 · tabs C5 · no Perfil icon C8                                                                                                             | -        |
| entities: `Preferences`, `Language`, `Theme`, `Place`, `PlaceCategory` (5) | `Preferences` C12 · `Language` C9 · `Theme` C42 · `Place` C33 · `PlaceCategory` C25                                                                        | -        |
| one-way doors (4)                                                          | door 1 hash routes C3 · door 2 stored key and fields C12 and C15 · door 3 typed keys C11 · door 4 `loadPlaces()` contract C29 and C31                      | -        |

- Claims naming a URL or route shape: C1, C2, C3, C4 - each has a proof that reads the route or the rendered link
- No other check claims more than the single case its proof exercises

## Swept

- validation: C13, C24
- failure modes: C14, C31
- idempotency: n/a - nothing is written twice; each preference write replaces the stored value
- authorization: n/a - there is no identity and no signup, so there is nothing to authorize
- concurrency: C6
- data lifecycle: C12, C15
- dependency failure: C14, C31, C32, C45
- state transitions: C7, C19, C20, C22
- observability: C15

## Handoff

- **Settled mid-build:** user: "Pode implementar" (the plan approval, 2026-10-28)
- **Dispatched:** the Verifier and the screens sub-agent (round 1) on 2026-10-29 at `HEAD` 12bccb6, both `returned`: Verifier FAIL with 8 findings, screens 10 of 13 pictures diverging. Fixed in 015d016 and 4f8251e; decisions AD-013 and AD-014. Screens round 2 (resumed sub-agent `a4e40558bc845bfe2`) sent at `HEAD` 467a174 to re-judge the 13 pictures re-saved at 4f8251e
- **Boundary:** C1-C46 built and proven by tests; code commits 5a05765, 67ec167, f304536 and ecc3818 on `feat/p1-screens`; the 13 running pictures were taken at ecc3818
- **Abandoned:** none
- **Walked:** `pnpm exec vite` at 390x844 with Playwright, reaching each state by the gesture a user would use: Idioma and Localização with onboarding pending; Início, Perto de mim, Lugar, Perfil, Privacidade and Emergência with onboarding done and Portuguese stored; Perto de mim with the location permission not granted for the warning and granted for the plain list; the empty state by tapping the Praias chip; Emergência offline with `setOffline(true)`. The loading and error blocks are reached in development only through the `simular` query (`?simular=carregando` and `?simular=erro`), because example data never produces them. The top margin is 16 px here; the capture's extra top space is the phone status bar that `env(safe-area-inset-top)` supplies on a notched phone. Perto de mim shows a "Tudo" chip that the capture does not draw, because "Ver todos os lugares" needs it; this is not in `## Differences from the source` and is for the user to rule on
