import { describe, expect, it } from 'vitest'
import { metersNorth, USER } from '../../../test-utils/geolocation'
import { EMERGENCY_PLACES } from '../data'
import {
  directionsHref,
  formatDistance,
  nearestPlaces,
  orderWithoutPosition,
  rankPlaces,
  validatePlace,
  type EmergencyPlace,
  type PlaceCategory,
} from '../places'

function place(
  id: string,
  category: PlaceCategory,
  metersFromUser: number,
  extra: Partial<EmergencyPlace> = {},
): EmergencyPlace {
  const { lat, lng } = metersNorth(USER, metersFromUser)
  return {
    id,
    category,
    name: `Fixture ${id}`,
    phone: '(00) 0000-0000',
    lat,
    lng,
    verifiedAt: '2026-01-01',
    source: 'fixture',
    ...extra,
  }
}

describe('nearest place of each category', () => {
  it('keeps one place per category, nearest first, and skips a category with none', () => {
    const result = nearestPlaces(
      [
        place('far-police', 'police', 900),
        place('near-police', 'police', 500),
        place('hospital', 'hospital', 1200),
      ],
      USER,
    )
    expect(result.map((r) => r.place.id)).toEqual(['near-police', 'hospital'])
  })

  it('orders categories with the same distance as police, hospital, upa, fire', () => {
    const result = nearestPlaces(
      [
        place('f', 'fire', 700),
        place('u', 'upa', 700),
        place('h', 'hospital', 700),
        place('p', 'police', 700),
      ],
      USER,
    )
    expect(result.map((r) => r.place.category)).toEqual(['police', 'hospital', 'upa', 'fire'])
  })

  it.each<PlaceCategory>(['police', 'hospital', 'upa', 'fire'])(
    'returns the %s place when it is the only category present',
    (category) => {
      const result = nearestPlaces([place('only', category, 300)], USER)
      expect(result).toHaveLength(1)
      expect(result[0]?.place.category).toBe(category)
    },
  )

  it('returns nothing when there are no places', () => {
    expect(nearestPlaces([], USER)).toEqual([])
  })

  it('reports the straight-line distance in metres', () => {
    const [first] = nearestPlaces([place('p', 'police', 500)], USER)
    expect(first?.meters).toBeGreaterThan(499)
    expect(first?.meters).toBeLessThan(501)
  })
})

describe('formats the distance', () => {
  it.each([
    [994, '990 m'],
    [995, '1,0 km'],
    [1234, '1,2 km'],
    [0, '0 m'],
    [5, '10 m'],
    [15, '20 m'],
    [986, '990 m'],
    [994.9, '990 m'],
  ])('%s m reads %s', (meters, text) => {
    expect(formatDistance(meters)).toBe(text)
  })
})

describe('without a position orders', () => {
  it('lists every place by category then id', () => {
    const result = orderWithoutPosition([
      place('b-fire', 'fire', 10),
      place('b-police', 'police', 10),
      place('a-police', 'police', 10),
      place('a-upa', 'upa', 10),
      place('a-hospital', 'hospital', 10),
    ])
    expect(result.map((p) => p.id)).toEqual([
      'a-police',
      'b-police',
      'a-hospital',
      'a-upa',
      'b-fire',
    ])
  })
})

describe('validatePlace', () => {
  const valid = place('ok', 'hospital', 100)

  it('accepts a place with every field and no hours', () => {
    expect(validatePlace(valid).ok).toBe(true)
  })

  it.each(['id', 'name', 'phone', 'lat', 'lng', 'verifiedAt', 'source'] as const)(
    'rejects a place missing %s',
    (field) => {
      const broken: Record<string, unknown> = { ...valid }
      delete broken[field]
      expect(validatePlace(broken).ok).toBe(false)
    },
  )

  it('rejects a latitude of 91', () => {
    expect(validatePlace({ ...valid, lat: 91 }).ok).toBe(false)
  })

  it('rejects a longitude of -181', () => {
    expect(validatePlace({ ...valid, lng: -181 }).ok).toBe(false)
  })

  it.each([
    ['lat', 90],
    ['lat', -90],
    ['lng', 180],
    ['lng', -180],
  ] as const)('accepts %s exactly at %s', (field, value) => {
    expect(validatePlace({ ...valid, [field]: value }).ok).toBe(true)
  })

  it.each([Number.NaN, Number.POSITIVE_INFINITY, '10'])('rejects a latitude of %s', (lat) => {
    expect(validatePlace({ ...valid, lat }).ok).toBe(false)
  })

  it('every bundled place passes validatePlace', () => {
    for (const bundled of EMERGENCY_PLACES) {
      expect(validatePlace(bundled), bundled.id).toEqual({ ok: true, errors: [] })
    }
  })
})

describe('orders by distance only', () => {
  it('breaks a tie on identical coordinates by id', () => {
    const ranked = rankPlaces([place('b', 'hospital', 400), place('a', 'hospital', 400)], USER)
    expect(ranked.map((r) => r.place.id)).toEqual(['a', 'b'])
  })

  it('ignores any extra priority value on a place', () => {
    const favoured = { ...place('far', 'hospital', 900), priority: 1 } as EmergencyPlace
    const ranked = rankPlaces([favoured, place('near', 'hospital', 100)], USER)
    expect(ranked.map((r) => r.place.id)).toEqual(['near', 'far'])
  })
})

describe('directionsHref', () => {
  it('points only at the place coordinates', () => {
    const target = place('t', 'fire', 100)
    expect(directionsHref(target)).toBe(
      `https://www.google.com/maps/dir/?api=1&destination=${target.lat},${target.lng}`,
    )
  })
})
