# P1 screens screens

**Verifier**: independent sub-agent (author != verifier)
**Round**: 2
**HEAD**: 4f8251e

General notes that apply to every pair (not rows): every capture has about 50 px of blank space above the first element (status-bar area) and the pictures start about 50 px higher; the typeface and sizes of the pictures read slightly smaller and tighter than the captures, and selected chips and segments are near-black in the pictures and brown in the captures (shade). No picture looks resized: layout is 390 px wide in all of them. Round 2: no new overlap, cut off or wide-page problem on any re-saved picture.

| Screen                                              | Compared with                               | Verdict | Finding                                                                           |
| --------------------------------------------------- | ------------------------------------------- | ------- | --------------------------------------------------------------------------------- |
| `captures/idioma.running.png`                       | `captures/idioma.png`                       | matches | 0 rows differ                                                                     |
| `captures/localizacao.running.png`                  | `captures/localizacao.png`                  | matches | 0 rows differ                                                                     |
| `captures/inicio.running.png`                       | `captures/inicio.png`                       | matches | 0 rows differ (round 1: active tab mark, now same)                                |
| `captures/perto-de-mim.running.png`                 | `captures/perto-de-mim.png`                 | matches | 0 rows differ (round 1: chip row and active tab mark, now same)                   |
| `captures/perto-de-mim-carregando.running.png`      | `captures/perto-de-mim-carregando.png`      | matches | 0 rows differ (round 1: chip row, loading blocks, active tab mark, now same)      |
| `captures/perto-de-mim-sem-resultado.running.png`   | `captures/perto-de-mim-sem-resultado.png`   | matches | 0 rows differ (round 1: chip row, chip row render, body copy, tab mark, now same) |
| `captures/perto-de-mim-com-erro.running.png`        | `captures/perto-de-mim-com-erro.png`        | matches | 0 rows differ (round 1: chip row, link placement, tab mark, now same)             |
| `captures/perto-de-mim-sem-localizacao.running.png` | `captures/perto-de-mim-sem-localizacao.png` | matches | 0 rows differ (round 1: chip row, active tab mark, now same)                      |
| `captures/lugar.running.png`                        | `captures/lugar.png`                        | matches | 0 rows differ (round 1: active tab mark, now same)                                |
| `captures/perfil.running.png`                       | `captures/perfil.png`                       | matches | 0 rows differ                                                                     |
| `captures/privacidade.running.png`                  | `captures/privacidade.png`                  | matches | 0 rows differ (round 1: switch drawing, now same)                                 |
| `captures/emergencia.running.png`                   | `captures/emergencia.png`                   | matches | 0 rows differ (round 1: nearest-place content, tab mark, now same)                |
| `captures/emergencia-sem-internet.running.png`      | `captures/emergencia-sem-internet.png`      | matches | 0 rows differ (round 1: active tab mark, now same)                                |

### `captures/idioma.running.png`

| Element                                                                                            | Result | Picture draws                                 |
| -------------------------------------------------------------------------------------------------- | ------ | --------------------------------------------- |
| cacao-pod logo, top left                                                                           | same   |                                               |
| `Emergência` pill, red filled, warning-triangle icon, top right                                    | same   |                                               |
| title `Escolha o idioma` large and bold                                                            | same   | note: slightly smaller                        |
| `Choose your language` and `Elige tu idioma` as two bold brown lines under the title               | same   |                                               |
| segmented control: globe icon, `Português` (selected, filled), `English`, `Español`, outlined pill | same   | note: selected fill near-black, capture brown |
| line `Você pode trocar depois, no perfil.` under the control                                       | same   |                                               |
| empty middle area                                                                                  | same   |                                               |
| `Continuar` button, brown, filled, chevron icon, full width at the bottom                          | same   |                                               |
| no tab bar                                                                                         | same   | round 2: still no bar (first-open state)      |

### `captures/localizacao.running.png`

