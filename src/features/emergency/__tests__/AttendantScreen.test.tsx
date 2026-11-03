import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { I18nProvider } from '../../../i18n/I18nProvider'
import { LANGUAGES } from '../../../i18n/i18n'
import { renderApp, resetBrowser } from '../../../test-utils/app'
import { AttendantScreen } from '../AttendantScreen'
import { ATTENDANT_PHRASES } from '../data'

beforeEach(() => resetBrowser())

describe('ATTENDANT_PHRASES', () => {
  it('has every phrase in the six languages, with no empty text', () => {
    expect(ATTENDANT_PHRASES.length).toBeGreaterThanOrEqual(8)
    for (const phrase of ATTENDANT_PHRASES) {
      for (const language of LANGUAGES) {
        expect(phrase.text[language].trim().length, `${phrase.id} ${language}`).toBeGreaterThan(5)
      }
    }
  })

  it('has unique ids', () => {
    const ids = ATTENDANT_PHRASES.map((phrase) => phrase.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('invents no number, address or place', () => {
    for (const phrase of ATTENDANT_PHRASES) {
      for (const language of LANGUAGES) expect(phrase.text[language]).not.toMatch(/\d/)
    }
  })
})

describe('AttendantScreen', () => {
  it('shows each phrase in large Portuguese, tagged as Portuguese, and the review notice', () => {
    render(<AttendantScreen />)
    expect(screen.getByRole('heading', { level: 1, name: 'Mostrar ao atendente' })).toBeVisible()
    const list = screen.getByRole('list', { name: 'Frases de emergência' })
    const items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(ATTENDANT_PHRASES.length)
    expect(within(list).getByText('Preciso de uma ambulância.')).toHaveAttribute('lang', 'pt-BR')
    expect(screen.getByText(/Frases em revisão pela equipe do Amado/)).toBeInTheDocument()
  })

  it('adds the translation in the language of the screen under each Portuguese line', () => {
    render(
      <I18nProvider language="de">
        <AttendantScreen />
      </I18nProvider>,
    )
    expect(screen.getByText('Preciso de uma ambulância.')).toBeInTheDocument()
    expect(screen.getByText('Ich brauche einen Krankenwagen.')).toBeInTheDocument()
  })

  it('does not repeat the line when the screen is already in Portuguese', () => {
    render(<AttendantScreen />)
    expect(screen.getAllByText('Preciso da polícia.')).toHaveLength(1)
  })
})

describe('Mostrar ao atendente, in the app', () => {
  it('opens from Emergência, keeps the Emergência tab and goes back to it', async () => {
    renderApp('#/emergencia')
    await userEvent.click(screen.getByRole('link', { name: /Mostrar ao atendente/ }))
    await waitFor(() => expect(window.location.hash).toBe('#/emergencia/mostrar'))
    expect(screen.getByRole('link', { name: 'Emergência' })).toHaveAttribute('aria-current', 'page')
    await userEvent.click(screen.getByRole('button', { name: 'Voltar' }))
    await waitFor(() => expect(window.location.hash).toBe('#/emergencia'))
  })

  it('opens on a first visit, before any sign-in, with no account', () => {
    renderApp('#/emergencia/mostrar')
    expect(window.location.hash).toBe('#/emergencia/mostrar')
    expect(screen.getByRole('heading', { level: 1, name: 'Mostrar ao atendente' })).toBeVisible()
  })
})
