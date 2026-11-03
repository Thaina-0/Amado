import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { memoryStorage, renderWithPreferences, resetBrowser } from '../../../test-utils/app'
import { STORAGE_KEY } from '../../../preferences/preferences'
import { ProfileScreen } from '../ProfileScreen'

beforeEach(() => resetBrowser())
afterEach(() => vi.restoreAllMocks())

describe('ProfileScreen', () => {
  it('shows the rows: Voltar, Idioma, the four appearance options and Privacidade', () => {
    renderWithPreferences(<ProfileScreen />)
    expect(screen.getByRole('heading', { level: 1, name: 'Perfil' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Voltar' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Idioma do app/ })).toHaveTextContent('Português')
    const options = within(screen.getByRole('radiogroup', { name: 'Aparência' })).getAllByRole(
      'radio',
    )
    expect(options.map((option) => option.textContent)).toEqual([
      'AutomáticoSegue o ajuste do aparelho',
      'ClaroFundo claro',
      'EscuroFundo escuro',
      'Alto contrasteCores mais fortes, para ler ao sol',
    ])
    expect(options[0]).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('link', { name: /Privacidade e dados/ })).toBeInTheDocument()
  })

  it('writes the language with its own name', () => {
    renderWithPreferences(<ProfileScreen />)
    expect(screen.getByRole('link', { name: /Idioma do app/ })).toHaveTextContent('Português')
  })

  it('the Idioma row links to Idioma', async () => {
    renderWithPreferences(<ProfileScreen />)
    const row = screen.getByRole('link', { name: /Idioma do app/ })
    expect(row).toHaveAttribute('href', '#/idioma')
    await userEvent.click(row)
    expect(window.location.hash).toBe('#/idioma')
  })

  describe('an appearance option', () => {
    it.each([
      ['Escuro', 'dark'],
      ['Alto contraste', 'contrast'],
      ['Claro', 'light'],
    ])('%s sets data-theme to %s, stores it and marks the option', async (label, theme) => {
      const { storage } = renderWithPreferences(<ProfileScreen />)
      const option = screen.getByRole('radio', { name: new RegExp(`^${label}`) })
      await userEvent.click(option)
      expect(option).toHaveAttribute('aria-checked', 'true')
      expect(document.documentElement.dataset.theme).toBe(theme)
      expect(JSON.parse(storage.data.get(STORAGE_KEY) ?? '{}')).toMatchObject({ theme })
      expect(screen.getByRole('radio', { name: /^Automático/ })).toHaveAttribute(
        'aria-checked',
        'false',
      )
    })

    it('Automático removes data-theme again', async () => {
      renderWithPreferences(<ProfileScreen />)
      await userEvent.click(screen.getByRole('radio', { name: /^Escuro/ }))
      expect(document.documentElement.dataset.theme).toBe('dark')
      await userEvent.click(screen.getByRole('radio', { name: /^Automático/ }))
      expect(document.documentElement.dataset.theme).toBeUndefined()
    })
  })

  it('the Privacidade row links to Privacidade e dados', async () => {
    renderWithPreferences(<ProfileScreen />)
    const row = screen.getByRole('link', { name: /Privacidade e dados/ })
    expect(row).toHaveAttribute('href', '#/privacidade')
    await userEvent.click(row)
    expect(window.location.hash).toBe('#/privacidade')
  })

  describe('Voltar', () => {
    it('returns to the previous screen', async () => {
      window.history.pushState(null, '', '#/inicio')
      window.history.pushState(null, '', '#/perfil')
      const back = vi.spyOn(window.history, 'back').mockImplementation(() => undefined)
      renderWithPreferences(<ProfileScreen />)
      await userEvent.click(screen.getByRole('button', { name: 'Voltar' }))
      expect(back).toHaveBeenCalledTimes(1)
    })

    it('goes to Início when there is no previous screen', async () => {
      vi.spyOn(window.history, 'length', 'get').mockReturnValue(1)
      renderWithPreferences(<ProfileScreen />)
      await userEvent.click(screen.getByRole('button', { name: 'Voltar' }))
      expect(window.location.hash).toBe('#/inicio')
    })
  })
})

describe('ProfileScreen language name', () => {
  it.each([
    ['en', 'English'],
    ['es', 'Español'],
    ['pt', 'Português'],
  ] as const)('writes the Idioma row with its own name: %s is %s', (language, name) => {
    const storage = memoryStorage()
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({ language, theme: 'auto', onboarding: 'done', countVisit: false }),
    )
    renderWithPreferences(<ProfileScreen />, storage)
    expect(screen.getByRole('link', { name: new RegExp(name) })).toHaveTextContent(name)
  })
})
