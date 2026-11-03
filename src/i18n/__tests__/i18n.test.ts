import { describe, expect, it } from 'vitest'
import { detectLanguage, formatToday, LANGUAGES, localized, MESSAGES, translate } from '../i18n'

describe('i18n', () => {
  it.each([
    ['en-US', 'en'],
    ['es-419', 'es'],
    ['ES', 'es'],
    ['pt-BR', 'pt'],
    ['fr-CA', 'fr'],
    ['de-AT', 'de'],
    ['it', 'it'],
    ['ja', 'pt'],
    ['', 'pt'],
  ])('detects the language of %j as %s', (navigatorLanguage, expected) => {
    expect(detectLanguage(navigatorLanguage)).toBe(expected)
  })

  it('has a text in every language for every key', () => {
    const keys = Object.keys(MESSAGES.pt)
    expect(keys.length).toBeGreaterThan(40)
    for (const language of LANGUAGES) {
      expect(Object.keys(MESSAGES[language]).sort(), language).toEqual([...keys].sort())
      for (const key of keys) {
        const text = (MESSAGES[language] as Record<string, string>)[key]
        expect(text?.trim(), `${language}:${key}`).toBeTruthy()
      }
    }
  })

  it.each([
    [new Date(2026, 9, 28), 'pt', 'Quarta, 28 de outubro'],
    [new Date(2026, 9, 28), 'en', 'Wednesday, October 28'],
    [new Date(2026, 9, 28), 'es', 'Miércoles, 28 de octubre'],
    [new Date(2026, 9, 28), 'fr', 'Mercredi 28 octobre'],
    [new Date(2026, 9, 28), 'de', 'Mittwoch, 28. Oktober'],
    [new Date(2026, 9, 28), 'it', 'Mercoledì 28 ottobre'],
    [new Date(2026, 0, 1), 'pt', 'Quinta, 1 de janeiro'],
  ] as const)('formats today %s in %s as %s', (date, language, expected) => {
    expect(formatToday(date, language)).toBe(expected)
  })

  it('falls back to English for hand-written content that has no translation yet', () => {
    const text = { pt: 'Olá', en: 'Hello', es: 'Hola' }
    expect(localized(text, 'es')).toBe('Hola')
    expect(localized(text, 'fr')).toBe('Hello')
    expect(localized({ ...text, fr: 'Bonjour' }, 'fr')).toBe('Bonjour')
  })

  it('keeps the same {slots} in every language of a message', () => {
    const slots = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort().join()
    for (const language of LANGUAGES) {
      for (const key of Object.keys(MESSAGES.pt) as (keyof typeof MESSAGES.pt)[]) {
        expect(slots(MESSAGES[language][key]), `${language}:${key}`).toBe(slots(MESSAGES.pt[key]))
      }
    }
  })

  it('fills the {name} slot of a message', () => {
    expect(translate('es', 'emergency.callTo', { name: 'Hospital X' })).toBe('Llamar a Hospital X')
  })
})