| Element                                                                                                              | Result | Picture draws      |
| -------------------------------------------------------------------------------------------------------------------- | ------ | ------------------ |
| `Emergência` pill, red, top right                                                                                    | same   |                    |
| title `Mostre o que há perto de você` on two lines                                                                   | same   |                    |
| lead `O Amado usa a sua localização para achar lugares e socorro por perto.`                                         | same   | note: smaller type |
| row 1: pin icon, `Só enquanto você usa`, `Usamos a localização com o app aberto, nunca em segundo plano.`            | same   |                    |
| row 2: shield icon, `Em emergência, na hora`, `Serve para achar socorro perto e não fica guardada.`                  | same   |                    |
| row 3: person icon, `Dados só de grupos`, `Os relatórios mostram grupos de pessoas, nunca você.`                     | same   |                    |
| blue info box: info icon, `Você escolhe`, `Se recusar, o app continua igual. Você só não entra nos dados de grupos.` | same   |                    |
| `Permitir localização` button, brown filled, pin icon                                                                | same   |                    |
| `Agora não` button, outlined, light fill, under it                                                                   | same   |                    |
| no tab bar                                                                                                           | same   |                    |

### `captures/inicio.running.png`

| Element                                                                                                   | Result | Picture draws                                                                                                          |
| --------------------------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------- |
| title `Hoje em Ilhéus` and the line `Quarta, 28 de outubro`                                               | same   |                                                                                                                        |
| Perfil icon, round outlined with person, top right                                                        | same   |                                                                                                                        |
| label `Buscar em Ilhéus` above the field                                                                  | same   |                                                                                                                        |
| search field: outlined, magnifier icon, placeholder `Buscar restaurantes, passeios...`                    | same   |                                                                                                                        |
| chips `Tudo` (selected, check), `Gastronomia`, `Cultura`, fourth chip cut at the right edge               | same   |                                                                                                                        |
| heading `Para fazer hoje`                                                                                 | same   |                                                                                                                        |
| card `Circuito cultural do centro`                                                                        | same   | approved omission (AD-012), not drawn                                                                                  |
| place card: name, summary line, pin with distance, clock with hours                                       | same   | approved departure (AD-008): `Sem distância`, no hours, `Exemplo` tag, three example cards; note: card padding tighter |
| tab bar: Início, Explorar, Perto de mim, Emergência, Início active with a small pill behind the icon only | same   | approved: three tabs, no Explorar                                                                                      |
| active tab mark                                                                                           | same   | round 2: small pill behind the icon, label under it; was differs in round 1                                            |
| Emergência tab in red                                                                                     | same   |                                                                                                                        |

### `captures/perto-de-mim.running.png`

| Element                                                                                     | Result | Picture draws                                                                                                                                          |
| ------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| title `Perto de mim`, Perfil icon right                                                     | same   |                                                                                                                                                        |
| subtitle `Aberto agora, do mais perto ao mais longe`                                        | same   | approved: `Lugares de exemplo em Ilhéus`, one line                                                                                                     |
| chip row: `Gastronomia` (selected), `Cultura`, `Praias`, all three whole and no `Tudo` chip | same   | round 2: approved (AD-013): `Tudo` (selected), `Gastronomia`, `Cultura`, fourth cut at the right edge as on the Início capture; was differs in round 1 |
| three place cards: name, summary, pin with distance, clock with hours                       | same   | approved (AD-008): `Sem distância`, no hours, `Exemplo` tag                                                                                            |
| fourth card `Restaurante na orla` cut by the bar                                            | same   | approved: three example places, no fourth card                                                                                                         |
| tab bar with four tabs, Perto de mim active, pill behind icon only                          | same   | approved: three tabs                                                                                                                                   |
| active tab mark                                                                             | same   | round 2: small pill behind the icon; was differs in round 1                                                                                            |

### `captures/perto-de-mim-carregando.running.png`

| Element                                                                                   | Result | Picture draws                                                                         |
| ----------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------- |
| title, Perfil icon, subtitle                                                              | same   | approved subtitle `Lugares de exemplo em Ilhéus`                                      |
| chip row: `Gastronomia` (selected), `Cultura`, `Praias`                                   | same   | round 2: approved (AD-013), `Tudo` selected first; was differs in round 1             |
| three loading cards: white card with a border, inside three grey bars (long, short, long) | same   | round 2: three bordered white cards with three grey bars each; was differs in round 1 |
| tab bar, Perto de mim active                                                              | same   | approved: three tabs                                                                  |
| active tab mark                                                                           | same   | round 2: small pill behind the icon; was differs in round 1                           |

### `captures/perto-de-mim-sem-resultado.running.png`

