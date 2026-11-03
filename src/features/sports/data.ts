import type { SportProvider } from './providers'

const WELLHUB_BEACH_TENNIS = 'https://wellhub.com/pt-br/search/partners/beach-tennis-team-centro/'
const WELLHUB_SURFS_UP = 'https://wellhub.com/pt-br/search/partners/surf-s-up-club-pontal/'
const WELLHUB_SUP = 'https://wellhub.com/pt-br/search/partners/sup-ilheus-sao-sebastiao/'
const WELLHUB_VIP = 'https://wellhub.com/pt-br/search/partners/academia-vip-ilheus-malhado-ilheus/'
const WELLHUB_SELFIT = 'https://wellhub.com/pt-br/search/partners/selfit-ilheus-sao-francisco/'
const WELLHUB_STILUS =
  'https://wellhub.com/pt-br/search/partners/academia-stilus-center-teotonio-vilela-ilheus'
const WELLHUB_CORPORE = 'https://wellhub.com/pt-br/search/partners/academia-corpore-centro-ilheus'
const WELLHUB_PONTAL_FIT = 'https://wellhub.com/pt-br/search/partners/pontal-fit-pontal/'
const BOLA_NA_REDE = 'https://portalbolanarede.com/futvolei-de-ilheus-sofre-ataque-criminoso'
const ILHEUS_NET =
  'https://www.ilheus.net/2025/03/ilheus-fortalece-o-esporte-e-apoia-a-8a-copa-do-ctm10-de-futevolei.html'
const CANA_BRAVA =
  'https://www.bahianoticias.com.br/bnhall/noticia/1528-em-ilheus-cana-brava-resort-reune-atividades-com-foco-em-esportes'

// why: the Wellhub pages list what each gym offers but not a day pass, so every gym carries the same warning
const GYM_CAVEAT = {
  pt: 'A fonte não diz se há diária para visitantes. Pergunte no local.',
  en: 'The source does not say whether there is a day pass for visitors. Ask on site.',
  es: 'La fuente no dice si hay pase diario para visitantes. Pregunta en el lugar.',
}

