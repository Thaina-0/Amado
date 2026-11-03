import { describe, expect, it } from 'vitest'
import { parseHash, resolveRoute, showsBar, tabFor, toHash, type Route } from '../routes'

const knows = (id: string) => id === 'bar-vesuvio'
const knowsCircuit = (id: string) => id === 'circuito-cultural-do-centro'

const ALL: [string, Route][] = [
  ['#/boas-vindas', { name: 'welcome' }],
  ['#/idioma', { name: 'language' }],
  ['#/localizacao', { name: 'consent' }],
  ['#/inicio', { name: 'home' }],
  ['#/explorar', { name: 'explore' }],
  ['#/explorar/cultura', { name: 'explore-category', id: 'cultura' }],
  [
    '#/circuito/circuito-cultural-do-centro',
    { name: 'circuit', id: 'circuito-cultural-do-centro' },
  ],
  ['#/perto-de-mim', { name: 'nearby' }],
  ['#/lugar/bar-vesuvio', { name: 'place', id: 'bar-vesuvio' }],
  ['#/emergencia', { name: 'emergency' }],
  ['#/emergencia/mostrar', { name: 'emergency-show' }],
  ['#/urgencias', { name: 'everyday' }],
  ['#/perfil', { name: 'profile' }],
  ['#/privacidade', { name: 'privacy' }],
  ['#/entrar', { name: 'login' }],
  ['#/conta', { name: 'account' }],
  ['#/meu-roteiro', { name: 'plan' }],
  ['#/eventos', { name: 'events' }],
  ['#/evento/carnaval-2027', { name: 'event', id: 'carnaval-2027' }],
  ['#/perfil-de-viagem', { name: 'travel-profile' }],
  ['#/cadastro', { name: 'signup' }],
  ['#/como-chegar/bar-vesuvio', { name: 'directions', id: 'bar-vesuvio' }],
  ['#/onde-praticar/surf', { name: 'sport-spots', id: 'surf' }],
]

