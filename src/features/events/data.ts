import type { CityEvent } from './events'

const VIBE = 'https://www.vibeindex.com.br/events/ilheus-ba'
const FLI =
  'https://jornalgrandebahia.com.br/2026/10/festa-literaria-de-ilheus-chega-a-9a-edicao-com-programacao-gratuita-de-literatura-arte-e-cultura/'
const COPA =
  'https://ilheuseventos.com.br/entretenimento/eventos/ilheus-sediara-copa-jorge-amado-de-bandas-e-fanfarras-em-novembro/'
const SURF =
  'https://jornaldoradialista.com.br/circuito-do-cacau-surf-2026-reune-atletas-e-define-campeoes-da-primeira-etapa-em-olivenca/'
const CALENDARIO_2026 =
  'https://www.aregiao.com.br/archives/2026/01/ilheus-anuncia-as-atraces-para-2026.html'
const VIRADA_2025 =
  'https://www.ilheus.net/2025/12/virada-ilheus-2026-confira-a-programacao-completa-do-reveillon.html'
const MASTRO_WIKI = 'https://pt.wikipedia.org/wiki/Puxada_do_Mastro_de_S%C3%A3o_Sebasti%C3%A3o'
const MASTRO_PREFEITURA =
  'https://www.ilheus.ba.gov.br/detalhe-da-materia/info/festa-da-puxada-do-mastro-de-sao-sebastiao-acontece-neste-final-de-semana-em-olivenca/186850'
const WIKI_ILHEUS = 'https://pt.wikipedia.org/wiki/Ilh%C3%A9us'
const CARNAVAL = 'https://melhoresfestas.com.br/blog/carnaval-2027-data-quando-e'
const SAO_JORGE =
  'https://ilheus.com.br/festa-de-sao-jorge-dos-ilheus-padroeira-da-cidade-e-da-diocese-de-14-a-23-de-abril-de-2024/'
const SAO_JORGE_2026 =
  'https://ilheuseventos.com.br/noticias/ilheus/sao-jorge-reune-fieis-em-ilheus-com-missa-procissao-e-feijoada/'
const CHOCOLAT = 'https://bahia.chocolatfestival.com/'
const AGOSTO_DE_JORGE =
  'https://www.cacauechocolate.com.br/v1/2026/08/04/festival-transforma-ilheus-em-palco-da-obra-de-jorge-amado/'

const SYMPLA_LATINA = 'https://www.sympla.com.br/evento/festa-latina-na-casa-maya-e-o-mar/3611178'
const SYMPLA_SUNSET = 'https://www.sympla.com.br/evento/sunset-fest-segunda-edicao/3604092'
const SYMPLA_BREGA = 'https://www.sympla.com.br/evento/noite-do-brega-boca-do-mar/3607937'
const RACES_PONTE = 'https://www.races.com.br/corrida-da-ponte-ilheus-ba-2026'
const RUNNING_LIFE_PONTE = 'https://running.life/pt/event/corrida-da-ponte-ilheusba'
const A_TARDE_FLI =
  'https://atarde.com.br/cultura/fli---festa-literaria-de-ilheus-transforma-a-princesa-do-sul-da-bahia-em-centro-de-discussoes-culturais-1294760'

