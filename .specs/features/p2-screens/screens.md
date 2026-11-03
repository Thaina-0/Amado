# P2 screens

**Verifier**: independent sub-agent (author != verifier)
**Round**: 2
**HEAD**: 99453c4

| Screen                                      | Compared with                       | Verdict | Finding                  |
| ------------------------------------------- | ----------------------------------- | ------- | ------------------------ |
| `captures/explorar.running.png`             | `captures/explorar.png`             | matches | no row differs           |
| `captures/explorar-cultura.running.png`     | `captures/explorar-cultura.png`     | matches | no row differs (round 2) |
| `captures/explorar-circuitos.running.png`   | `captures/explorar-circuitos.png`   | matches | no row differs (round 2) |
| `captures/circuito.running.png`             | `captures/circuito.png`             | matches | no row differs (round 2) |
| `captures/urgencias.running.png`            | `captures/urgencias.png`            | matches | no row differs (round 2) |
| `captures/emergencia-urgencias.running.png` | `captures/emergencia-urgencias.png` | matches | no row differs (round 2) |
| `captures/inicio.running.png`               | `captures/inicio.png`               | matches | no row differs (round 2) |

Notes that apply to every picture (spacing, not rows): the pictures start the content about 56 px
higher than the captures (the captures leave a blank band at the top) and the tab bar is about 42 px
shorter. The selected chip and the selected tab label read darker/near-black in the pictures where the
captures draw brown/dark brown. Text sizes match the captures on every screen, so no picture was
resized.

### `captures/explorar.running.png`

| Element                                                                      | Result | Picture draws |
| ---------------------------------------------------------------------------- | ------ | ------------- |
| title `Explorar` at the top left, bold                                       | same   |               |
| subtitle `Descubra Ilhéus por categoria` under the title                     | same   |               |
| Perfil icon, round with a brown border, top right                            | same   |               |
| row `Gastronomia` with a chevron on the right, white card with a thin border | same   |               |
| row `Cultura` with a chevron                                                 | same   |               |
| row `Praias` with a chevron                                                  | same   |               |
| row `Circuitos` with a chevron                                               | same   |               |
| the four rows stacked in that order, full width, with equal gaps             | same   |               |
| empty space below the rows                                                   | same   |               |
| tab bar: Início, Explorar, Perto de mim, Emergência with icons and labels    | same   |               |
| Explorar selected (pill behind icon, bold label); Emergência label in red    | same   |               |
| render: text size, nothing cut off or overlapping                            | same   |               |

### `captures/explorar-cultura.running.png`

| Element                                                                         | Result | Picture draws                                                                        |
| ------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------ |
| header: round Back button with arrow, title `Cultura` beside it                 | same   |                                                                                      |
| card 1 title `Casa de Jorge Amado`                                              | same   |                                                                                      |
| card 1 subtitle `Museu no centro histórico`                                     | same   | round 2: `Museu no Centro histórico`; the capture was corrected to the same wording  |
| card 1 distance `Sem distância` with a pin icon                                 | same   |                                                                                      |
| card 1 tag `Exemplo` drawn with a clock icon, right-aligned on the distance row | same   | round 2: info icon placed after the distance text, as the corrected capture draws it |
| card 2 title `Catedral de São Sebastião`                                        | same   |                                                                                      |
| card 2 subtitle `Igreja no centro histórico`                                    | same   |                                                                                      |
| card 2 distance `Sem distância` with a pin icon                                 | same   |                                                                                      |
| card 2 tag `Exemplo` with a clock icon, right-aligned                           | same   | round 2: info icon next to the distance text, as the corrected capture draws it      |
| the two cards stacked, white with a thin border, nothing else on the screen     | same   |                                                                                      |
| tab bar with Explorar selected                                                  | same   |                                                                                      |
| render: text size, nothing cut off or overlapping                               | same   |                                                                                      |

### `captures/explorar-circuitos.running.png`

| Element                                                                           | Result | Picture draws                                         |
| --------------------------------------------------------------------------------- | ------ | ----------------------------------------------------- |
| header: round Back button with arrow, title `Circuitos`                           | same   |                                                       |
| card with title `Circuito cultural do centro`                                     | same   |                                                       |
| card summary `Três lugares do centro histórico, na ordem do passeio` on two lines | same   |                                                       |
| tag `Exemplo` with a heart icon, below the summary, left-aligned                  | same   | round 2: info icon, as the corrected capture draws it |
| no chevron, duration, distance or hours on the card                               | same   |                                                       |
| tab bar with Explorar selected                                                    | same   |                                                       |
| render: text size, nothing cut off or overlapping                                 | same   |                                                       |

### `captures/circuito.running.png`

| Element                                                                                    | Result | Picture draws                 |
| ------------------------------------------------------------------------------------------ | ------ | ----------------------------- |
| header: round Back button with arrow, title `Circuito`                                     | same   |                               |
| tag `Exemplo` with an info icon, above the title                                           | same   |                               |
| title `Circuito cultural do centro`, large and bold                                        | same   |                               |
| summary `Três lugares do centro histórico, na ordem do passeio`                            | same   |                               |
| section heading `Paradas`                                                                  | same   |                               |
| row `1. Casa de Jorge Amado` with a chevron on the right                                   | same   | round 2: chevron on the right |
| row `2. Catedral de São Sebastião` with a chevron                                          | same   | round 2: chevron on the right |
| row `3. Bar Vesúvio` with a chevron                                                        | same   | round 2: chevron on the right |
| rows stacked in that order, white cards with a thin border                                 | same   |                               |
| button `Iniciar roteiro`, filled brown, full width, with a send/arrow icon, under the rows | same   |                               |
| no duration, author, distance or route                                                     | same   |                               |
| tab bar with Explorar selected                                                             | same   |                               |
| render: text size, nothing cut off or overlapping                                          | same   |                               |