| Element                                                                        | Result | Picture draws                                                                                                                                                                                        |
| ------------------------------------------------------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title, Perfil icon, subtitle                                                   | same   | approved subtitle                                                                                                                                                                                    |
| chip row: `Gastronomia` (selected), `Cultura`, `Praias`, whole, unscrolled     | same   | round 2: approved (AD-013): four chips, row scrolled so the selected `Praias` is in view and the first chip cut at the left edge (`do`); scrolling is needed with four chips; was differs in round 1 |
| render of the chip row                                                         | same   | round 2: the dark scrollbar line is gone; was differs in round 1                                                                                                                                     |
| empty box, dashed border, title                                                | same   | approved: `Nenhum lugar nesta categoria`                                                                                                                                                             |
| empty box body `Tente outra categoria ou veja todos os lugares perto de você.` | same   | round 2: `…todos os lugares perto de você.`; was differs in round 1                                                                                                                                  |
| action `Ver todos os lugares`, outlined, compass icon, inside the box          | same   |                                                                                                                                                                                                      |
| tab bar, Perto de mim active                                                   | same   | approved: three tabs                                                                                                                                                                                 |
| active tab mark                                                                | same   | round 2: small pill behind the icon; was differs in round 1                                                                                                                                          |

### `captures/perto-de-mim-com-erro.running.png`

| Element                                                                                             | Result | Picture draws                                                              |
| --------------------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------- |
| title, Perfil icon, subtitle                                                                        | same   | approved subtitle                                                          |
| chip row: `Gastronomia` (selected), `Cultura`, `Praias`                                             | same   | round 2: approved (AD-013), `Tudo` selected first; was differs in round 1  |
| red error box with warning icon                                                                     | same   |                                                                            |
| error title `Não foi possível carregar os lugares`, bold red                                        | same   |                                                                            |
| error body `Última atualização às 09h14. Os números de emergência continuam salvos neste aparelho.` | same   | approved: the time line is dropped; note: body text black, capture brown   |
| `Tentar de novo` link, underlined blue, inside the box under the text                               | same   | round 2: the link is inside the box under the text; was differs in round 1 |
| tab bar, Perto de mim active                                                                        | same   | approved: three tabs                                                       |
| active tab mark                                                                                     | same   | round 2: small pill behind the icon; was differs in round 1                |

### `captures/perto-de-mim-sem-localizacao.running.png`

| Element                                                                                                                        | Result | Picture draws                                                             |
| ------------------------------------------------------------------------------------------------------------------------------ | ------ | ------------------------------------------------------------------------- |
| title, Perfil icon, subtitle                                                                                                   | same   | approved subtitle                                                         |
| chip row: `Gastronomia` (selected), `Cultura`, `Praias`                                                                        | same   | round 2: approved (AD-013), `Tudo` selected first; was differs in round 1 |
| yellow warning box: triangle icon, `Sem a sua localização`, `Não dá para ordenar por distância. Os lugares aparecem por tipo.` | same   |                                                                           |
| action `Como ligar a localização`, pin icon, underlined blue, centered under the box                                           | same   | note: closer to the box                                                   |
| place cards with `Sem distância` and hours                                                                                     | same   | approved (AD-008): no hours, `Exemplo` tag, third card present            |
| tab bar, Perto de mim active                                                                                                   | same   | approved: three tabs                                                      |
| active tab mark                                                                                                                | same   | round 2: small pill behind the icon; was differs in round 1               |

### `captures/lugar.running.png`

| Element                                          | Result | Picture draws                                               |
| ------------------------------------------------ | ------ | ----------------------------------------------------------- |
| round back button with arrow, title `Lugar`      | same   |                                                             |
| photo area, beige rounded block                  | same   |                                                             |
| tag `Exemplo`, blue pill with info icon          | same   |                                                             |
| name `Casa de Jorge Amado`                       | same   |                                                             |
| summary `Museu no Centro histórico`              | same   |                                                             |
| `Horário` with clock, `Aberto até 18h hoje`      | same   | approved omission (AD-008)                                  |
| `Onde fica` with pin, `Centro histórico, Ilhéus` | same   | approved omission (AD-008)                                  |
| `Ver rota` button                                | same   | approved omission (AD-008)                                  |
| `Avaliar este lugar` button                      | same   | approved omission (AD-007)                                  |
| `Relatar um problema` link                       | same   | approved omission (AD-007)                                  |
| tab bar, Perto de mim active                     | same   | approved: three tabs                                        |
| active tab mark                                  | same   | round 2: small pill behind the icon; was differs in round 1 |