// hazard: dates come from public pages the team has not verified; 'expected' and 'open' ones are not announced dates
export const EVENTS: readonly CityEvent[] = [
  {
    id: 'festa-latina-casa-maya',
    category: 'musica',
    name: 'Festa Latina',
    summary: {
      pt: 'Festa latina com reggae na Casa Maya e o Mar.',
      en: 'Latin party with reggae at Casa Maya e o Mar.',
      es: 'Fiesta latina con reggae en Casa Maya e o Mar.',
    },
    start: '2026-11-07',
    dateStatus: 'confirmed',
    venue: 'Casa Maya e o Mar',
    address: 'CXX5+P7, km 24, Mansões de Luzimares, Serra Grande, BA',
    organizer: 'Casa Maya e o Mar',
    admission: 'paid',
    details: {
      pt: 'Festa latina com reggae. A programação começa às 19h com Amora e a Nave Roots, banda de reggae com tributo a Bob Marley. Às 20h30 tem aula de dança de salsa com Erika Marcela, da Colômbia. Às 22h estreia a Orquestra Latina de Serra Grande, com nove músicos, tocando salsa caribenha. À meia-noite entra o set latino de Polarny e a pista de dança.\n\nO espaço terá petiscaria mexicana, bar tropical e cerveja artesanal. A página de venda mostra o evento das 18h às 2h. O endereço informado é o km 24 da estrada, em Mansões de Luzimares (Luzimares, km 24,5).',
      en: "Latin party with reggae. The schedule starts at 7 pm with Amora e a Nave Roots, a reggae band paying tribute to Bob Marley. At 8:30 pm there is a salsa dance class with Erika Marcela, from Colombia. At 10 pm the Orquestra Latina de Serra Grande, with nine musicians, makes its debut playing Caribbean salsa. At midnight comes Polarny's Latin set and the dance floor.\n\nThe venue will have a Mexican snack bar, a tropical bar and craft beer. The sales page shows the event from 6 pm to 2 am. The address given is km 24 of the road, in Mansões de Luzimares (Luzimares, km 24.5).",
      es: 'Fiesta latina con reggae. La programación empieza a las 19 h con Amora e a Nave Roots, banda de reggae con tributo a Bob Marley. A las 20:30 hay clase de baile de salsa con Erika Marcela, de Colombia. A las 22 h debuta la Orquesta Latina de Serra Grande, con nueve músicos, tocando salsa caribeña. A medianoche entra el set latino de Polarny y la pista de baile.\n\nEl espacio tendrá picoteo mexicano, bar tropical y cerveza artesanal. La página de venta muestra el evento de 18 h a 2 h. La dirección indicada es el km 24 de la carretera, en Mansões de Luzimares (Luzimares, km 24,5).',
    },
    tickets: {
      online: { url: SYMPLA_LATINA, platform: 'Sympla' },
    },
    poster: {
      src: 'https://images.sympla.com.br/6ac6b188d55d3.jpg',
      credit: 'Casa Maya e o Mar',
      page: SYMPLA_LATINA,
    },
    sources: [VIBE, SYMPLA_LATINA],
  },
  {
    id: 'festa-literaria-de-ilheus-2026',
    category: 'cultura',
    name: '9ª Festa Literária de Ilhéus (FLI)',
    summary: {
      pt: 'Quatro dias de livros, arte e cultura nas ruas e praças do centro histórico, com entrada gratuita. Entre os convidados está Itamar Vieira Júnior, autor de Torto Arado.',
      en: 'Four days of books, art and culture in the streets and squares of the historic centre, free of charge. Guests include Itamar Vieira Júnior, author of Torto Arado.',
      es: 'Cuatro días de libros, arte y cultura en las calles y plazas del centro histórico, con entrada gratuita. Entre los invitados está Itamar Vieira Júnior, autor de Torto Arado.',
    },
    details: {
      pt: 'O tema desta edição é "Como será o amanhã? Responda quem puder". As atividades ficam entre a Praça Dom Eduardo e a região da Catedral de São Sebastião, e os bate-papos não exigem inscrição.\n\nTem encontros com escritores, rodas de conversa, lançamentos de livros, oficinas, contação de histórias, atividades para crianças, feira de livros, feira de artesanato, apresentações artísticas e música. Os bate-papos terão tradução em Libras. Além de Itamar Vieira Júnior, a poeta e escritora Mariana Salomão Carrara está entre as convidadas. A programação completa, com horários e locais, ainda será divulgada.',
      en: 'This edition\'s theme is "How will tomorrow be? Answer if you can". Activities are spread between Praça Dom Eduardo and the area around the São Sebastião Cathedral, and the talks need no sign-up.\n\nThere are meetings with writers, conversation circles, book launches, workshops, storytelling, activities for children, a book fair, a crafts fair, performances and music. The talks will have Libras interpretation. Besides Itamar Vieira Júnior, the poet and writer Mariana Salomão Carrara is among the guests. The full schedule, with times and places, is still to be announced.',
      es: 'El tema de esta edición es "¿Cómo será el mañana? Responda quien pueda". Las actividades se reparten entre la Praça Dom Eduardo y la zona de la Catedral de São Sebastião, y las charlas no piden inscripción.\n\nHay encuentros con escritores, ruedas de conversación, lanzamientos de libros, talleres, cuentacuentos, actividades para niños, feria de libros, feria de artesanía, presentaciones artísticas y música. Las charlas tendrán interpretación en Libras. Además de Itamar Vieira Júnior, la poeta y escritora Mariana Salomão Carrara está entre las invitadas. La programación completa, con horarios y lugares, aún se anunciará.',
    },
    start: '2026-11-11',
    end: '2026-11-14',
    dateStatus: 'confirmed',
    venue: 'Centro histórico: Praça Dom Eduardo e região da Catedral',
    placeId: 'catedral-de-sao-sebastiao',
    admission: 'free',
    instagram: 'https://www.instagram.com/fli_oficial/',
    sources: [FLI, A_TARDE_FLI],
  },
  {
    id: 'sunset-fest-2026',
    category: 'musica',
    name: 'Sunset Fest (2ª Edição)',
    summary: {
      pt: 'Segunda edição do Sunset Fest no South Beach Club, com DJ Pellegrini, DJ Izza e Via de Acesso.',
      en: 'Second edition of Sunset Fest at South Beach Club, with DJ Pellegrini, DJ Izza and Via de Acesso.',
      es: 'Segunda edición del Sunset Fest en South Beach Club, con DJ Pellegrini, DJ Izza y Via de Acesso.',
    },
    details: {
      pt: 'O lema da festa é "O sol se põe, a festa começa". Estão confirmados DJ Pellegrini, DJ Izza e Via de Acesso, e a organização diz que mais atrações serão anunciadas.\n\nA descrição do ingresso indica o início às 16h30, mas a página de venda mostra outras datas e horários no cabeçalho. Confirme o horário com a organização antes de ir.',
      en: 'The party\'s motto is "The sun sets, the party starts". DJ Pellegrini, DJ Izza and Via de Acesso are confirmed, and the organisers say more acts will be announced.\n\nThe ticket description gives a 4:30 pm start, but the sales page shows other dates and times in its header. Confirm the time with the organisers before you go.',
      es: 'El lema de la fiesta es "El sol se pone, la fiesta empieza". Están confirmados DJ Pellegrini, DJ Izza y Via de Acesso, y la organización dice que se anunciarán más atracciones.\n\nLa descripción de la entrada indica el inicio a las 16:30, pero la página de venta muestra otras fechas y horarios en el encabezado. Confirma el horario con la organización antes de ir.',
    },
    start: '2026-11-28',
    dateStatus: 'confirmed',
    venue: 'Cabana South Beach Club',
    address: 'Avenida Tancredo Neves, Ilhéus, BA',
    organizer: 'Sociedade Sunset Fest',
    admission: 'paid',
    tickets: {
      online: { url: SYMPLA_SUNSET, platform: 'Sympla' },
    },
    poster: {
      src: 'https://images.sympla.com.br/6abfcdb2e2aee.jpg',
      credit: 'Sociedade Sunset Fest',
      page: SYMPLA_SUNSET,
    },
    sources: [VIBE, SYMPLA_SUNSET],
  },
  {
    id: 'noite-do-brega-boca-do-mar',
    category: 'musica',
    name: 'Noite do Brega',
    summary: {
      pt: 'Noite do brega no Boca do Mar.',
      en: 'Brega night at Boca do Mar.',
      es: 'Noche de brega en Boca do Mar.',
    },
    start: '2026-11-28',
    dateStatus: 'confirmed',
    venue: 'Boca do Mar',
    address: 'Av. Lomanto Júnior, 387, Ilhéus, BA',
    organizer: 'Noite do brega',
    admission: 'paid',
    details: {
      pt: 'Noite de brega que também serve de gravação de um audiovisual de Benner Show. Também se apresentam Júlio Nascimento e Nildo Santos.\n\nA página de venda mostra a festa das 19h às 5h30 do dia seguinte, enquanto o Vibe Index indica 22h. Confirme o horário com a organização.',
      en: 'A brega night that also serves as the recording of an audiovisual project by Benner Show. Júlio Nascimento and Nildo Santos also perform.\n\nThe sales page shows the party from 7 pm to 5:30 am the next day, while Vibe Index says 10 pm. Confirm the time with the organisers.',
      es: 'Noche de brega que sirve también de grabación de un audiovisual de Benner Show. También se presentan Júlio Nascimento y Nildo Santos.\n\nLa página de venta muestra la fiesta de 19 h a 5:30 h del día siguiente, mientras que Vibe Index indica las 22 h. Confirma el horario con la organización.',
    },
    tickets: {
      online: { url: SYMPLA_BREGA, platform: 'Sympla' },
    },
    poster: {
      src: 'https://images.sympla.com.br/6ac521d7a94b6.png',
      credit: 'Noite do brega',
      page: SYMPLA_BREGA,
    },
    sources: [VIBE, SYMPLA_BREGA],
  },
  {
    id: 'copa-jorge-amado-bandas-fanfarras',
    category: 'cultura',
    name: 'I Copa Jorge Amado de Bandas e Fanfarras',
    summary: {
      pt: 'Competição de bandas e fanfarras na Avenida Soares Lopes, na primeira edição da Copa Jorge Amado. O dia marca também a 3ª final da Copa Sul-Baiana.',
      en: 'A bands and fanfares competition on Avenida Soares Lopes, in the first Jorge Amado Cup. The day also marks the 3rd final of the Copa Sul-Baiana.',
      es: 'Competencia de bandas y fanfarrias en la Avenida Soares Lopes, en la primera Copa Jorge Amado. El día marca también la 3.ª final de la Copa Sul-Baiana.',
    },
    start: '2026-11-29',
    dateStatus: 'confirmed',
    venue: 'Avenida Soares Lopes',
    sources: [COPA],
  },
  {
    id: 'natal-encantado-2026',
    category: 'festas',
    name: 'Natal Encantado',
    summary: {
      pt: 'O calendário municipal prevê o Natal Encantado em dezembro. As datas e a programação ainda não foram divulgadas nas fontes que encontramos.',
      en: 'The city calendar lists Natal Encantado in December. Dates and schedule have not been announced in the sources we found.',
      es: 'El calendario municipal prevé el Natal Encantado en diciembre. Las fechas y la programación aún no se anunciaron en las fuentes que encontramos.',
    },
    start: '2026-12-01',
    end: '2026-12-31',
    dateStatus: 'open',
    sources: [CALENDARIO_2026],
  },
  {
    id: 'corrida-da-ponte-2026',
    category: 'esportes',
    name: 'Corrida da Ponte',
    summary: {
      pt: 'Corrida de rua de 6 km e 12 km na Avenida Soares Lopes, com largada às 6h30 no domingo, 13 de dezembro.',
      en: 'Road race of 6 km and 12 km on Avenida Soares Lopes, starting at 6:30 am on Sunday, 13 December.',
      es: 'Carrera de calle de 6 km y 12 km en la Avenida Soares Lopes, con salida a las 6:30 el domingo 13 de diciembre.',
    },
    details: {
      pt: 'A largada é às 6h30 para atletas PCD e às 6h35 para os demais, e os horários podem mudar de 5 a 15 minutos. O percurso de 12 km são duas voltas no de 6 km. Largada e chegada ficam na Avenida Soares Lopes, perto do estacionamento do Centro de Convenções.\n\nA inscrição é online até 9 de dezembro, ou até acabarem as vagas. A idade mínima é 16 anos para os 6 km e 18 anos para os 12 km, contada em 31 de dezembro do ano da prova. Menores de 18 anos só correm os 6 km, com autorização por escrito dos responsáveis. O kit não é entregue no dia da prova.',
      en: 'The start is at 6:30 am for athletes with disabilities and 6:35 am for everyone else, and times may shift by 5 to 15 minutes. The 12 km course is two laps of the 6 km one. Start and finish are on Avenida Soares Lopes, near the Convention Centre car park.\n\nRegistration is online until 9 December, or until places run out. The minimum age is 16 for the 6 km and 18 for the 12 km, counted on 31 December of the race year. Under-18s may only run the 6 km, with written permission from a parent or guardian. Kits are not handed out on race day.',
      es: 'La salida es a las 6:30 para atletas con discapacidad y a las 6:35 para los demás, y los horarios pueden variar de 5 a 15 minutos. El recorrido de 12 km son dos vueltas al de 6 km. Salida y llegada están en la Avenida Soares Lopes, cerca del estacionamiento del Centro de Convenciones.\n\nLa inscripción es en línea hasta el 9 de diciembre, o hasta agotar los cupos. La edad mínima es 16 años para los 6 km y 18 para los 12 km, contada el 31 de diciembre del año de la carrera. Los menores de 18 solo corren los 6 km, con autorización escrita de los responsables. El kit no se entrega el día de la carrera.',
    },
    start: '2026-12-13',
    dateStatus: 'confirmed',
    venue: 'Avenida Soares Lopes, perto do Centro de Convenções',
    address: 'Avenida Soares Lopes, Ilhéus, BA',
    organizer: 'IDE Esportes, com apoio da Prefeitura de Ilhéus',
    admission: 'registration',
    instagram: 'https://www.instagram.com/corridadaponteilheus/',
    tickets: {
      online: { url: RACES_PONTE, platform: 'Races' },
      prices: [
        {
          label: {
            pt: 'Kit Premium (6 km ou 12 km)',
            en: 'Premium kit (6 km or 12 km)',
            es: 'Kit Premium (6 km o 12 km)',
          },
          price: 'R$ 145,00',
        },
        {
          label: {
            pt: 'Kit Participação (6 km ou 12 km)',
            en: 'Participation kit (6 km or 12 km)',
            es: 'Kit Participación (6 km o 12 km)',
          },
          price: 'R$ 120,00',
        },
        {
          label: {
            pt: 'Atleta PCD (6 km ou 12 km)',
            en: 'Athlete with a disability (6 km or 12 km)',
            es: 'Atleta con discapacidad (6 km o 12 km)',
          },
          price: 'R$ 72,00',
        },
      ],
      physical: {
        pt: 'Retirada do kit de 10 a 12 de dezembro, das 10h às 18h, em locais ainda a definir. Não há retirada no dia da prova.',
        en: 'Kit pickup from 10 to 12 December, 10 am to 6 pm, at places still to be set. There is no pickup on race day.',
        es: 'Retiro del kit del 10 al 12 de diciembre, de 10 h a 18 h, en lugares aún por definir. No hay retiro el día de la carrera.',
      },
    },
    sources: [RACES_PONTE, RUNNING_LIFE_PONTE, CALENDARIO_2026],
  },
  {
    id: 'circuito-do-cacau-surf-etapa-final',
    category: 'esportes',
    name: 'Circuito do Cacau Surf: Etapa Final',
    summary: {
      pt: 'A temporada do Circuito do Cacau Surf termina na Praia do Norte, em Ilhéus. A primeira etapa foi em Olivença, em agosto.',
      en: 'The Circuito do Cacau Surf season ends at Praia do Norte, in Ilhéus. The first stage was in Olivença, in August.',
      es: 'La temporada del Circuito do Cacau Surf termina en la Praia do Norte, en Ilhéus. La primera etapa fue en Olivença, en agosto.',
    },
    start: '2026-12-20',
    end: '2026-12-21',
    dateStatus: 'confirmed',
    venue: 'Praia do Norte',
    sources: [SURF],
  },
  {
    id: 'reveillon-de-ilheus-2027',
    category: 'festas',
    name: 'Réveillon de Ilhéus',
    summary: {
      pt: 'O calendário municipal prevê o Réveillon 2027. Em 2025, a Virada Ilhéus teve três dias de shows gratuitos na Avenida Soares Lopes, de 29 a 31 de dezembro. As atrações deste ano ainda não foram confirmadas nas fontes.',
      en: "The city calendar lists the 2027 New Year's Eve. In 2025, Virada Ilhéus had three days of free concerts on Avenida Soares Lopes, from 29 to 31 December. This year's line-up is not confirmed in the sources yet.",
      es: 'El calendario municipal prevé el Réveillon 2027. En 2025, la Virada Ilhéus tuvo tres días de shows gratuitos en la Avenida Soares Lopes, del 29 al 31 de diciembre. Las atracciones de este año aún no están confirmadas en las fuentes.',
    },
    start: '2026-12-29',
    end: '2026-12-31',
    dateStatus: 'expected',
    venue: 'Avenida Soares Lopes',
    sources: [CALENDARIO_2026, VIRADA_2025],
  },
  {
    id: 'puxada-do-mastro-olivenca-2027',
    category: 'festas',
    name: 'Puxada do Mastro de São Sebastião',
    summary: {
      pt: 'Tradição de Olivença: o mastro é levado ao som de zabumbeiros no segundo domingo de janeiro e erguido no dia 20, em frente à Igreja Nossa Senhora da Escada.',
      en: 'An Olivença tradition: the mast is carried to the sound of drummers on the second Sunday of January and raised on the 20th, in front of Nossa Senhora da Escada church.',
      es: 'Tradición de Olivença: el mástil se lleva al son de los zabumbeiros el segundo domingo de enero y se levanta el día 20, frente a la Iglesia Nossa Senhora da Escada.',
    },
    details: {
      pt: 'A festa abre o calendário de festas de Ilhéus, em homenagem a São Sebastião. Em 2026, a Puxada do Mastro foi no domingo, 11 de janeiro.\n\nAs datas de 2027 seguem o costume (segundo domingo de janeiro, dia 10, e dia 20) e ainda não foram anunciadas pela organização.',
      en: "The festival opens Ilhéus' festival calendar, in honour of Saint Sebastian. In 2026, the Puxada do Mastro was on Sunday, 11 January.\n\nThe 2027 dates follow the custom (second Sunday of January, the 10th, and the 20th) and have not been announced by the organisers yet.",
      es: 'La fiesta abre el calendario de fiestas de Ilhéus, en homenaje a San Sebastián. En 2026, la Puxada do Mastro fue el domingo 11 de enero.\n\nLas fechas de 2027 siguen la costumbre (segundo domingo de enero, el día 10, y el día 20) y los organizadores aún no las anunciaron.',
    },
    start: '2027-01-10',
    end: '2027-01-20',
    dateStatus: 'expected',
    venue: 'Olivença',
    sources: [WIKI_ILHEUS, MASTRO_WIKI, MASTRO_PREFEITURA],
  },
  {
    id: 'carnaval-2027',
    category: 'festas',
    name: 'Carnaval 2027',
    summary: {
      pt: 'O Carnaval de 2027 vai de sábado, 6, a terça-feira, 9 de fevereiro, pelas datas nacionais. A programação de Ilhéus ainda não foi divulgada nas fontes que encontramos.',
      en: 'Carnival 2027 runs from Saturday, 6, to Tuesday, 9 February, by the national dates. The Ilhéus programme has not been announced in the sources we found.',
      es: 'El Carnaval de 2027 va del sábado 6 al martes 9 de febrero, según las fechas nacionales. La programación de Ilhéus aún no se anunció en las fuentes que encontramos.',
    },
    start: '2027-02-06',
    end: '2027-02-09',
    dateStatus: 'expected',
    sources: [CARNAVAL],
  },
  {
    id: 'festa-de-sao-jorge-2027',
    category: 'festas',
    name: 'Festa de São Jorge dos Ilhéus',
    summary: {
      pt: 'Festa do padroeiro da cidade, com missa e procissão. O dia 23 de abril é feriado municipal.',
      en: "Festival of the city's patron saint, with mass and a procession. 23 April is a municipal holiday.",
      es: 'Fiesta del patrono de la ciudad, con misa y procesión. El 23 de abril es feriado municipal.',
    },
    details: {
      pt: 'São Jorge é o padroeiro de Ilhéus e da diocese. A festa costuma ter novena, missa e procissão, e em edições recentes foi de 20 a 23 de abril.\n\nAs datas de 2027 seguem esse costume e ainda não foram anunciadas.',
      en: 'Saint George is the patron saint of Ilhéus and of the diocese. The festival usually has a novena, mass and a procession, and in recent editions it ran from 20 to 23 April.\n\nThe 2027 dates follow that custom and have not been announced yet.',
      es: 'San Jorge es el patrono de Ilhéus y de la diócesis. La fiesta suele tener novena, misa y procesión, y en ediciones recientes fue del 20 al 23 de abril.\n\nLas fechas de 2027 siguen esa costumbre y aún no se anunciaron.',
    },
    start: '2027-04-20',
    end: '2027-04-23',
    dateStatus: 'expected',
    placeId: 'igreja-de-sao-jorge',
    sources: [SAO_JORGE, SAO_JORGE_2026],
  },
  {
    id: 'chocolat-bahia-2026',
    category: 'gastronomia',
    name: 'Chocolat Bahia (17ª Edição)',
    summary: {
      pt: 'Considerado o maior festival de cacau e chocolate da América Latina, com palestras, workshops e degustações e inscrição gratuita.',
      en: 'Considered the largest cacao and chocolate festival in Latin America, with talks, workshops and tastings, free to join.',
      es: 'Considerado el mayor festival de cacao y chocolate de América Latina, con charlas, talleres y degustaciones, con inscripción gratuita.',
    },
    start: '2026-07-23',
    end: '2026-07-26',
    dateStatus: 'confirmed',
    venue: 'Centro de Convenções de Ilhéus',
    sources: [CHOCOLAT],
  },
  {
    id: 'agosto-de-jorge-2026',
    category: 'cultura',
    name: 'Festival Agosto de Jorge',
    summary: {
      pt: 'Festival que celebra o legado de Jorge Amado com literatura, gastronomia, música, dança, audiovisual, esporte e patrimônio histórico.',
      en: 'A festival celebrating the legacy of Jorge Amado with literature, food, music, dance, film, sport and historic heritage.',
      es: 'Festival que celebra el legado de Jorge Amado con literatura, gastronomía, música, danza, audiovisual, deporte y patrimonio histórico.',
    },
    start: '2026-08-06',
    end: '2026-08-30',
    dateStatus: 'confirmed',
    sources: [AGOSTO_DE_JORGE],
  },
]

export const findEvent = (id: string): CityEvent | undefined =>
  EVENTS.find((event) => event.id === id)
