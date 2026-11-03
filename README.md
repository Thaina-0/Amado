# Amado

_Ilhéus contada por quem ama · descubra, circule e peça ajuda_

Amado é um app para quem visita **Ilhéus, na Bahia**. Ele ajuda o turista a descobrir a cidade de verdade, a se mover por ela e, se algo der errado, a chegar rápido à ajuda certa.

O nome junta **Jorge Amado**, o autor mais ligado a Ilhéus, com o sentido de "querido". O app foi criado no **Hack Turismo Costa do Cacau 2026**, para o Desafio 3: _um só ponto para o turista e o trade_.

> **Em que pé estamos:** é um protótipo funcional, feito durante o hackathon. Ele já roda e dá para navegar por tudo, mas ainda não tem dados de emergência verificados nem servidor. Veja [o que ainda falta](#o-que-ainda-falta).

## O problema

Quem chega a uma cidade nova esbarra em duas dificuldades:

- **Pedir ajuda é difícil.** Em uma emergência ou num imprevisto (o carro quebrou, a chave ficou trancada), o turista não sabe para quem ligar nem onde fica o hospital ou a delegacia mais perto.
- **O turismo local está desconectado.** Hotéis, restaurantes, guias e prestadores têm o que oferecer, mas não há um ponto único onde o turista os encontre.

## A ideia

Um só app, que se abre pelo celular **sem baixar nada** (a ideia é chegar por um QR code em hotéis, rodoviária, aeroporto e pontos turísticos), com três coisas:

1. **Descobrir** a "Ilhéus de verdade, curada por quem é daqui": lugares, comidas, esportes e circuitos que levam o turista para além do centro.
2. **Circular:** ver o que há perto e como chegar.
3. **Pedir ajuda** com segurança. A emergência fica sempre a um toque, e é isso que dá confiança para explorar.

> O Amado **não substitui** os serviços de emergência. Ele reduz o tempo até chegar a eles.

## Para quem é

- **O turista** é o foco. Ele usa de graça e não precisa de conta.
- **O morador** ajuda a manter o app vivo fora da alta temporada, com dicas e eventos locais.
- **O trade** (hotéis, pousadas, restaurantes, guias e prestadores de urgência) ganha visibilidade para turistas e moradores.
- **A Secretaria de Turismo** poderia, no futuro, usar relatórios de dados agregados para planejar o destino.

## O que o app faz hoje

- **Primeira abertura:** uma animação de entrada, a escolha do idioma (português, inglês, espanhol, francês, alemão ou italiano) e o pedido de permissão de localização. Quem recusa continua usando tudo.
- **Descobrir:** busca e filtros por categoria (gastronomia, cultura, praias e esportes), com lugares de Ilhéus, fotos, uma história curta e o link da fonte. Há também um circuito cultural pelo centro histórico.
- **Eventos:** o que acontece em Ilhéus (festas e tradições, música, cultura, esportes e gastronomia), com filtro por categoria, filtro por data (hoje, próximos 7 dias, este mês ou um dia à escolha) e ordenação. Os próximos três aparecem no Início, e a lista já abre com eventos. Datas ainda não anunciadas aparecem como "data prevista" ou "data a divulgar".
- **Esportes:** surf, beach tennis, kitesurf e windsurf, stand up paddle e futevôlei, com onde praticar quando há fonte.
- **Perto de mim e como chegar:** o que há por perto e a rota, aberta no mapa do próprio aparelho.
- **Emergência:** os cinco números vitais com um toque (190, 192, 193, 180 e 199) e, separados, os prestadores de urgência do dia a dia (chaveiro, guincho, farmácia de plantão e outros).
- **Avaliar:** estrelas e um comentário opcional, anônimos e guardados só no aparelho.
- **Meu perfil de viagem e roteiro:** o turista responde, se quiser, algumas perguntas amplas (tempo de estadia, motivo da viagem, com quem viaja, interesses) e recebe um roteiro a partir delas.
- **Conta de demonstração:** entrar e criar conta existem na tela inicial, mas por enquanto são só para mostrar a ideia. Nada sai do aparelho.

Todas as telas funcionam em modo claro, escuro e de alto contraste, com letras e botões grandes e cores que nunca são o único sinal.

### Emergência em dois níveis

- **Nível 1, vital:** gratuito, verificado, **nunca patrocinado**, sem exigir cadastro e disponível mesmo sem internet.
- **Nível 2, urgências do dia a dia:** só prestadores verificados, ordenados por proximidade e **sem ordem comprada**.

## Nossos compromissos

Estas regras vêm das decisões do projeto. Quebrar uma delas é um defeito de produto, não de estilo.

1. A emergência vital **nunca** é ordenada nem destacada por pagamento.
2. Em emergência, a localização é usada na hora e **nunca é guardada**.
3. Relatórios e análises são **só de grupos**: nada identifica uma pessoa.
4. Pedimos localização e coleta de dados na primeira abertura, e **recusar não bloqueia nada**.
5. Por enquanto, **só Ilhéus**. O WhatsApp fica de fora desta versão.
6. Telefone, endereço e coordenada **nunca são inventados**. Onde falta fonte verificada, o campo fica vazio e marcado.
7. Todo conteúdo pago aparece com a etiqueta **"patrocinado"**.

## Como o projeto se sustenta

É uma hipótese, ainda a validar:

- O turista usa **de graça**, e o cadastro básico das empresas também é gratuito.
- As empresas do trade pagariam por **destaque** (sempre marcado como "patrocinado"), por promoção de eventos e ofertas e por um painel com dados de quem chega ao negócio.
- Mais adiante, a Secretaria de Turismo e empresas maiores poderiam assinar **relatórios de comportamento** do turista, sempre agregados e anônimos.
- **A emergência vital nunca entra nessa conta.**

Os parceiros imaginados são a Secretaria de Turismo de Ilhéus, guias, o SEBRAE/BA, a UESC, hotéis, pousadas e prestadores verificados. Todos ainda são intenção, sem acordo fechado.

## O que ainda falta

- **Dados de emergência verificados.** A lista de delegacia, hospital, UPA e bombeiros começa vazia de propósito, até o time conferir cada fonte. Os cinco números vitais já estão no app.
- **Conteúdo a confirmar.** Os lugares vêm de páginas públicas e aparecem com o aviso de que o time ainda precisa confirmar. Os textos em idiomas que não o português foram escritos por IA e precisam de revisão.
- **Servidor e contas de verdade.** Hoje avaliações, preferências e a conta de demonstração ficam só no aparelho.
- **Link público em HTTPS.** O modo offline de verdade só pode ser provado com ele.
- **Ainda não feitos:** relatar um problema, eventos, painel para o trade e relatórios para a Secretaria.
- **Negócio e nome:** preços, custos, parcerias e o uso do nome "Amado" (direitos, marca e domínio) precisam ser validados antes de um lançamento.

## Fotos e fontes

As fotos vêm do **Wikimedia Commons**, com licença livre, e o autor, a licença e o link original aparecem sob cada imagem. As que só ilustram a região, o prato ou o esporte levam o aviso "Foto ilustrativa". As fotos pertencem aos respectivos autores.

## Quer ver rodando?

Precisa de [Node.js](https://nodejs.org) 20 ou mais e do [pnpm](https://pnpm.io):

```bash
pnpm install
pnpm dev
```

Os detalhes técnicos (como rodar no celular, testes, estrutura do código e jeito de trabalhar) estão em [`docs/DESENVOLVIMENTO.md`](docs/DESENVOLVIMENTO.md).

## Para saber mais

| Arquivo                                              | O que tem                                                                |
| ---------------------------------------------------- | ------------------------------------------------------------------------ |
| [`docs/CONTEXT.md`](docs/CONTEXT.md)                 | evento, públicos, modelo de negócios, privacidade, decisões e pendências |
| [`docs/TELAS.md`](docs/TELAS.md)                     | mapa das telas, estados e prioridades                                    |
| [`docs/DESENVOLVIMENTO.md`](docs/DESENVOLVIMENTO.md) | telas e rotas, stack, estrutura, qualidade e como trabalhamos            |
| [`.specs/STATE.md`](.specs/STATE.md)                 | decisões de produto e de engenharia (AD-NNN)                             |

## Licença

O código está sob a licença [MIT](LICENSE).
