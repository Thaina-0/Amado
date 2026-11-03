import { describe, expect, it } from 'vitest'
import type { Language } from '../../../i18n/i18n'
import { EMERGENCY_NUMBERS, serviceNames, telHref, type ServiceId } from '../numbers'

describe('EMERGENCY_NUMBERS', () => {
  it('lists the five level 1 numbers', () => {
    expect(EMERGENCY_NUMBERS.map((n) => n.number)).toEqual(['190', '192', '193', '180', '199'])
  })

  it('has no duplicated numbers', () => {
    const numbers = EMERGENCY_NUMBERS.map((n) => n.number)
    expect(new Set(numbers).size).toBe(numbers.length)
  })
})

describe('telHref', () => {
  it('builds a one-tap tel: link', () => {
    expect(telHref('192')).toBe('tel:192')
  })
})

describe('names each service in every language', () => {
  const TABLE: [ServiceId, Language, string, string][] = [
    ['police', 'pt', 'Polícia Militar', 'Police, Policía'],
    ['police', 'en', 'Police', 'Polícia, Policía'],
    ['police', 'es', 'Policía', 'Police, Polícia'],
    ['ambulance', 'pt', 'SAMU, ambulância', 'Ambulance, Ambulancia'],
    ['ambulance', 'en', 'Ambulance', 'Ambulância, Ambulancia'],
    ['ambulance', 'es', 'Ambulancia', 'Ambulance, Ambulância'],
    ['fire', 'pt', 'Corpo de Bombeiros', 'Fire department, Bomberos'],
    ['fire', 'en', 'Fire department', 'Bombeiros, Bomberos'],
    ['fire', 'es', 'Bomberos', 'Fire department, Bombeiros'],
    [
      'women-violence',
      'pt',
      'Violência contra a mulher',
      'Violence against women, Violencia contra la mujer',
    ],
    [
      'women-violence',
      'en',
      'Violence against women',
      'Violência contra a mulher, Violencia contra la mujer',
    ],
    [
      'women-violence',
      'es',
      'Violencia contra la mujer',
      'Violence against women, Violência contra a mulher',
    ],
    ['civil-defense', 'pt', 'Defesa Civil', 'Civil defense, Defensa Civil'],
    ['civil-defense', 'en', 'Civil defense', 'Defesa Civil, Defensa Civil'],
    ['civil-defense', 'es', 'Defensa Civil', 'Civil defense, Defesa Civil'],
    ['police', 'fr', 'Police', 'Polícia, Police'],
    ['police', 'de', 'Polizei', 'Polícia, Police'],
    ['police', 'it', 'Polizia', 'Polícia, Police'],
    ['ambulance', 'fr', 'Ambulance', 'Ambulância, Ambulance'],
    ['ambulance', 'de', 'Rettungsdienst', 'Ambulância, Ambulance'],
    ['ambulance', 'it', 'Ambulanza', 'Ambulância, Ambulance'],
    ['fire', 'fr', 'Pompiers', 'Bombeiros, Fire department'],
    ['fire', 'de', 'Feuerwehr', 'Bombeiros, Fire department'],
    ['fire', 'it', 'Vigili del fuoco', 'Bombeiros, Fire department'],
    [
      'women-violence',
      'fr',
      'Violences faites aux femmes',
      'Violência contra a mulher, Violence against women',
    ],
    [
      'women-violence',
      'de',
      'Gewalt gegen Frauen',
      'Violência contra a mulher, Violence against women',
    ],
    [
      'women-violence',
      'it',
      'Violenza contro le donne',
      'Violência contra a mulher, Violence against women',
    ],
    ['civil-defense', 'fr', 'Protection civile', 'Defesa Civil, Civil defense'],
    ['civil-defense', 'de', 'Katastrophenschutz', 'Defesa Civil, Civil defense'],
    ['civil-defense', 'it', 'Protezione civile', 'Defesa Civil, Civil defense'],
  ]

  it.each(TABLE)('%s in %s is %j with the second line %j', (service, language, title, subtitle) => {
    expect(serviceNames(service, language)).toEqual({ title, subtitle })
  })

  it('covers every service of the level 1 table', () => {
    const covered = new Set(TABLE.map(([service]) => service))
    expect([...covered].sort()).toEqual(EMERGENCY_NUMBERS.map((n) => n.service).sort())
  })
})