export const SPORT_PROVIDERS: readonly SportProvider[] = [
  {
    id: 'beach-tennis-team',
    name: 'Beach Tennis Team',
    sports: ['beach-tennis'],
    offer: {
      pt: 'Aulas de beach tennis, do iniciante ao avançado',
      en: 'Beach tennis lessons, beginner to advanced',
      es: 'Clases de beach tennis, de principiante a avanzado',
    },
    area: 'Centro',
    address: 'Av. Soares Lopes, Centro',
    sources: [WELLHUB_BEACH_TENNIS],
  },
  {
    id: 'surfs-up-club-pontal',
    name: 'Surf’s Up Club Pontal',
    sports: ['surf'],
    offer: {
      pt: 'Lista o surf como modalidade',
      en: 'Lists surf as an activity',
      es: 'Lista el surf como modalidad',
    },
    area: 'Pontal',
    address: 'R. Castro Alves, 156, Pontal',
    website: 'https://surfsupclub.com',
    caveat: {
      pt: 'A fonte não diz se há aula ou aluguel de prancha. Pergunte ao local.',
      en: 'The source does not say whether there are lessons or board rental. Ask the venue.',
      es: 'La fuente no dice si hay clases o alquiler de tabla. Pregunta en el lugar.',
    },
    sources: [WELLHUB_SURFS_UP],
  },
  {
    id: 'sup-ilheus',
    name: 'SUP Ilhéus',
    sports: ['stand-up-paddle'],
    offer: {
      pt: 'Stand up paddle, caiaque e canoagem',
      en: 'Stand up paddle, kayak and canoeing',
      es: 'Stand up paddle, kayak y canotaje',
    },
    area: 'São Sebastião',
    address: 'Av. Dois de Julho, São Sebastião',
    website: 'https://instagram.com/supilheus',
    caveat: {
      pt: 'A fonte pede reserva para participar.',
      en: 'The source asks for a booking to take part.',
      es: 'La fuente pide reserva para participar.',
    },
    sources: [WELLHUB_SUP],
  },
  {
    id: 'ctm10',
    name: 'CTM10',
    sports: ['futevolei'],
    offer: {
      pt: 'Centro de treinamento ligado ao time de futevôlei de Ilhéus; organiza a Copa do CTM10',
      en: 'Training centre tied to the Ilhéus footvolley team; runs the CTM10 Cup',
      es: 'Centro de entrenamiento ligado al equipo de futevôlei de Ilhéus; organiza la Copa del CTM10',
    },
    area: 'Ilhéus',
    caveat: {
      pt: 'As notícias não dizem o endereço nem se há aula aberta a turistas. Procure o centro pelo Instagram.',
      en: 'The news pieces do not give the address or say whether tourists can join a class. Look for the centre on Instagram.',
      es: 'Las noticias no dan la dirección ni dicen si hay clases abiertas a turistas. Busca el centro en Instagram.',
    },
    sources: [BOLA_NA_REDE, ILHEUS_NET],
  },
  {
    id: 'cana-brava-resort',
    name: 'Cana Brava Resort',
    sports: ['surf', 'stand-up-paddle'],
    offer: {
      pt: 'Escola de surf, caiaque e stand up paddle',
      en: 'Surf school, kayak and stand up paddle',
      es: 'Escuela de surf, kayak y stand up paddle',
    },
    area: 'Ilhéus',
    caveat: {
      pt: 'A notícia é antiga e não diz se quem não é hóspede pode usar.',
      en: 'The news piece is old and does not say whether non-guests can use it.',
      es: 'La noticia es antigua y no dice si quien no es huésped puede usarlo.',
    },
    sources: [CANA_BRAVA],
  },
  {
    id: 'academia-vip-ilheus',
    name: 'Academia Vip Ilhéus',
    sports: ['academias'],
    offer: {
      pt: 'Musculação, funcional, dança, jump e step',
      en: 'Weights, functional training, dance, jump and step',
      es: 'Musculación, funcional, baile, jump y step',
    },
    area: 'Malhado',
    address: 'Av. Litorânea Norte, 349, Malhado',
    caveat: GYM_CAVEAT,
    sources: [WELLHUB_VIP],
  },
  {
    id: 'selfit-ilheus',
    name: 'Selfit Ilhéus',
    sports: ['academias'],
    offer: {
      pt: 'Musculação, power bike, speed mix e dança',
      en: 'Weights, power bike, speed mix and dance',
      es: 'Musculación, power bike, speed mix y baile',
    },
    area: 'São Francisco',
    address: 'Av. Tancredo Neves, 900, São Francisco',
    caveat: GYM_CAVEAT,
    sources: [WELLHUB_SELFIT],
  },
  {
    id: 'academia-stilus-center',
    name: 'Academia Stilus Center',
    sports: ['academias'],
    offer: {
      pt: 'Musculação, zumba, circuitos funcionais e muay thai',
      en: 'Weights, zumba, functional circuits and muay thai',
      es: 'Musculación, zumba, circuitos funcionales y muay thai',
    },
    area: 'Barra do Itaípe',
    address: 'Av. Ubaitaba, 765, Barra do Itaípe',
    caveat: GYM_CAVEAT,
    sources: [WELLHUB_STILUS],
  },
  {
    id: 'academia-corpore',
    name: 'Academia Corpore',
    sports: ['academias'],
    offer: {
      pt: 'Musculação, treinamento híbrido, personal dance, danças sociais e combate',
      en: 'Weights, hybrid training, personal dance, social dances and combat sports',
      es: 'Musculación, entrenamiento híbrido, personal dance, bailes sociales y combate',
    },
    area: 'Centro',
    address: 'Av. Dois de Julho, 378, Centro',
    caveat: GYM_CAVEAT,
    sources: [WELLHUB_CORPORE],
  },
  {
    id: 'pontal-fit',
    name: 'Pontal Fit',
    sports: ['academias'],
    offer: {
      pt: 'Musculação e fitness',
      en: 'Weights and fitness',
      es: 'Musculación y fitness',
    },
    area: 'Pontal',
    address: 'Av. Lomanto Júnior, 1180, Pontal',
    caveat: GYM_CAVEAT,
    sources: [WELLHUB_PONTAL_FIT],
  },
]
