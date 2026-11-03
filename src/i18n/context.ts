import { createContext, useContext } from 'react'
import { translate, type Language, type MessageKey } from './i18n'

export interface I18n {
  language: Language
  t: (key: MessageKey, values?: Record<string, string>) => string
}

const DEFAULT: I18n = { language: 'pt', t: (key, values) => translate('pt', key, values) }

export const I18nContext = createContext<I18n>(DEFAULT)

export function useI18n(): I18n {
  return useContext(I18nContext)
}
