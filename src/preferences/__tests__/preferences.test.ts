import { describe, expect, it, vi } from 'vitest'
import {
  defaultPreferences,
  parsePreferences,
  readPreferences,
  STORAGE_KEY,
  writePreferences,
  type Preferences,
} from '../preferences'

function memoryStorage(initial?: string) {
  const data = new Map<string, string>()
  if (initial !== undefined) data.set(STORAGE_KEY, initial)
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  }
}

const SAMPLE: Preferences = { language: 'es', theme: 'dark', onboarding: 'done', countVisit: true }

describe('preferences', () => {
  it('stores and reads the same values', () => {
    const storage = memoryStorage()
    writePreferences(SAMPLE, storage)
    expect(readPreferences('pt', storage)).toEqual(SAMPLE)
  })

  it('uses the key amado.preferences.v1', () => {
    expect(STORAGE_KEY).toBe('amado.preferences.v1')
  })

  it.each([
    ['invalid JSON', '{nope', defaultPreferences('en')],
    ['null', 'null', defaultPreferences('en')],
    ['an array', '[1,2]', defaultPreferences('en')],
    ['language ja', JSON.stringify({ ...SAMPLE, language: 'ja' }), { ...SAMPLE, language: 'en' }],
    ['theme neon', JSON.stringify({ ...SAMPLE, theme: 'neon' }), { ...SAMPLE, theme: 'auto' }],
    [
      'countVisit "yes"',
      JSON.stringify({ ...SAMPLE, countVisit: 'yes' }),
      { ...SAMPLE, countVisit: false },
    ],
    [
      'onboarding "later"',
      JSON.stringify({ ...SAMPLE, onboarding: 'later' }),
      { ...SAMPLE, onboarding: 'pending' },
    ],
  ])('uses the default for bad stored values: %s', (_name, raw, expected) => {
    expect(parsePreferences(raw, 'en')).toEqual(expected)
  })

  it('keeps a valid field next to a bad one', () => {
    const raw = JSON.stringify({
      language: 'es',
      theme: 'neon',
      onboarding: 'done',
      countVisit: true,
    })
    expect(parsePreferences(raw, 'pt')).toEqual({
      language: 'es',
      theme: 'auto',
      onboarding: 'done',
      countVisit: true,
    })
  })

  it('defaults when nothing is stored', () => {
    expect(readPreferences('es', memoryStorage())).toEqual({
      language: 'es',
      theme: 'auto',
      onboarding: 'pending',
      countVisit: false,
    })
  })

  describe('keeps working when localStorage throws', () => {
    const broken = {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('quota')
      },
    }

    it('on read', () => {
      expect(readPreferences('pt', broken)).toEqual(defaultPreferences('pt'))
    })

    it('on write', () => {
      expect(() => writePreferences(SAMPLE, broken)).not.toThrow()
    })

    it('when there is no storage at all', () => {
      expect(readPreferences('pt', null)).toEqual(defaultPreferences('pt'))
      expect(() => writePreferences(SAMPLE, null)).not.toThrow()
    })
  })

  it('stores only the four fields', () => {
    const storage = memoryStorage()
    const polluted = {
      ...SAMPLE,
      lat: -14.78,
      lng: -39.04,
      placeId: 'bar-vesuvio',
      search: 'vesuvio',
    } as Preferences
    writePreferences(polluted, storage)
    const stored = JSON.parse(storage.data.get(STORAGE_KEY) ?? '{}') as Record<string, unknown>
    expect(Object.keys(stored).sort()).toEqual(['countVisit', 'language', 'onboarding', 'theme'])
    expect(storage.data.size).toBe(1)
  })

  it('does not call the console', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    parsePreferences('{nope', 'pt')
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})
