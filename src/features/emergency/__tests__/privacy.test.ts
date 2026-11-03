import { describe, expect, it } from 'vitest'

const sources = import.meta.glob<string>('../*.{ts,tsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const production = Object.entries(sources).filter(([path]) => !/\.test\.tsx?$/.test(path))

const urgenciasSources = import.meta.glob<string>('../../urgencias/*.{ts,tsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const urgencias = Object.entries(urgenciasSources).filter(([path]) => !/\.test\.tsx?$/.test(path))

const FORBIDDEN = [
  'localStorage',
  'sessionStorage',
  'indexedDB',
  'document.cookie',
  'sendBeacon',
  'XMLHttpRequest',
  'fetch(',
  'console.',
  'analytics',
]

describe('emergency feature sources', () => {
  it('has production files to inspect', () => {
    expect(production.length).toBeGreaterThan(3)
  })

  it('feature imports no storage, analytics or logging', () => {
    for (const [path, source] of production) {
      for (const word of FORBIDDEN) {
        expect(source.includes(word), `${path} mentions ${word}`).toBe(false)
      }
    }
  })

  it('only location.ts touches navigator.geolocation', () => {
    const users = production
      .filter(([, source]) => source.includes('navigator.geolocation'))
      .map(([path]) => path)
    expect(users).toEqual(['../location.ts'])
  })
})

describe('urgencias feature sources', () => {
  it('has production files to inspect', () => {
    expect(urgencias.length).toBeGreaterThan(2)
  })

  it('urgencias imports no storage, analytics or logging', () => {
    for (const [path, source] of urgencias) {
      for (const word of FORBIDDEN) {
        expect(source.includes(word), `${path} mentions ${word}`).toBe(false)
      }
    }
  })

  it('urgencias never touches navigator.geolocation itself', () => {
    const users = urgencias.filter(([, source]) => source.includes('navigator.geolocation'))
    expect(users).toEqual([])
  })
})
