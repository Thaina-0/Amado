import type { Language } from '../../i18n/i18n'
import { EMERGENCY_NUMBERS, SHORT, TITLE } from './data'

export type ServiceId = 'police' | 'ambulance' | 'fire' | 'women-violence' | 'civil-defense'

export interface EmergencyNumber {
  number: string
  service: ServiceId
}

export { EMERGENCY_NUMBERS }

const OTHER_LANGUAGES: Record<Language, [Language, Language]> = {
  pt: ['en', 'es'],
  en: ['pt', 'es'],
  es: ['en', 'pt'],
  fr: ['pt', 'en'],
  de: ['pt', 'en'],
  it: ['pt', 'en'],
}

// invariant: the title is in the visitor's language and the second line names the service in the other two (AD-010)
export function serviceNames(
  service: ServiceId,
  language: Language,
): { title: string; subtitle: string } {
  return {
    title: TITLE[service][language],
    subtitle: OTHER_LANGUAGES[language].map((other) => SHORT[service][other]).join(', '),
  }
}

export function telHref(number: string): string {
  return `tel:${number}`
}
