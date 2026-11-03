import { htmlLang, type Language, type Localized } from '../../i18n/i18n'

export const EVENT_CATEGORIES = ['festas', 'musica', 'cultura', 'esportes', 'gastronomia'] as const
export type EventCategory = (typeof EVENT_CATEGORIES)[number]
export type EventCategoryFilter = 'all' | EventCategory

export const DATE_PRESETS = ['any', 'today', 'week', 'month', 'pick'] as const
export type DatePreset = (typeof DATE_PRESETS)[number]

export const SORT_ORDERS = ['soonest', 'latest', 'name', 'category'] as const
export type SortOrder = (typeof SORT_ORDERS)[number]

// why: 'expected' is a yearly event whose next edition was not announced, so its date comes from the usual pattern; 'open' only has a month
export type DateStatus = 'confirmed' | 'expected' | 'open'

export type Admission = 'free' | 'paid' | 'registration'

export interface TicketPrice {
  label: Localized
  price: string
}

// invariant: every field below is copied from the event's own sales or registration page; an absent field means the source did not say, never "no"
export interface EventTickets {
  online?: { url: string; platform: string }
  prices?: readonly TicketPrice[]
  physical?: Localized
}

// hazard: a poster is the organiser's promotional art, shown by link from the page that sells the event, with credit and never copied into the app
export interface EventPoster {
  src: string
  credit: string
  page: string
}

// invariant: an event has a day or a range of days; the date is inclusive and local to Ilhéus. The time lives in `details`, because sources disagree on it
export interface CityEvent {
  id: string
  category: EventCategory
  name: string
  summary: Localized
  details?: Localized
  start: string
  end?: string
  dateStatus: DateStatus
  venue?: string
  address?: string
  placeId?: string
  organizer?: string
  admission?: Admission
  tickets?: EventTickets
  poster?: EventPoster
  instagram?: string
  sources: readonly string[]
}

export interface EventFilter {
  category: EventCategoryFilter
  preset: DatePreset
  picked: string
  showPast: boolean
  today: string
}

const DAY = /^(\d{4})-(\d{2})-(\d{2})$/

export function parseDay(day: string): Date | null {
  const match = DAY.exec(day)
  if (!match) return null
  const [, year, month, date] = match
  const parsed = new Date(Number(year), Number(month) - 1, Number(date))
  return dayKey(parsed) === day ? parsed : null
}

export function dayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function addDays(day: string, amount: number): string {
  const base = parseDay(day) ?? new Date()
  return dayKey(new Date(base.getFullYear(), base.getMonth(), base.getDate() + amount))
}

export const endOf = (event: CityEvent): string => event.end ?? event.start

export const isOver = (event: CityEvent, today: string): boolean => endOf(event) < today

// why: null means "any day"; a picked day that is not a real date is treated the same, so a half-typed field never empties the list
export function rangeFor(
  preset: DatePreset,
  today: string,
  picked: string,
): [string, string] | null {
  if (preset === 'today') return [today, today]
  if (preset === 'week') return [today, addDays(today, 6)]
  if (preset === 'month') {
    const base = parseDay(today) ?? new Date()
    const last = new Date(base.getFullYear(), base.getMonth() + 1, 0)
    return [`${today.slice(0, 8)}01`, dayKey(last)]
  }
  if (preset === 'pick' && parseDay(picked)) return [picked, picked]
  return null
}

export function filterEvents(events: readonly CityEvent[], filter: EventFilter): CityEvent[] {
  const range = rangeFor(filter.preset, filter.today, filter.picked)
  return events.filter((event) => {
    if (filter.category !== 'all' && event.category !== filter.category) return false
    if (!filter.showPast && isOver(event, filter.today)) return false
    if (range && (endOf(event) < range[0] || event.start > range[1])) return false
    return true
  })
}

const byDate = (a: CityEvent, b: CityEvent) =>
  a.start.localeCompare(b.start) || endOf(a).localeCompare(endOf(b)) || a.name.localeCompare(b.name)

export function sortEvents(
  events: readonly CityEvent[],
  order: SortOrder,
  language: Language,
): CityEvent[] {
  const list = [...events]
  switch (order) {
    case 'soonest':
      return list.sort(byDate)
    case 'latest':
      return list.sort((a, b) => byDate(b, a))
    case 'name':
      return list.sort((a, b) => a.name.localeCompare(b.name, htmlLang(language)) || byDate(a, b))
    case 'category':
      return list.sort(
        (a, b) =>
          EVENT_CATEGORIES.indexOf(a.category) - EVENT_CATEGORIES.indexOf(b.category) ||
          byDate(a, b),
      )
  }
}

export function formatEventDate(event: CityEvent, language: Language): string {
  const locale = htmlLang(language)
  const start = parseDay(event.start) ?? new Date()
  if (event.dateStatus === 'open') {
    return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(start)
  }
  const end = parseDay(endOf(event)) ?? start
  if (endOf(event) !== event.start) {
    const range = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    return range.formatRange(start, end)
  }
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(start)
}
