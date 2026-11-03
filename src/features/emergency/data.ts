import type { Language } from '../../i18n/i18n'
import type { EmergencyPlace } from './places'
import type { EmergencyNumber, ServiceId } from './numbers'

// invariant: Level 1 is free, verified, never sponsored and kept in code so it works offline
export const EMERGENCY_NUMBERS: readonly EmergencyNumber[] = [
  { number: '190', service: 'police' },
  { number: '192', service: 'ambulance' },
  { number: '193', service: 'fire' },
  { number: '180', service: 'women-violence' },
  { number: '199', service: 'civil-defense' },
]

export const TITLE: Record<ServiceId, Record<Language, string>> = {
  police: {
    pt: 'Polícia Militar',
    en: 'Police',
    es: 'Policía',
    fr: 'Police',
    de: 'Polizei',
    it: 'Polizia',
  },
  ambulance: {
    pt: 'SAMU, ambulância',
    en: 'Ambulance',
    es: 'Ambulancia',
    fr: 'Ambulance',
    de: 'Rettungsdienst',
    it: 'Ambulanza',
  },
  fire: {
    pt: 'Corpo de Bombeiros',
    en: 'Fire department',
    es: 'Bomberos',
    fr: 'Pompiers',
    de: 'Feuerwehr',
    it: 'Vigili del fuoco',
  },
  'women-violence': {
    pt: 'Violência contra a mulher',
    en: 'Violence against women',
    es: 'Violencia contra la mujer',
    fr: 'Violences faites aux femmes',
    de: 'Gewalt gegen Frauen',
    it: 'Violenza contro le donne',
  },
  'civil-defense': {
    pt: 'Defesa Civil',
    en: 'Civil defense',
    es: 'Defensa Civil',
    fr: 'Protection civile',
    de: 'Katastrophenschutz',
    it: 'Protezione civile',
  },
}

export const SHORT: Record<ServiceId, Record<Language, string>> = {
  police: { ...TITLE.police, pt: 'Polícia' },
  ambulance: { ...TITLE.ambulance, pt: 'Ambulância' },
  fire: { ...TITLE.fire, pt: 'Bombeiros' },
  'women-violence': TITLE['women-violence'],
  'civil-defense': TITLE['civil-defense'],
}

// hazard: TODO(verify): ships empty (AD-002); add a place only with a source the team has checked, never invent a name, phone or coordinate
// hazard: TODO(verify): the foreigners' police desk (Polícia Federal in Ilhéus) is wanted here, but the only address found is a third-party directory (Av. Esperança, 11, Malhado) and the PF plans a move; it needs a confirmed name, phone, address, coordinate, source and date, plus a category that PLACE_CATEGORIES does not have yet
export const EMERGENCY_PLACES: readonly EmergencyPlace[] = []

export interface AttendantPhrase {
  id: string
  text: Record<Language, string>
}

// hazard: TODO(verify): the translations were written by the Amado assistant and still need a review by a native speaker or the team
// invariant: `pt` is the sentence the attendant reads, so every phrase keeps its Portuguese text short and literal
export const ATTENDANT_PHRASES: readonly AttendantPhrase[] = [
  {
    id: 'ambulance',
    text: {
      pt: 'Preciso de uma ambulância.',
      en: 'I need an ambulance.',
      es: 'Necesito una ambulancia.',
      fr: 'J’ai besoin d’une ambulance.',
      de: 'Ich brauche einen Krankenwagen.',
      it: 'Ho bisogno di un’ambulanza.',
    },
  },
  {
    id: 'police',
    text: {
      pt: 'Preciso da polícia.',
      en: 'I need the police.',
      es: 'Necesito a la policía.',
      fr: 'J’ai besoin de la police.',
      de: 'Ich brauche die Polizei.',
      it: 'Ho bisogno della polizia.',
    },
  },
  {
    id: 'fire',
    text: {
      pt: 'Preciso dos bombeiros.',
      en: 'I need the fire department.',
      es: 'Necesito a los bomberos.',
      fr: 'J’ai besoin des pompiers.',
      de: 'Ich brauche die Feuerwehr.',
      it: 'Ho bisogno dei vigili del fuoco.',
    },
  },
  {
    id: 'doctor',
    text: {
      pt: 'Estou passando mal e preciso de um médico.',
      en: 'I feel very ill and need a doctor.',
      es: 'Me siento muy mal y necesito un médico.',
      fr: 'Je me sens très mal et j’ai besoin d’un médecin.',
      de: 'Mir geht es sehr schlecht und ich brauche einen Arzt.',
      it: 'Mi sento molto male e ho bisogno di un medico.',
    },
  },
  {
    id: 'allergy',
    text: {
      pt: 'Tenho uma alergia grave. Preciso de atendimento médico.',
      en: 'I have a severe allergy. I need medical care.',
      es: 'Tengo una alergia grave. Necesito atención médica.',
      fr: 'J’ai une allergie grave. J’ai besoin de soins médicaux.',
      de: 'Ich habe eine schwere Allergie. Ich brauche ärztliche Hilfe.',
      it: 'Ho una grave allergia. Ho bisogno di assistenza medica.',
    },
  },
  {
    id: 'robbery',
    text: {
      pt: 'Fui vítima de um assalto.',
      en: 'I have been robbed.',
      es: 'Me han asaltado.',
      fr: 'J’ai été victime d’une agression.',
      de: 'Ich wurde überfallen.',
      it: 'Sono stato vittima di una rapina.',
    },
  },
  {
    id: 'lost',
    text: {
      pt: 'Estou perdido(a) e preciso de ajuda.',
      en: 'I am lost and need help.',
      es: 'Estoy perdido y necesito ayuda.',
      fr: 'Je suis perdu et j’ai besoin d’aide.',
      de: 'Ich habe mich verirrt und brauche Hilfe.',
      it: 'Mi sono perso e ho bisogno di aiuto.',
    },
  },
  {
    id: 'address',
    text: {
      pt: 'Qual é o endereço deste lugar?',
      en: 'What is the address of this place?',
      es: '¿Cuál es la dirección de este lugar?',
      fr: 'Quelle est l’adresse de ce lieu ?',
      de: 'Wie lautet die Adresse dieses Ortes?',
      it: 'Qual è l’indirizzo di questo luogo?',
    },
  },
  {
    id: 'no-portuguese',
    text: {
      pt: 'Não falo português. Fale devagar, por favor.',
      en: 'I do not speak Portuguese. Please speak slowly.',
      es: 'No hablo portugués. Hable despacio, por favor.',
      fr: 'Je ne parle pas portugais. Parlez lentement, s’il vous plaît.',
      de: 'Ich spreche kein Portugiesisch. Bitte sprechen Sie langsam.',
      it: 'Non parlo portoghese. Parli lentamente, per favore.',
    },
  },
]
