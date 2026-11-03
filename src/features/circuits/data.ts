import type { Circuit } from './circuits'

export const CIRCUITS: readonly Circuit[] = [
  {
    id: 'circuito-cultural-do-centro',
    title: {
      pt: 'Circuito Cultural do Centro',
      en: 'Historic centre cultural circuit',
      es: 'Circuito cultural del centro',
    },
    summary: {
      pt: 'Três lugares do centro histórico, na ordem do passeio',
      en: 'Three places in the historic centre, in walking order',
      es: 'Tres lugares del centro histórico, en el orden del paseo',
    },
    stops: ['casa-de-jorge-amado', 'catedral-de-sao-sebastiao', 'bar-vesuvio'],
    example: true,
  },
  {
    id: 'circuito-historico',
    title: {
      pt: 'Circuito Histórico',
      en: 'Historic circuit',
      es: 'Circuito Histórico',
    },
    summary: {
      pt: 'Igreja, teatro, bar e catedral que contam a história de Ilhéus',
      en: 'A church, a theatre, a bar and a cathedral that tell the story of Ilhéus',
      es: 'Iglesia, teatro, bar y catedral que cuentan la historia de Ilhéus',
    },
    stops: ['igreja-de-sao-jorge', 'bar-vesuvio', 'teatro-municipal', 'catedral-de-sao-sebastiao'],
    example: true,
  },
  {
    id: 'circuito-religioso',
    title: {
      pt: 'Circuito Religioso',
      en: 'Religious circuit',
      es: 'Circuito Religioso',
    },
    summary: {
      pt: 'Da matriz mais antiga à igreja do aldeamento jesuíta de Olivença',
      en: 'From the oldest mother church to the church of the Jesuit settlement in Olivença',
      es: 'De la matriz más antigua a la iglesia del poblado jesuita de Olivença',
    },
    stops: [
      'igreja-de-sao-jorge',
      'catedral-de-sao-sebastiao',
      'igreja-de-nossa-senhora-da-escada',
    ],
    example: true,
  },
  {
    id: 'circuito-gastronomico',
    title: {
      pt: 'Circuito Gastronômico',
      en: 'Food circuit',
      es: 'Circuito gastronómico',
    },
    summary: {
      pt: 'Bares históricos, acarajé de rua e barracas de praia',
      en: 'Historic bars, street acarajé and beach stalls',
      es: 'Bares históricos, acarajé callejero y puestos de playa',
    },
    stops: ['bar-vesuvio', 'bataclan', 'acaraje-da-zelia', 'barracas-dos-milionarios'],
    example: true,
  },
  {
    id: 'circuito-jorge-amado',
    title: {
      pt: 'Circuito Jorge Amado',
      en: 'Jorge Amado circuit',
      es: 'Circuito Jorge Amado',
    },
    summary: {
      pt: 'A casa do escritor e os lugares que aparecem nos livros dele',
      en: 'The writer’s house and the places that appear in his books',
      es: 'La casa del escritor y los lugares que aparecen en sus libros',
    },
    stops: ['casa-de-jorge-amado', 'bar-vesuvio', 'bataclan', 'teatro-municipal'],
    example: true,
  },
  {
    id: 'circuito-agua-doce',
    title: {
      pt: 'Circuito Água Doce',
      en: 'Freshwater circuit',
      es: 'Circuito agua dulce',
    },
    summary: {
      pt: 'Rio Almada e Lagoa Encantada, de barco',
      en: 'Almada River and Lagoa Encantada, by boat',
      es: 'Río Almada y Laguna Encantada, en barco',
    },
    stops: ['rio-almada', 'lagoa-encantada'],
    example: true,
  },
  {
    id: 'circuito-agua-salgada',
    title: {
      pt: 'Circuito Água Salgada',
      en: 'Saltwater circuit',
      es: 'Circuito agua salada',
    },
    summary: {
      pt: 'Praias para banho e para o surf',
      en: 'Beaches for swimming and for surfing',
      es: 'Playas para bañarse y para el surf',
    },
    stops: ['praia-dos-milionarios', 'praia-de-cururupe', 'surf'],
    example: true,
  },
  {
    id: 'circuito-cacau-e-chocolate',
    title: {
      pt: 'Circuito Cacau e Chocolate',
      en: 'Cacao and chocolate circuit',
      es: 'Circuito cacao y chocolate',
    },
    summary: {
      pt: 'Da Estrada do Chocolate às fábricas que provam o cacau da região',
      en: 'From the Chocolate Road to the factories that taste the region’s cacao',
      es: 'Del Camino del Chocolate a las fábricas que prueban el cacao de la región',
    },
    stops: ['estrada-do-chocolate', 'chocolate-caseiro-ilheus', 'bahia-cacau', 'fazenda-riachuelo'],
    example: true,
  },
  {
    id: 'circuito-fazenda-de-cacau',
    title: {
      pt: 'Circuito Fazenda de Cacau',
      en: 'Cacao farm circuit',
      es: 'Circuito finca de cacao',
    },
    summary: {
      pt: 'Três fazendas para ver o cacau de perto',
      en: 'Three farms to see cacao up close',
      es: 'Tres fincas para ver el cacao de cerca',
    },
    stops: ['fazenda-yrere', 'fazenda-provisao', 'fazenda-riachuelo'],
    example: true,
  },
]