describe('routes', () => {
  it.each(ALL)('maps %s to its route and back', (hash, route) => {
    expect(parseHash(hash)).toEqual(route)
    expect(toHash(route)).toBe(hash)
  })

  it.each(['', '#', '#/', '#/xyz', '#/lugar/', '#/lugar', '#/inicio/extra'])(
    'does not know %j',
    (hash) => {
      expect(parseHash(hash)).toBeNull()
    },
  )

  describe('falls back', () => {
    it('to Início for an unknown hash when onboarding is done', () => {
      expect(resolveRoute(parseHash('#/xyz'), 'done', knows)).toEqual({ name: 'home' })
      expect(resolveRoute(parseHash('#/lugar/'), 'done', knows)).toEqual({ name: 'home' })
      expect(resolveRoute(parseHash(''), 'done', knows)).toEqual({ name: 'home' })
    })

    it('to Idioma for an unknown hash when onboarding is pending', () => {
      expect(resolveRoute(parseHash('#/xyz'), 'pending', knows)).toEqual({ name: 'language' })
    })

    it('to Boas-vindas for an unknown hash when nobody is signed in', () => {
      for (const onboarding of ['done', 'pending'] as const) {
        expect(resolveRoute(parseHash(''), onboarding, knows, undefined, false)).toEqual({
          name: 'welcome',
        })
        expect(resolveRoute(parseHash('#/xyz'), onboarding, knows, undefined, false)).toEqual({
          name: 'welcome',
        })
      }
    })

    it('to Perto de mim for an unknown place id', () => {
      expect(resolveRoute(parseHash('#/lugar/unknown-id'), 'done', knows)).toEqual({
        name: 'nearby',
      })
    })

    it('to Perto de mim for directions to an unknown place', () => {
      expect(resolveRoute(parseHash('#/como-chegar/unknown-id'), 'done', knows)).toEqual({
        name: 'nearby',
      })
      expect(resolveRoute(parseHash('#/como-chegar/bar-vesuvio'), 'done', knows)).toEqual({
        name: 'directions',
        id: 'bar-vesuvio',
      })
    })

    it('to the events list for an unknown event id, and keeps a known one', () => {
      const knowsEvent = (id: string) => id === 'carnaval-2027'
      const resolve = (hash: string) =>
        resolveRoute(parseHash(hash), 'done', knows, knowsCircuit, true, knowsEvent)
      expect(resolve('#/evento/unknown-id')).toEqual({ name: 'events' })
      expect(resolve('#/evento/carnaval-2027')).toEqual({ name: 'event', id: 'carnaval-2027' })
    })

    it('keeps a known place', () => {
      expect(resolveRoute(parseHash('#/lugar/bar-vesuvio'), 'done', knows)).toEqual({
        name: 'place',
        id: 'bar-vesuvio',
      })
    })
  })

  describe('falls back for an unknown category or circuit', () => {
    it('to Explorar', () => {
      for (const hash of ['#/explorar/hoteis', '#/circuito/unknown']) {
        expect(resolveRoute(parseHash(hash), 'done', knows, knowsCircuit)).toEqual({
          name: 'explore',
        })
      }
    })

    it('to the first screen for a circuit with no id', () => {
      expect(parseHash('#/circuito/')).toBeNull()
      expect(resolveRoute(parseHash('#/circuito/'), 'done', knows, knowsCircuit)).toEqual({
        name: 'home',
      })
    })

    it('does not take a circuit id with a slash for a circuit', () => {
      expect(parseHash('#/circuito/a/b')).toBeNull()
      expect(resolveRoute(parseHash('#/circuito/a/b'), 'done', knows, knowsCircuit)).toEqual({
        name: 'home',
      })
    })

    it('keeps a known circuit and each known category', () => {
      expect(
        resolveRoute(
          parseHash('#/circuito/circuito-cultural-do-centro'),
          'done',
          knows,
          knowsCircuit,
        ),
      ).toEqual({ name: 'circuit', id: 'circuito-cultural-do-centro' })
      for (const id of ['gastronomia', 'cultura', 'praias', 'circuitos']) {
        expect(resolveRoute(parseHash(`#/explorar/${id}`), 'done', knows, knowsCircuit)).toEqual({
          name: 'explore-category',
          id,
        })
      }
    })
  })

  describe('while onboarding is pending the new routes', () => {
    it.each(['#/explorar', '#/explorar/cultura', '#/circuito/circuito-cultural-do-centro'])(
      'send %s to Idioma',
      (hash) => {
        expect(resolveRoute(parseHash(hash), 'pending', knows, knowsCircuit)).toEqual({
          name: 'language',
        })
      },
    )

    it('keep #/urgencias reachable', () => {
      expect(resolveRoute(parseHash('#/urgencias'), 'pending', knows, knowsCircuit)).toEqual({
        name: 'everyday',
      })
    })
  })

  describe('while onboarding is pending', () => {
    it.each(['#/inicio', '#/perto-de-mim', '#/lugar/bar-vesuvio', '#/perfil', '#/privacidade'])(
      'sends %s to Idioma',
      (hash) => {
        expect(resolveRoute(parseHash(hash), 'pending', knows)).toEqual({ name: 'language' })
      },
    )

    it.each(['#/idioma', '#/localizacao', '#/emergencia', '#/emergencia/mostrar'])(
      'keeps %s',
      (hash) => {
        expect(resolveRoute(parseHash(hash), 'pending', knows)).toEqual(parseHash(hash))
      },
    )
  })

  describe('Boas-vindas', () => {
    it('stays open to someone who is signed out, even while onboarding is pending', () => {
      for (const onboarding of ['done', 'pending'] as const) {
        expect(
          resolveRoute(parseHash('#/boas-vindas'), onboarding, knows, undefined, false),
        ).toEqual({ name: 'welcome' })
      }
    })

    it('sends someone who is signed in on to Início, or to Idioma while onboarding is pending', () => {
      expect(resolveRoute(parseHash('#/boas-vindas'), 'done', knows)).toEqual({ name: 'home' })
      expect(resolveRoute(parseHash('#/boas-vindas'), 'pending', knows)).toEqual({
        name: 'language',
      })
    })

    it('never waits for a sign-in before a deep link or the sign-in screens', () => {
      for (const hash of [
        '#/emergencia',
        '#/lugar/bar-vesuvio',
        '#/inicio',
        '#/entrar',
        '#/cadastro',
      ]) {
        expect(resolveRoute(parseHash(hash), 'done', knows, undefined, false)).toEqual(
          parseHash(hash),
        )
      }
      for (const hash of ['#/entrar', '#/cadastro']) {
        expect(resolveRoute(parseHash(hash), 'pending', knows, undefined, false)).toEqual(
          parseHash(hash),
        )
      }
    })

    it('sends a signed-out person with onboarding pending from a deep link to Idioma, not in a loop', () => {
      expect(resolveRoute(parseHash('#/inicio'), 'pending', knows, undefined, false)).toEqual({
        name: 'language',
      })
    })

    it('has no bar and no tab', () => {
      expect(showsBar({ name: 'welcome' }, 'done')).toBe(false)
      expect(tabFor({ name: 'welcome' })).toBeNull()
    })
  })

  it('shows the bar only on in-app routes', () => {
    const withBar = ALL.filter(([, route]) => showsBar(route, 'pending')).map(([hash]) => hash)
    expect(withBar).toEqual([
      '#/inicio',
      '#/explorar',
      '#/explorar/cultura',
      '#/circuito/circuito-cultural-do-centro',
      '#/perto-de-mim',
      '#/lugar/bar-vesuvio',
      '#/emergencia',
      '#/emergencia/mostrar',
      '#/urgencias',
      '#/perfil',
      '#/privacidade',
      '#/conta',
      '#/meu-roteiro',
      '#/eventos',
      '#/evento/carnaval-2027',
      '#/perfil-de-viagem',
      '#/como-chegar/bar-vesuvio',
      '#/onde-praticar/surf',
    ])
  })

  it('marks the selected tab', () => {
    expect(tabFor({ name: 'home' })).toBe('home')
    expect(tabFor({ name: 'nearby' })).toBe('nearby')
    expect(tabFor({ name: 'place', id: 'bar-vesuvio' })).toBe('nearby')
    expect(tabFor({ name: 'directions', id: 'bar-vesuvio' })).toBe('nearby')
    expect(tabFor({ name: 'sport-spots', id: 'surf' })).toBe('nearby')
    expect(tabFor({ name: 'login' })).toBeNull()
    expect(tabFor({ name: 'account' })).toBeNull()
    expect(tabFor({ name: 'plan' })).toBe('plan')
    expect(tabFor({ name: 'events' })).toBe('explore')
    expect(tabFor({ name: 'event', id: 'carnaval-2027' })).toBe('explore')
    expect(tabFor({ name: 'travel-profile' })).toBe('plan')
    expect(tabFor({ name: 'emergency' })).toBe('emergency')
    expect(tabFor({ name: 'explore' })).toBe('explore')
    expect(tabFor({ name: 'explore-category', id: 'cultura' })).toBe('explore')
    expect(tabFor({ name: 'circuit', id: 'circuito-cultural-do-centro' })).toBe('explore')
    expect(tabFor({ name: 'everyday' })).toBe('emergency')
    expect(tabFor({ name: 'profile' })).toBeNull()
    expect(tabFor({ name: 'privacy' })).toBeNull()
    expect(tabFor({ name: 'language' })).toBeNull()
  })
})

