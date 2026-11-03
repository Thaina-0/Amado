# Desenvolvimento

Detalhes técnicos do Amado: telas e rotas, como rodar, stack, estrutura, conteúdo, qualidade e jeito de trabalhar. Para entender o projeto em si, comece pelo [README](../README.md).

## Telas e rotas

As telas usam rotas por hash (`#/inicio`, `#/emergencia`...), que são o que um QR code impresso pode apontar. A barra de abas fica visível nas telas do app, para a emergência ficar sempre a um toque.

| Área              | Telas e rotas                                     | O que faz                                                                                                                                                                                                                                                                         |
| ----------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Primeira vez**  | Boas-vindas, Idioma, Localização e dados          | Abertura animada, escolha de idioma e pedido de permissão. Recusar a localização não bloqueia nada. Idioma e Localização têm um atalho direto para Emergência.                                                                                                                    |
| **Descobrir**     | Início, Explorar (por categoria), Lugar, Circuito | Busca e filtros por categoria, lugares com fotos, história e fonte, e um circuito cultural do centro.                                                                                                                                                                             |
| **Esportes**      | Categoria Esportes, Onde praticar                 | Surf, beach tennis, kitesurf e windsurf, stand up paddle e futevôlei, com onde praticar quando há fonte.                                                                                                                                                                          |
| **Circular**      | Perto de mim, Como chegar                         | Lista com estados de carregando, vazio, erro e sem localização. "Como chegar" abre o mapa pelo nome e pela cidade.                                                                                                                                                                |
| **Pedir ajuda**   | Emergência, Urgências do dia a dia                | Os 5 números do nível 1 com um toque. O nível 2 (chaveiro, guincho, farmácia de plantão...) só tem prestadores verificados.                                                                                                                                                       |
| **Contribuir**    | Avaliação no Lugar                                | Estrelas e comentário opcional de até 280 caracteres, anônimos e guardados só no aparelho.                                                                                                                                                                                        |
| **Planejar**      | Roteiro (aba), Meu perfil de viagem               | O turista responde o perfil de viagem (tempo de estadia, motivo, com quem viaja e interesses), sem precisar de conta, e a aba **Roteiro** mostra o roteiro montado dia a dia, com o motivo de cada lugar. Sem respostas, a aba leva ao perfil. As respostas ficam só no aparelho. |
| **Conta (demo)**  | Entrar, Cadastro, Minha conta                     | Login fictício e cadastro com perguntas opcionais de perfil. Minha conta lista os lugares avaliados. Sair volta às Boas-vindas.                                                                                                                                                   |
| **Configurações** | Perfil, Privacidade e dados                       | Idioma, aparência (automático, claro, escuro, alto contraste) e o consentimento de dados.                                                                                                                                                                                         |

### Emergência em dois níveis

- **Nível 1, vital:** 190 (Polícia Militar), 192 (SAMU), 193 (Bombeiros), 180 (violência contra a mulher) e 199 (Defesa Civil). É gratuito, verificado, **nunca patrocinado**, não exige cadastro e funciona offline. A lista "mais perto de você" (delegacia, hospital, UPA, bombeiros) começa **vazia de propósito** até haver fonte verificada.
- **Nível 2, urgências do dia a dia:** prestadores verificados, ordenados por proximidade, **sem ordem comprada**.

O app **não substitui** os serviços de emergência: ele reduz o tempo até chegar a eles.

## Como rodar

