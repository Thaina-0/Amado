import { describe, expect, it } from 'vitest'
import { CONTENT_LANGUAGES } from '../../../i18n/i18n'
import { findPlace } from '../../places/places'
import { EVENTS } from '../data'
import {
  addDays,
  dayKey,
  endOf,
  EVENT_CATEGORIES,
  filterEvents,
  formatEventDate,
  isOver,
  parseDay,
  rangeFor,
  sortEvents,
  type CityEvent,
  type EventFilter,
} from '../events'

const TODAY = '2026-10-29'
const ALL: EventFilter = {
  category: 'all',
  preset: 'any',
  picked: '',
  showPast: false,
  today: TODAY,
}
const ids = (events: readonly CityEvent[]) => events.map((event) => event.id)
const event = (id: string) => {
  const found = EVENTS.find((candidate) => candidate.id === id)
  if (!found) throw new Error(`missing ${id}`)
  return found
}

describe('days', () => {
  it('reads only real calendar days', () => {
    expect(parseDay('2026-11-11')).toEqual(new Date(2026, 10, 11))
    for (const bad of ['', '2026-13-01', '2026-02-30', '11/11/2026', 'abc', '2026-1-1']) {
      expect(parseDay(bad), bad).toBeNull()
    }
  })

  it('writes the local day, with no shift to UTC', () => {
    expect(dayKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05')
    expect(dayKey(new Date(2026, 11, 31, 0, 1))).toBe('2026-12-31')
  })

  it('adds days across months and years', () => {
    expect(addDays('2026-10-29', 6)).toBe('2026-11-04')
    expect(addDays('2026-12-30', 3)).toBe('2027-01-02')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
  })

  it('gives each date filter its range, and no range for any day or a half-typed day', () => {
    expect(rangeFor('any', TODAY, '')).toBeNull()
    expect(rangeFor('today', TODAY, '')).toEqual([TODAY, TODAY])
    expect(rangeFor('week', TODAY, '')).toEqual(['2026-10-29', '2026-11-04'])
    expect(rangeFor('month', TODAY, '')).toEqual(['2026-10-01', '2026-10-31'])
    expect(rangeFor('month', '2026-02-10', '')).toEqual(['2026-02-01', '2026-02-28'])
    expect(rangeFor('pick', TODAY, '2026-11-12')).toEqual(['2026-11-12', '2026-11-12'])
    expect(rangeFor('pick', TODAY, '')).toBeNull()
    expect(rangeFor('pick', TODAY, '2026-1')).toBeNull()
  })

  it('tells when an event is over, counting its last day as still on', () => {
    const fli = event('festa-literaria-de-ilheus-2026')
    expect(isOver(fli, '2026-11-14')).toBe(false)
    expect(isOver(fli, '2026-11-15')).toBe(true)
    expect(endOf(event('festa-latina-casa-maya'))).toBe('2026-11-07')
  })
})

describe('filterEvents', () => {
  it('lists the upcoming events by default and hides the ones that already happened', () => {
    const list = ids(filterEvents(EVENTS, ALL))
    expect(list).toContain('festa-latina-casa-maya')
    expect(list).toContain('carnaval-2027')
    expect(list).not.toContain('chocolat-bahia-2026')
    expect(list).not.toContain('agosto-de-jorge-2026')
    expect(list.length).toBeGreaterThanOrEqual(10)
  })

  it('shows the ones that already happened when asked', () => {
    const list = ids(filterEvents(EVENTS, { ...ALL, showPast: true }))
    expect(list).toEqual(expect.arrayContaining(['chocolat-bahia-2026', 'agosto-de-jorge-2026']))
    expect(list).toHaveLength(EVENTS.length)
  })

  it('filters by category', () => {
    const music = ids(filterEvents(EVENTS, { ...ALL, category: 'musica' }))
    expect(music.sort()).toEqual(
      ['festa-latina-casa-maya', 'noite-do-brega-boca-do-mar', 'sunset-fest-2026'].sort(),
    )
    expect(filterEvents(EVENTS, { ...ALL, category: 'gastronomia' })).toEqual([])
    expect(ids(filterEvents(EVENTS, { ...ALL, category: 'gastronomia', showPast: true }))).toEqual([
      'chocolat-bahia-2026',
    ])
  })

  it('keeps a range event on every day it runs, edges included', () => {
    const on = (day: string) =>
      ids(filterEvents(EVENTS, { ...ALL, preset: 'pick', picked: day })).includes(
        'festa-literaria-de-ilheus-2026',
      )
    expect(on('2026-11-10')).toBe(false)
    expect(on('2026-11-11')).toBe(true)
    expect(on('2026-11-13')).toBe(true)
    expect(on('2026-11-14')).toBe(true)
    expect(on('2026-11-15')).toBe(false)
  })

  it('finds an event that starts after the range opens and ends inside it', () => {
    const list = ids(filterEvents(EVENTS, { ...ALL, today: '2026-11-09', preset: 'week' }))
    expect(list).toEqual(['festa-literaria-de-ilheus-2026'])
  })

  it('combines category and date', () => {
    const list = filterEvents(EVENTS, {
      ...ALL,
      today: '2026-11-09',
      preset: 'month',
      category: 'musica',
    })
    expect(ids(list).sort()).toEqual(['noite-do-brega-boca-do-mar', 'sunset-fest-2026'])
  })

  it('does not hide anything for a picked day that is not a date yet', () => {
    expect(filterEvents(EVENTS, { ...ALL, preset: 'pick', picked: '2026-1' })).toEqual(
      filterEvents(EVENTS, ALL),
    )
  })

  it('does not change the list it is given', () => {
    const copy = [...EVENTS]
    filterEvents(EVENTS, ALL)
    sortEvents(EVENTS, 'name', 'pt')
    expect(EVENTS).toEqual(copy)
  })
})

describe('sortEvents', () => {
  const upcoming = filterEvents(EVENTS, ALL)

  it('puts the earliest first, then the latest first', () => {
    const soonest = sortEvents(upcoming, 'soonest', 'pt')
    expect(soonest[0]?.id).toBe('festa-latina-casa-maya')
    expect(soonest.at(-1)?.id).toBe('festa-de-sao-jorge-2027')
    expect(ids(sortEvents(upcoming, 'latest', 'pt'))).toEqual(ids(soonest).reverse())
  })

  it('orders by name with accents handled, and ties by date', () => {
    const names = sortEvents(upcoming, 'name', 'pt').map((candidate) => candidate.name)
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'pt-BR')))
    expect(names[0]).toBe('9ª Festa Literária de Ilhéus (FLI)')
  })

  it('groups by category in the order of the filter, each group by date', () => {
    const grouped = sortEvents(upcoming, 'category', 'pt')
    const order = grouped.map((candidate) => EVENT_CATEGORIES.indexOf(candidate.category))
    expect(order).toEqual([...order].sort((a, b) => a - b))
    expect(grouped[0]?.id).toBe('natal-encantado-2026')
  })
})

