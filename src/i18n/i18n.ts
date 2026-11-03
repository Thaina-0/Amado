import { LANGUAGES, MESSAGES, type Language, type MessageKey } from './messages'

export { LANGUAGES, MESSAGES }
export type { Language, MessageKey }

export const LANGUAGE_NAME: Record<Language, string> = {
  pt: 'Português',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
}

export const CHOOSE_LANGUAGE: Record<Language, string> = {
  pt: 'Escolha o idioma',
  en: 'Choose your language',
  es: 'Elige tu idioma',
  fr: 'Choisissez votre langue',
  de: 'Sprache wählen',
  it: 'Scegli la tua lingua',
}

const HTML_LANG: Record<Language, string> = {
  pt: 'pt-BR',
  en: 'en',
  es: 'es',
  fr: 'fr',
  de: 'de',
  it: 'it',
}

// why: the hand-written content (places, circuits, providers) is only translated into these three; the
// other languages show the English text instead of an empty line
export const CONTENT_LANGUAGES = ['pt', 'en', 'es'] as const

export type Localized = Record<(typeof CONTENT_LANGUAGES)[number], string> &
  Partial<Record<Language, string>>

export function localized(text: Localized, language: Language): string {
  return text[language] ?? text.en
}

export function htmlLang(language: Language): string {
  return HTML_LANG[language]
}

export function detectLanguage(navigatorLanguage: string): Language {
  const tag = navigatorLanguage.trim().toLowerCase()
  if (tag.startsWith('en')) return 'en'
  if (tag.startsWith('es')) return 'es'
  if (tag.startsWith('fr')) return 'fr'
  if (tag.startsWith('de')) return 'de'
  if (tag.startsWith('it')) return 'it'
  return 'pt'
}

export function translate(
  language: Language,
  key: MessageKey,
  values?: Record<string, string>,
): string {
  const text = MESSAGES[language][key]
  if (!values) return text
  return text.replace(/\{(\w+)\}/g, (slot, name: string) => values[name] ?? slot)
}

const LOCALE: Record<Language, string> = {
  pt: 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  it: 'it-IT',
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export function formatToday(date: Date, language: Language): string {
  const locale = LOCALE[language]
  const weekday = capitalize(
    new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date).split('-')[0] ?? '',
  )
  const month = new Intl.DateTimeFormat(locale, { month: 'long' }).format(date)
  const day = date.getDate()
  switch (language) {
    case 'en':
      return `${weekday}, ${month} ${day}`
    case 'fr':
    case 'it':
      return `${weekday} ${day} ${month}`
    case 'de':
      return `${weekday}, ${day}. ${month}`
    default:
      return `${weekday}, ${day} de ${month}`
  }
}