### `captures/urgencias.running.png`

| Element                                                                                                             | Result | Picture draws                                 |
| ------------------------------------------------------------------------------------------------------------------- | ------ | --------------------------------------------- |
| header: round Back button with arrow, title `Urgências do dia a dia`                                                | same   |                                               |
| lead `Para o que não é risco de vida`                                                                               | same   |                                               |
| button `Ver números de emergência`, light fill with a brown border, full width, with a pin icon before the label    | same   | round 2: pin icon before the label            |
| chip `Tudo`, selected, filled, with a check                                                                         | same   |                                               |
| chip `Chaveiro`, outlined                                                                                           | same   |                                               |
| chip `Mecânico`, outlined                                                                                           | same   |                                               |
| a fourth chip cut at the right edge (the row scrolls)                                                               | same   | `Gu` visible; the capture shows a sliver      |
| empty block with dashed border: bold `Ainda não há prestadores verificados aqui.`                                   | same   |                                               |
| empty block body `O time do Amado ainda está conferindo as fontes. Nenhum nome ou telefone é mostrado antes disso.` | same   |                                               |
| no provider row, no `patrocinado`                                                                                   | same   |                                               |
| tab bar with Emergência selected (pill behind the icon, bold label)                                                 | same   | label drawn in red; the capture draws it dark |
| render: text size, nothing cut off or overlapping                                                                   | same   |                                               |

### `captures/emergencia-urgencias.running.png`

| Element                                                                                        | Result | Picture draws                                                                                                                                    |
| ---------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| card `Polícia Militar` with shield icon, sub-label `Police, Polícia`, number `190`             | same   |                                                                                                                                                  |
| card `SAMU, ambulância` with plus icon, sub-label `Ambulance, Ambulância`, number `192`        | same   |                                                                                                                                                  |
| card `Corpo de Bombeiros` with flame icon, sub-label `Fire department, Bomberos`, number `193` | same   |                                                                                                                                                  |
| card `Violência contra a mulher` with heart icon, number `180`                                 | same   |                                                                                                                                                  |
| card `Violência contra a mulher` sub-label `Violence against women`                            | same   | round 2: approved difference (AD-010), the two other languages as a second line                                                                  |
| card `Defesa Civil` with warning icon, sub-label `Civil defense, Defesa Civil`, number `199`   | same   |                                                                                                                                                  |
| the five cards red, stacked in that order                                                      | same   |                                                                                                                                                  |
| heading `Mais perto de você`                                                                   | same   |                                                                                                                                                  |
| sample row `Hospital 24 horas` with `Rota` and `Ligar`                                         | same   | approved difference (AD-002): the empty line `Ainda não há lugares verificados para mostrar. Os números acima funcionam sempre.` in a dashed box |
| row `Urgências do dia a dia` with a chevron, white card, below `Mais perto de você`            | same   |                                                                                                                                                  |
| picture is the screen scrolled to the end, with the row fully in view above the tab bar        | same   |                                                                                                                                                  |
| tab bar with Emergência selected                                                               | same   |                                                                                                                                                  |
| render: text size, nothing cut off or overlapping                                              | same   |                                                                                                                                                  |

### `captures/inicio.running.png`

| Element                                                                            | Result | Picture draws                                                                                               |
| ---------------------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------- |
| title `Hoje em Ilhéus`, Perfil icon top right                                      | same   |                                                                                                             |
| date line under the title                                                          | same   | `Quinta, 29 de outubro`; the date follows the day the picture was taken                                     |
| label `Buscar em Ilhéus`                                                           | same   |                                                                                                             |
| search field with a magnifier and placeholder `Buscar restaurantes, passeios...`   | same   |                                                                                                             |
| chips `Tudo` (selected, check), `Gastronomia`, `Cultura`, a fourth cut at the edge | same   |                                                                                                             |
| heading `Para fazer hoje`                                                          | same   |                                                                                                             |
| circuit card first: title `Circuito cultural do centro`                            | same   |                                                                                                             |
| circuit card: summary, tag `Exemplo`, no duration, distance or hours               | same   | approved difference (AD-008): `Três lugares do centro histórico, na ordem do passeio` and the `Exemplo` tag |
| card `Bar Vesúvio`, subtitle `Bar no centro histórico`                             | same   |                                                                                                             |
| card `Bar Vesúvio` distance and hours                                              | same   | approved difference (AD-008): `Sem distância` and no hours                                                  |
| card `Bar Vesúvio` with no tag                                                     | same   | round 2: approved difference (AD-008), the `Exemplo` tag on every place card                                |
| the list ends after `Bar Vesúvio`, two cards in all                                | same   | round 2: approved difference (AD-008), the three example places                                             |
| tab bar with Início selected (pill behind the icon, bold label)                    | same   |                                                                                                             |
| render: text size, nothing overlapping                                             | same   | the list is cut by the tab bar because the page scrolls, not a layout fault                                 |
