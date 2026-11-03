import { describe, expect, it } from 'vitest'
import { CONTENT_LANGUAGES } from '../../../i18n/i18n'
import {
  EXAMPLE_PLACES,
  filterPlaces,
  findPlace,
  normalizeText,
  PLACE_CATEGORIES,
  type CategoryFilter,
} from '../places'

const names = (query: string, category: CategoryFilter = 'all') =>
  filterPlaces(EXAMPLE_PLACES, { category, query, language: 'pt' }).map((place) => place.name)

// why: these entries have no photo that fits Ilhéus yet, and a picture of another place would mislead
const WITHOUT_PHOTOS = [
  'futevolei',
  'stand-up-paddle',
  'academias',
  'barracas-dos-milionarios',
  'cabanas-da-rodovia-olivenca',
  'lagoa-encantada',
  'rio-almada',
  'igreja-de-nossa-senhora-da-escada',
  'fazenda-yrere',
  'fazenda-provisao',
  'fazenda-riachuelo',
  'chocolate-caseiro-ilheus',
  'bahia-cacau',
]

// why: the glob lists the real files under public/, so a photo that was renamed or never added is caught without node types
const PHOTO_FILES = new Set(Object.keys(import.meta.glob('/public/places/*/*.jpg')))

describe('places', () => {
  describe('searches ignoring case and accents', () => {
    it.each([
      ['vesuvio', ['Bar Vesúvio']],
      ['VESÚVIO', ['Bar Vesúvio']],
      ['JORGE', ['Casa de Jorge Amado', 'Teatro Municipal', 'Igreja de São Jorge']],
      ['sao sebastiao', ['Catedral de São Sebastião', 'Stand Up Paddle e Caiaque']],
      ['futevolei', ['Futevôlei']],
      ['xyz', []],
    ])('%j finds %j', (query, expected) => {
      expect(names(query)).toEqual(expected)
    })

    it('finds a place by the summary in the chosen language', () => {
      const english = filterPlaces(EXAMPLE_PLACES, {
        category: 'all',
        query: 'museum',
        language: 'en',
      })
      expect(english.map((place) => place.name)).toEqual([
        'Casa de Jorge Amado',
        'Igreja de São Jorge',
      ])
      const portuguese = filterPlaces(EXAMPLE_PLACES, {
        category: 'all',
        query: 'museum',
        language: 'pt',
      })
      expect(portuguese).toEqual([])
    })

    it('lists every place when the field is empty or only spaces', () => {
      expect(names('')).toHaveLength(EXAMPLE_PLACES.length)
      expect(names('   ')).toHaveLength(EXAMPLE_PLACES.length)
    })
  })

  it('filters by category', () => {
    expect(names('', 'gastronomia')).toEqual([
      'Bar Vesúvio',
      'Bataclan',
      'Acarajé da Zélia',
      'Estrada do Chocolate',
      'Fazenda Yrerê',
      'Fazenda Provisão',
      'Fazenda Riachuelo e Mendoá',
      'Chocolate Caseiro Ilhéus',
      'Bahia Cacau',
    ])
    expect(names('', 'cultura')).toEqual([
      'Casa de Jorge Amado',
      'Catedral de São Sebastião',
      'Teatro Municipal',
      'Igreja de São Jorge',
      'Igreja de Nossa Senhora da Escada',
    ])
    expect(names('', 'praias')).toEqual([
      'Praia dos Milionários',
      'Praia de Cururupe',
      'Barracas da Praia dos Milionários',
      'Cabanas da Rodovia Ilhéus–Olivença',
    ])
    expect(names('', 'natureza')).toEqual(['Lagoa Encantada', 'Rio Almada'])
    expect(names('', 'esportes')).toEqual([
      'Surf',
      'Beach Tennis',
      'Stand Up Paddle e Caiaque',
      'Kitesurf e Windsurf',
      'Futevôlei',
      'Academias',
    ])
    expect(names('jorge', 'gastronomia')).toEqual([])
  })

  it('has at least one place in every category', () => {
    const used = new Set(EXAMPLE_PLACES.map((place) => place.category))
    expect(PLACE_CATEGORIES.filter((category) => !used.has(category))).toEqual([])
  })

  it('keeps every example place free of invented data', () => {
    const allowed = ['category', 'details', 'example', 'id', 'name', 'photos', 'sources', 'summary']
    for (const place of EXAMPLE_PLACES) {
      expect(allowed, place.id).toEqual(expect.arrayContaining(Object.keys(place)))
      expect(place.example).toBe(true)
    }
  })

  it('writes every text in the three languages', () => {
    for (const place of EXAMPLE_PLACES) {
      for (const language of CONTENT_LANGUAGES) {
        const summary: string | undefined = place.summary[language]
        const details: string | undefined = place.details?.[language] ?? 'long enough text'
        expect(summary?.length ?? 0, `${place.id} summary ${language}`).toBeGreaterThan(8)
        expect(details.length, `${place.id} details ${language}`).toBeGreaterThan(8)
      }
    }
  })

  it('backs every fact with a public page, and says plainly when there is none yet', () => {
    for (const place of EXAMPLE_PLACES) {
      expect(place.sources?.length, place.id).toBeGreaterThan(0)
      for (const url of place.sources ?? []) expect(url, place.id).toMatch(/^https:\/\//)
    }
  })

  it('carries no phone, price, opening hours, street address or coordinate in the texts', () => {
    const texts = EXAMPLE_PLACES.flatMap((place) => [
      ...Object.values(place.summary),
      ...Object.values(place.details ?? {}),
    ])
    for (const text of texts) {
      expect(text).not.toMatch(/\(?\d{2}\)?\s?\d{4,5}-?\d{4}/)
      expect(text).not.toMatch(/R\$\s?\d/)
      expect(text).not.toMatch(/\b\d{1,2}h(\d{2})?\b|\b\d{1,2}:\d{2}\b/)
      expect(text).not.toMatch(/-?\d{1,2}\.\d{4,}/)
    }
  })

  it('gives every photo a file, an author, a free license and a page to credit it', () => {
    const free = /^(CC0|CC BY(-SA)? \d\.\d|Public domain)$/
    let total = 0
    for (const place of EXAMPLE_PLACES) {
      for (const photo of place.photos) {
        total += 1
        expect(PHOTO_FILES.has(`/public${photo.src}`), photo.src).toBe(true)
        expect(photo.author.trim().length, photo.src).toBeGreaterThan(1)
        expect(photo.license, photo.src).toMatch(free)
        expect(photo.page, photo.src).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/)
      }
    }
    expect(total).toBeGreaterThanOrEqual(20)
  })

  it('has a photo for every place that is not still being gathered, each inside its own folder', () => {
    for (const place of EXAMPLE_PLACES) {
      if (WITHOUT_PHOTOS.includes(place.id)) expect(place.photos).toEqual([])
      else expect(place.photos.length, place.id).toBeGreaterThan(0)
      for (const photo of place.photos) {
        expect(photo.src.startsWith(`/places/${place.id}/`), photo.src).toBe(true)
      }
    }
  })

  it('marks as illustrative the photos that show the area, the dish or the sport, not the place', () => {
    const ids = EXAMPLE_PLACES.filter((place) => place.photos.some((p) => p.illustrative)).map(
      (place) => place.id,
    )
    expect(ids).toEqual([
      'acaraje-da-zelia',
      'praia-de-cururupe',
      'surf',
      'beach-tennis',
      'kitesurf-windsurf',
    ])
  })

  it('tells each story in up to three short paragraphs, in the three languages', () => {
    for (const place of EXAMPLE_PLACES) {
      for (const language of CONTENT_LANGUAGES) {
        const paragraphs = (place.details?.[language] ?? '').split('\n\n')
        expect(paragraphs.length, `${place.id} ${language}`).toBeLessThanOrEqual(3)
        for (const paragraph of paragraphs) {
          expect(paragraph.length, `${place.id} ${language}`).toBeLessThan(520)
        }
      }
    }
  })

  it('normalizes accents and case', () => {
    expect(normalizeText('  São  ')).toBe('sao')
  })
})

describe('findPlace', () => {
  it('finds a place by id and answers undefined for an unknown one', () => {
    expect(findPlace('surf')?.name).toBe('Surf')
    expect(findPlace('nao-existe')).toBeUndefined()
  })
})
