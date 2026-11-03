import type { Onboarding } from '../preferences/preferences'

// invariant: these hash shapes are door 1; a printed QR code may point at them, so they do not change
export const EXPLORE_CATEGORIES = [
  'gastronomia',
  'cultura',
  'praias',
  'natureza',
  'esportes',
  'circuitos',
] as const

export type ExploreCategory = (typeof EXPLORE_CATEGORIES)[number]

export type Route =
  | { name: 'welcome' }
  | { name: 'language' }
  | { name: 'consent' }
  | { name: 'home' }
  | { name: 'explore' }
  | { name: 'explore-category'; id: ExploreCategory }
  | { name: 'circuit'; id: string }
  | { name: 'nearby' }
  | { name: 'place'; id: string }
  | { name: 'emergency' }
  | { name: 'emergency-show' }
  | { name: 'everyday' }
  | { name: 'profile' }
  | { name: 'privacy' }
  | { name: 'login' }
  | { name: 'signup' }
  | { name: 'account' }
  | { name: 'plan' }
  | { name: 'events' }
  | { name: 'event'; id: string }
  | { name: 'travel-profile' }
  | { name: 'directions'; id: string }
  | { name: 'sport-spots'; id: string }

export type Tab = 'home' | 'explore' | 'nearby' | 'plan' | 'emergency'

// invariant: these prefixes are door 1 too; one row per route that carries a single id
const ID_ROUTES = [
  { name: 'place', prefix: 'lugar/' },
  { name: 'directions', prefix: 'como-chegar/' },
  { name: 'sport-spots', prefix: 'onde-praticar/' },
  { name: 'circuit', prefix: 'circuito/' },
  { name: 'event', prefix: 'evento/' },
] as const

type IdRouteName = (typeof ID_ROUTES)[number]['name']
type ParamRoute = IdRouteName | 'explore-category'

const SIMPLE: Record<string, Route> = {
  'boas-vindas': { name: 'welcome' },
  idioma: { name: 'language' },
  localizacao: { name: 'consent' },
  inicio: { name: 'home' },
  explorar: { name: 'explore' },
  'perto-de-mim': { name: 'nearby' },
  emergencia: { name: 'emergency' },
  'emergencia/mostrar': { name: 'emergency-show' },
  urgencias: { name: 'everyday' },
  perfil: { name: 'profile' },
  privacidade: { name: 'privacy' },
  entrar: { name: 'login' },
  cadastro: { name: 'signup' },
  conta: { name: 'account' },
  'meu-roteiro': { name: 'plan' },
  eventos: { name: 'events' },
  'perfil-de-viagem': { name: 'travel-profile' },
}

const HASH_OF: Record<Exclude<Route['name'], ParamRoute>, string> = {
  welcome: '#/boas-vindas',
  language: '#/idioma',
  consent: '#/localizacao',
  home: '#/inicio',
  explore: '#/explorar',
  nearby: '#/perto-de-mim',
  emergency: '#/emergencia',
  'emergency-show': '#/emergencia/mostrar',
  everyday: '#/urgencias',
  profile: '#/perfil',
  privacy: '#/privacidade',
  login: '#/entrar',
  signup: '#/cadastro',
  account: '#/conta',
  plan: '#/meu-roteiro',
  events: '#/eventos',
  'travel-profile': '#/perfil-de-viagem',
}

export function toHash(route: Route): string {
  if (route.name === 'explore-category') return `#/explorar/${route.id}`
  const idRoute = ID_ROUTES.find((known) => known.name === route.name)
  if (idRoute && 'id' in route) return `#/${idRoute.prefix}${encodeURIComponent(route.id)}`
  return HASH_OF[route.name as Exclude<Route['name'], ParamRoute>]
}

function decode(value: string): string | null {
  try {
    return decodeURIComponent(value)
  } catch {
    return null
  }
}

export function parseHash(hash: string): Route | null {
  const path = hash.startsWith('#/') ? hash.slice(2) : ''
  for (const { name, prefix } of ID_ROUTES) {
    if (!path.startsWith(prefix)) continue
    const id = decode(path.slice(prefix.length))
    return id && !id.includes('/') ? { name, id } : null
  }
  if (path.startsWith('explorar/')) {
    const id = path.slice('explorar/'.length)
    const category = EXPLORE_CATEGORIES.find((known) => known === id)
    return category ? { name: 'explore-category', id: category } : { name: 'explore' }
  }
  return SIMPLE[path] ?? null
}

const BAR_ROUTES: ReadonlySet<Route['name']> = new Set([
  'home',
  'explore',
  'explore-category',
  'circuit',
  'nearby',
  'place',
  'emergency',
  'emergency-show',
  'everyday',
  'profile',
  'privacy',
  'login',
  'signup',
  'account',
  'plan',
  'events',
  'event',
  'travel-profile',
  'directions',
  'sport-spots',
])

// why: before onboarding ends every tab bounces to Idioma, so the sign-in screens reached from Boas-vindas carry no bar
const BAR_AFTER_ONBOARDING: ReadonlySet<Route['name']> = new Set(['language', 'login', 'signup'])

export function showsBar(route: Route, onboarding: Onboarding): boolean {
  if (BAR_AFTER_ONBOARDING.has(route.name)) return onboarding === 'done'
  return BAR_ROUTES.has(route.name)
}

export function tabFor(route: Route): Tab | null {
  if (route.name === 'home') return 'home'
  if (
    route.name === 'explore' ||
    route.name === 'explore-category' ||
    route.name === 'circuit' ||
    route.name === 'events' ||
    route.name === 'event'
  ) {
    return 'explore'
  }
  if (
    route.name === 'nearby' ||
    route.name === 'place' ||
    route.name === 'directions' ||
    route.name === 'sport-spots'
  ) {
    return 'nearby'
  }
  if (route.name === 'plan' || route.name === 'travel-profile') return 'plan'
  if (route.name === 'emergency' || route.name === 'emergency-show' || route.name === 'everyday') {
    return 'emergency'
  }
  return null
}

// why: Emergência links to Urgências, so it must open before onboarding ends or the link bounces to Idioma
const OPEN_WHILE_PENDING: ReadonlySet<Route['name']> = new Set([
  'welcome',
  'login',
  'signup',
  'language',
  'consent',
  'emergency',
  'emergency-show',
  'everyday',
])

// invariant: only an entry with no known hash falls to Boas-vindas; a deep link (a printed QR code) never waits for a sign-in
export function resolveRoute(
  route: Route | null,
  onboarding: Onboarding,
  knowsPlace: (id: string) => boolean,
  knowsCircuit: (id: string) => boolean = () => false,
  signedIn = true,
  knowsEvent: (id: string) => boolean = () => false,
): Route {
  const afterWelcome: Route = onboarding === 'done' ? { name: 'home' } : { name: 'language' }
  if (route?.name === 'welcome') return signedIn ? afterWelcome : route
  const first: Route = signedIn ? afterWelcome : { name: 'welcome' }
  if (route === null) return first
  if (onboarding === 'pending' && !OPEN_WHILE_PENDING.has(route.name)) return afterWelcome
  if (
    (route.name === 'place' || route.name === 'directions' || route.name === 'sport-spots') &&
    !knowsPlace(route.id)
  ) {
    return { name: 'nearby' }
  }
  if (route.name === 'circuit' && !knowsCircuit(route.id)) return { name: 'explore' }
  if (route.name === 'event' && !knowsEvent(route.id)) return { name: 'events' }
  return route
}