describe('routes, further cases', () => {
  it.each(['#/lugar/%', '#/lugar/%E0%A4%A', '#/lugar/%zz'])(
    'does not know a malformed percent escape: %j',
    (hash) => {
      expect(() => parseHash(hash)).not.toThrow()
      expect(parseHash(hash)).toBeNull()
    },
  )

  it('falls back on a malformed percent escape like on any unknown hash', () => {
    expect(resolveRoute(parseHash('#/lugar/%'), 'done', knows)).toEqual({ name: 'home' })
    expect(resolveRoute(parseHash('#/lugar/%'), 'pending', knows)).toEqual({ name: 'language' })
  })

  it('while onboarding is pending an unknown place id also lands on Idioma', () => {
    expect(resolveRoute(parseHash('#/lugar/unknown-id'), 'pending', knows)).toEqual({
      name: 'language',
    })
  })

  it('shows the bar only on in-app routes: Idioma shows it once onboarding is done', () => {
    expect(showsBar({ name: 'language' }, 'done')).toBe(true)
    expect(showsBar({ name: 'language' }, 'pending')).toBe(false)
    expect(showsBar({ name: 'login' }, 'done')).toBe(true)
    expect(showsBar({ name: 'login' }, 'pending')).toBe(false)
    expect(showsBar({ name: 'signup' }, 'pending')).toBe(false)
    expect(showsBar({ name: 'consent' }, 'done')).toBe(false)
    expect(showsBar({ name: 'consent' }, 'pending')).toBe(false)
  })
})