Requisitos: **Node.js 20+** (o CI usa 22) e [**pnpm**](https://pnpm.io) (o projeto usa pnpm, não npm nem yarn).

```bash
pnpm install       # instala as dependências e ativa os hooks do husky
pnpm dev           # servidor de desenvolvimento (Vite)
pnpm test          # testes uma vez (Vitest)
pnpm test:watch    # testes em modo contínuo
pnpm typecheck     # TypeScript strict
pnpm lint          # ESLint
pnpm format        # Prettier (escreve)
pnpm format:check  # Prettier (só confere)
pnpm build         # typecheck + build de produção, com service worker
pnpm preview       # serve o build local
```

Um arquivo só de teste: `pnpm test src/features/emergency/__tests__/numbers.test.ts`.

**Celular:** abra pelo IP da rede com `pnpm dev --host`. Em HTTP o navegador não libera geolocalização nem service worker, que exigem HTTPS.

**Estados de carregando e erro:** em desenvolvimento, `?simular=carregando` e `?simular=erro` mostram esses estados nas listas de lugares.

## Stack

| Camada        | Escolha                                                                |
| ------------- | ---------------------------------------------------------------------- |
| Interface     | React 19, TypeScript 6 (`strict`, `noUncheckedIndexedAccess`)          |
| Build         | Vite 8 e `vite-plugin-pwa` (service worker e manifesto)                |
| Estilo        | Tailwind CSS 4, com tokens do design system em `src/styles/tokens.css` |
| Ícones, fonte | `lucide-react` e Atkinson Hyperlegible Next (legibilidade)             |
| Testes        | Vitest, Testing Library e jsdom                                        |
| Qualidade     | ESLint, Prettier, husky e lint-staged                                  |

O TypeScript fica na versão 6 porque o `typescript-eslint` ainda não suporta a 7. Não suba antes disso.

Não há backend: preferências, sessão de demonstração e avaliações ficam no `localStorage` do aparelho.

## Estrutura do projeto

```
src/
├── app/                 AppShell, rotas por hash, navegação e barra de abas
├── features/            cada pasta tem um data.ts (conteúdo editável) e uma __tests__/
│   ├── emergency/       números do nível 1 e locais de emergência
│   ├── urgencias/       urgências do dia a dia (nível 2)
│   ├── places/          lugares, fotos, carrossel, Como chegar e busca
│   ├── explore/         Explorar por categoria
│   ├── circuits/        circuitos culturais
│   ├── sports/          Onde praticar
│   ├── reviews/         avaliação com estrelas e comentário
│   ├── account/         login, cadastro, conta e perfil de viagem (demonstração)
│   ├── plan/            roteiro montado a partir do perfil de viagem
│   ├── onboarding/      boas-vindas, idioma e localização
│   └── profile/         perfil e privacidade
├── i18n/                textos nos idiomas do app
├── preferences/         idioma, tema e consentimento (no aparelho)
├── styles/              tokens de design e animações
├── ui/                  componentes compartilhados (Alert, Chip, Splash...)
└── test-utils/          setup e utilitários do Vitest
public/places/<lugar>/   fotos dos lugares
docs/                    contexto, mapa de telas e referências
.specs/                  planos, checks e decisões (AD-NNN)
.claude/                 skills e agentes usados no desenvolvimento
```

## Conteúdo, fotos e fontes

- **Lugares:** o catálogo traz lugares, comidas e esportes de Ilhéus com histórias curtas, escritas de forma simples. Cada lugar mostra o link da fonte pública e o aviso _"Informação de fonte pública, ainda a confirmar pelo time"_. Lugares sem fonte confiável aparecem como "ainda sendo levantado", sem inventar nada (hoje, futevôlei e stand up paddle ficam sem foto).
- **Etiqueta "Exemplo":** continua em todo conteúdo, porque o time ainda não verificou nada (decisão AD-008).
- **Sem dado sensível inventado:** lugares não têm telefone, preço, horário, endereço nem coordenada. Um teste confere isso.
- **Fotos:** vêm do **Wikimedia Commons** com licença livre (CC0, CC BY, CC BY-SA ou domínio público). O autor, a licença e o link da página original aparecem sob cada foto, e os metadados ficam em [`src/features/places/data.ts`](../src/features/places/data.ts). Fotos que só ilustram a região, o prato ou o esporte levam o aviso "Foto ilustrativa". Um teste confere se cada foto existe, tem autor e licença livre.
- **Carrossel de fotos:** setas, deslizar o dedo, indicadores e botão de pausa. Troca sozinho a cada 5 segundos, para ao interagir e nunca troca sozinho para quem pede menos movimento.

## Idiomas, acessibilidade e movimento

- **Idiomas do app:** português, inglês, espanhol, francês, alemão e italiano. O conteúdo escrito à mão (lugares, circuitos, prestadores) está em português, inglês e espanhol; os outros idiomas mostram o texto em inglês. Os textos em outros idiomas que não o português foram escritos por IA e **precisam de revisão do time**.
- **Acessibilidade:** contraste AA, alvos de toque de 48 px, foco visível, modos claro, escuro e alto contraste, cor nunca como único sinal e ícone sempre com texto.
- **Movimento:** abertura animada a cada carregamento da página (marca, texto e uma barra que se desenha, em cerca de 2,9 s), troca de tela com fade, listas que entram em sequência e toque com resposta. Com `prefers-reduced-motion`, as animações de movimento são trocadas por fades e o carrossel não troca sozinho. Os blocos de carregamento ficam planos, sem brilho animado.

## Offline e PWA

- O app é instalável e o service worker guarda o código e os dados de emergência no aparelho.
- As **fotos** pesam mais e não são vitais: entram no cache só quando vistas (cache `place-photos`, até 60 itens por 30 dias), para não atrasar a instalação das telas de emergência.
- O modo offline de verdade **só pode ser provado em HTTPS**. Ainda não há deploy público.

## Qualidade e CI

O gate local é o mesmo do CI (`.github/workflows/ci.yml`), nesta ordem:

```bash
pnpm typecheck && pnpm lint && pnpm format:check && pnpm test && pnpm build
```

Os cinco passos precisam passar. Os testes cobrem, entre outras coisas, os números do nível 1, a lista de emergência vazia e honesta, as rotas, os idiomas, a avaliação, o login de demonstração e as fotos e licenças.

## Como trabalhamos

- **Convenções:** código, identificadores e comentários em inglês; todo texto para o usuário em português do Brasil, com acentos. Commits em [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`...). Prettier sem ponto e vírgula, aspas simples, 100 colunas, aplicado por hook.
- **Spec primeiro:** as features grandes seguem o fluxo da skill `tlc-spec-lean`: plano com critérios, checks com provas, construção e verificação independente. Planos, decisões e provas ficam em [`.specs/`](../.specs/).
- **Design:** o design system e as telas estão no Figma ("Amado — Design System"). Telas novas são desenhadas antes de codificadas; telas feitas com pressa de prazo precisam voltar ao Figma depois.
- **Decisões de produto** (AD-001 em diante) estão em [`.specs/STATE.md`](../.specs/STATE.md). Não reabra uma decisão sem falar com o time.
