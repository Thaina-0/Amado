import { describe, expect, it } from 'vitest'
import { USER } from '../../../test-utils/geolocation'
import { provider } from '../../../test-utils/providers'
import { EMERGENCY_PLACES } from '../../emergency/data'
import { validatePlace } from '../../emergency/places'
import {
  orderWithoutPosition,
  PROVIDER_CATEGORIES,
  rankProviders,
  validateProvider,
  type EverydayProvider,
} from '../providers'
import { EVERYDAY_PROVIDERS } from '../data'

const sources = import.meta.glob<string>(['../providers.ts', '../data.ts'], {
  query: '?raw',
  import: 'default',
  eager: true,
})

const ids = (rows: { provider: EverydayProvider }[]) => rows.map((row) => row.provider.id)

describe('rankProviders and orderWithoutPosition', () => {
  it('orders by distance then category then id', () => {
    const far = provider('far', 'chaveiro', 300)
    const near = provider('near', 'guincho', 100)
    expect(ids(rankProviders([far, near], USER))).toEqual(['near', 'far'])

    const sameSpot = [
      provider('b', 'guincho', 200),
      provider('c', 'chaveiro', 200),
      provider('a', 'guincho', 200),
    ]
    expect(ids(rankProviders(sameSpot, USER))).toEqual(['c', 'a', 'b'])

    const farther = provider('b', 'chaveiro', 140)
    const closer = provider('a', 'guincho', 120)
    expect(ids(rankProviders([farther, closer], USER))).toEqual(['a', 'b'])

    expect(ids(orderWithoutPosition(sameSpot))).toEqual(['c', 'a', 'b'])
    expect(ids(orderWithoutPosition([near, far]))).toEqual(['far', 'near'])
  })

  it('gives a distance only when the position is known', () => {
    const [ranked] = rankProviders([provider('p', 'chaveiro', 300)], USER)
    expect(ranked?.meters).toBeCloseTo(300, -1)
    expect(orderWithoutPosition([provider('p', 'chaveiro', 300)])[0]?.meters).toBeUndefined()
  })
})

describe('validateProvider', () => {
  const valid = provider('ok', 'chaveiro', 100)

  it('accepts a complete record', () => {
    expect(validateProvider(valid)).toEqual({ ok: true, errors: [] })
    expect(validateProvider({ ...valid, open24h: true, hours: '8h às 18h' }).ok).toBe(true)
  })

  it.each([
    ['id', { id: '' }, 'id is required'],
    ['name', { name: ' ' }, 'name is required'],
    ['phone', { phone: '' }, 'phone is required'],
    ['verifiedAt', { verifiedAt: undefined }, 'verifiedAt is required'],
    ['source', { source: '' }, 'source is required'],
    ['category', { category: 'hotel' }, 'category is not a known category'],
    ['lat', { lat: 91 }, 'lat must be a number from -90 to 90'],
    ['lng', { lng: -181 }, 'lng must be a number from -180 to 180'],
    ['hours', { hours: ' ' }, 'hours must be a non-empty string when present'],
  ])('rejects a bad %s', (_field, patch, message) => {
    const result = validateProvider({ ...valid, ...patch })
    expect(result.ok).toBe(false)
    expect(result.errors).toEqual([message])
  })

  it.each([
    ['lat', 90],
    ['lat', -90],
    ['lng', 180],
    ['lng', -180],
  ])('accepts %s at the bound %d', (field, value) => {
    expect(validateProvider({ ...valid, [field]: value })).toEqual({ ok: true, errors: [] })
  })

  it('names every problem of a record that is not an object', () => {
    expect(validateProvider(null).errors).toHaveLength(8)
  })

  it('accepts every provider category', () => {
    for (const category of PROVIDER_CATEGORIES) {
      expect(validateProvider({ ...valid, category }).ok).toBe(true)
    }
    expect(PROVIDER_CATEGORIES).toHaveLength(7)
  })

  it('passes for every shipped provider', () => {
    for (const shipped of EVERYDAY_PROVIDERS) expect(validateProvider(shipped).ok).toBe(true)
  })
})

describe('EVERYDAY_PROVIDERS', () => {
  it('ships empty', () => {
    expect(EVERYDAY_PROVIDERS).toEqual([])
    expect(sources['../data.ts']).toContain('TODO(verify)')
  })

  it('has no field that ranks or promotes', () => {
    const source = sources['../providers.ts'] ?? ''
    const shape = source.slice(source.indexOf('export interface EverydayProvider'))
    const block = shape.slice(0, shape.indexOf('\n}\n'))
    expect(block.length).toBeGreaterThan(50)
    expect(block).not.toMatch(/rank|priorit|promot|sponsor|paid|pay|boost|featured/i)
  })

  it('is kept apart from the emergency places', () => {
    expect(EVERYDAY_PROVIDERS).not.toBe(EMERGENCY_PLACES)
    expect(validatePlace(provider('x', 'chaveiro', 10)).ok).toBe(false)
    expect(validateProvider({ ...provider('x', 'chaveiro', 10), category: 'police' }).ok).toBe(
      false,
    )
  })
})