describe('formatEventDate', () => {
  it('writes one day with the weekday, in the language', () => {
    expect(formatEventDate(event('festa-latina-casa-maya'), 'pt')).toMatch(/sáb.*7.*nov.*2026/i)
    expect(formatEventDate(event('festa-latina-casa-maya'), 'en')).toMatch(/sat.*nov.*7.*2026/i)
  })

  it('writes a range once, not as two dates', () => {
    const text = formatEventDate(event('festa-literaria-de-ilheus-2026'), 'pt')
    expect(text).toMatch(/11.*14.*nov.*2026/)
    expect(text.match(/nov/g)).toHaveLength(1)
  })

  it('writes only the month when the day is still to be announced', () => {
    const text = formatEventDate(event('natal-encantado-2026'), 'pt')
    expect(text).toMatch(/dezembro/i)
    expect(text).not.toMatch(/\b1\b|\b31\b/)
  })
})

describe('event data', () => {
  it('has a unique id and a category from the list', () => {
    expect(new Set(ids(EVENTS)).size).toBe(EVENTS.length)
    for (const item of EVENTS) expect(EVENT_CATEGORIES).toContain(item.category)
  })

  it('has real days, in order, and a month-wide range for the ones with no day yet', () => {
    for (const item of EVENTS) {
      expect(parseDay(item.start), item.id).not.toBeNull()
      expect(endOf(item) >= item.start, item.id).toBe(true)
      if (item.end) expect(parseDay(item.end), item.id).not.toBeNull()
      if (item.dateStatus === 'open') {
        expect(item.start.endsWith('-01'), item.id).toBe(true)
        expect(endOf(item).slice(0, 7), item.id).toBe(item.start.slice(0, 7))
      }
    }
  })

  it('writes name and summary in the three languages', () => {
    for (const item of EVENTS) {
      expect(item.name.trim().length, item.id).toBeGreaterThan(3)
      for (const language of CONTENT_LANGUAGES) {
        const summary: string | undefined = item.summary[language]
        const details: string = item.details?.[language] ?? 'long enough text'
        expect(summary?.length ?? 0, `${item.id} ${language}`).toBeGreaterThan(15)
        expect(details.length, `${item.id} details ${language}`).toBeGreaterThan(15)
      }
    }
  })

  it('backs every event with a public page', () => {
    for (const item of EVENTS) {
      expect(item.sources.length, item.id).toBeGreaterThan(0)
      for (const url of item.sources) expect(url, item.id).toMatch(/^https:\/\//)
    }
  })

  it('says plainly when a date is a pattern and not an announcement', () => {
    const guessed = EVENTS.filter((item) => item.dateStatus !== 'confirmed').map((item) => item.id)
    expect(guessed).toEqual(
      expect.arrayContaining([
        'natal-encantado-2026',
        'reveillon-de-ilheus-2027',
        'puxada-do-mastro-olivenca-2027',
        'carnaval-2027',
        'festa-de-sao-jorge-2027',
      ]),
    )
    for (const item of EVENTS.filter((candidate) => candidate.dateStatus !== 'confirmed')) {
      expect(item.summary.pt + (item.details?.pt ?? ''), item.id).toMatch(
        /ainda não|costume|calendário|datas nacionais|segundo domingo|feriado/i,
      )
    }
  })

  it('carries no price, phone or coordinate in the texts, since prices live in `tickets`', () => {
    const texts = EVENTS.flatMap((item) => [
      ...Object.values(item.summary),
      ...Object.values(item.details ?? {}),
    ])
    for (const text of texts) {
      expect(text).not.toMatch(/R\$\s?\d/)
      expect(text).not.toMatch(/\(?\d{2}\)?\s?\d{4,5}-?\d{4}/)
      expect(text).not.toMatch(/-?\d{1,2}\.\d{4,}/)
    }
  })

  it('points only at places that exist', () => {
    for (const item of EVENTS) {
      if (item.placeId) expect(findPlace(item.placeId), item.id).toBeDefined()
    }
  })

  it('has events in every category, counting the ones that already happened', () => {
    for (const category of EVENT_CATEGORIES) {
      expect(
        EVENTS.some((item) => item.category === category),
        category,
      ).toBe(true)
    }
  })
})