### `captures/perfil.running.png`

| Element                                                                                                                            | Result | Picture draws        |
| ---------------------------------------------------------------------------------------------------------------------------------- | ------ | -------------------- |
| back button and title `Perfil`                                                                                                     | same   |                      |
| row `Idioma do app`, `Português`, chevron right                                                                                    | same   |                      |
| heading `Aparência`                                                                                                                | same   |                      |
| option `Automático`, `Segue o ajuste do aparelho`, selected (filled check, highlighted card)                                       | same   |                      |
| options `Claro` / `Fundo claro`, `Escuro` / `Fundo escuro`, `Alto contraste` / `Cores mais fortes, para ler ao sol`, empty circles | same   | note: cards tighter  |
| row `Privacidade e dados`, `O que o app coleta e a sua escolha`, chevron                                                           | same   |                      |
| tab bar with no tab marked                                                                                                         | same   | approved: three tabs |

### `captures/privacidade.running.png`

| Element                                                                           | Result | Picture draws                                                   |
| --------------------------------------------------------------------------------- | ------ | --------------------------------------------------------------- |
| back button and title `Privacidade e dados`                                       | same   |                                                                 |
| lead `O Amado usa só o que precisa para funcionar. Recusar não tira nada do app.` | same   |                                                                 |
| three rows with pin, shield, person icons and the three titles and sentences      | same   |                                                                 |
| card `Contar a minha visita`, `Entra só na contagem de grupos.`                   | same   |                                                                 |
| switch with label `Ligado` under it, brown track, white knob on the right (on)    | same   | round 2: brown track, knob on the right; was differs in round 1 |
| card `Localização do aparelho`, `Permitida`                                       | same   |                                                                 |
| footnote `Para mudar a permissão de localização, use os ajustes do navegador.`    | same   |                                                                 |
| tab bar with no tab marked                                                        | same   | approved: three tabs                                            |

### `captures/emergencia.running.png`

| Element                                                                                                    | Result | Picture draws                                                                                                                                            |
| ---------------------------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title `Emergência`, lead `Toque para ligar. Os números ficam salvos no aparelho.`                          | same   |                                                                                                                                                          |
| no Perfil icon                                                                                             | same   |                                                                                                                                                          |
| five red cards with icon, bold name, second line, large number: 190, 192, 193, 180, 199                    | same   |                                                                                                                                                          |
| second lines                                                                                               | same   | approved (AD-010): `Police, Policía`, `Ambulance, Ambulancia`, `Fire department, Bomberos`, two lines for 180, `Civil defense, Defensa Civil`            |
| heading `Mais perto de você`                                                                               | same   |                                                                                                                                                          |
| nearest-place card `Hospital 24 horas`, `Hospital, 1,2 km, aberto 24 h`, `Verificado pela equipe do Amado` | same   | round 2: approved (AD-002): dashed empty box `Ainda não há lugares verificados para mostrar. Os números acima funcionam sempre.`; was differs in round 1 |
| tab bar, Emergência active (small pill behind icon)                                                        | same   | approved: three tabs                                                                                                                                     |
| active tab mark                                                                                            | same   | round 2: small pill behind the icon; was differs in round 1                                                                                              |

### `captures/emergencia-sem-internet.running.png`

| Element                                                                                                                        | Result | Picture draws                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| title and lead                                                                                                                 | same   |                                                                                                                                                      |
| red alert box: warning icon, `Sem internet`, `Os números de emergência e os lugares salvos no aparelho continuam funcionando.` | same   |                                                                                                                                                      |
| alert above the numbers                                                                                                        | same   |                                                                                                                                                      |
| five red number cards in order 190, 192, 193, 180, 199                                                                         | same   | second lines per the approved AD-010; the picture scrolls further and shows `Mais perto de você` cut by the bar edge (scroll position, not a defect) |
| tab bar, Emergência active                                                                                                     | same   | approved: three tabs                                                                                                                                 |
| active tab mark                                                                                                                | same   | round 2: small pill behind the icon; was differs in round 1                                                                                          |
