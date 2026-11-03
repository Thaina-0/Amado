import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mockGeolocation } from '../../../test-utils/geolocation'
import {
  mockPermission,
  renderApp,
  resetBrowser,
  seedPreferences,
  storedPreferences,
} from '../../../test-utils/app'

let geo: ReturnType<typeof mockGeolocation>

beforeEach(() => {
  resetBrowser()
  geo = mockGeolocation()
  mockPermission(undefined)
})

afterEach(() => {
  Reflect.deleteProperty(navigator, 'geolocation')
})

describe('onboarding', () => {
  it('shows the three titles in every language and the hint in the chosen one', async () => {
    renderApp('#/idioma')
    const titles = () => [
      screen.getByRole('heading', { name: 'Escolha o idioma' }),
      screen.getByText('Choose your language'),
      screen.getByText('Elige tu idioma'),
      screen.getByText('Choisissez votre langue'),
      screen.getByText('Sprache wählen'),
      screen.getByText('Scegli la tua lingua'),
    ]
    expect(titles()).toHaveLength(6)
    await userEvent.click(screen.getByRole('radio', { name: 'English' }))
    expect(titles()).toHaveLength(6)
    expect(screen.getByText('You can change this later, in your profile.')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('radio', { name: 'Español' }))
    expect(titles()).toHaveLength(6)
  })

  it('lists the six languages and applies the chosen one to the screen and to the page', async () => {
    renderApp('#/idioma')
    const options = within(screen.getByRole('radiogroup')).getAllByRole('radio')
    expect(options.map((option) => option.textContent)).toEqual([
      'Português',
      'English',
      'Español',
      'Français',
      'Deutsch',
      'Italiano',
    ])
    await userEvent.click(screen.getByRole('radio', { name: 'Deutsch' }))
    expect(screen.getByRole('radio', { name: 'Deutsch' })).toBeChecked()
    expect(screen.getByRole('button', { name: 'Weiter' })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('de')
    await userEvent.click(screen.getByRole('button', { name: 'Weiter' }))
    await waitFor(() => expect(window.location.hash).toBe('#/localizacao'))
    expect(storedPreferences()?.language).toBe('de')
  })

  it('Continuar stores the language and shows Localização', async () => {
    renderApp('#/idioma')
    await userEvent.click(screen.getByRole('radio', { name: 'English' }))
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }))
    await waitFor(() => expect(window.location.hash).toBe('#/localizacao'))
    expect(
      screen.getByRole('heading', { level: 1, name: 'Show what is near you' }),
    ).toBeInTheDocument()
    expect(storedPreferences()?.language).toBe('en')
  })

  describe('Emergência shortcut', () => {
    it('on Idioma shows Emergência and leaves onboarding pending', async () => {
      renderApp('#/idioma')
      await userEvent.click(screen.getByRole('link', { name: 'Emergência' }))
      await waitFor(() => expect(window.location.hash).toBe('#/emergencia'))
      expect(screen.getByRole('heading', { level: 1, name: 'Emergência' })).toBeInTheDocument()
      expect(storedPreferences()?.onboarding ?? 'pending').toBe('pending')
    })

    it('on Localização shows Emergência and leaves onboarding pending', async () => {
      renderApp('#/localizacao')
      await userEvent.click(screen.getByRole('link', { name: 'Emergência' }))
      await waitFor(() => expect(window.location.hash).toBe('#/emergencia'))
      expect(storedPreferences()?.onboarding ?? 'pending').toBe('pending')
    })
  })

  it('Permitir localização asks the browser once and stores countVisit true when granted', async () => {
    renderApp('#/localizacao')
    await userEvent.click(screen.getByRole('button', { name: 'Permitir localização' }))
    expect(geo.getCurrentPosition).toHaveBeenCalledTimes(1)
    geo.resolve()
    await waitFor(() => expect(window.location.hash).toBe('#/inicio'))
    expect(storedPreferences()).toMatchObject({ onboarding: 'done', countVisit: true })
  })

  it('Permitir localização stores countVisit false when the browser denies', async () => {
    renderApp('#/localizacao')
    await userEvent.click(screen.getByRole('button', { name: 'Permitir localização' }))
    geo.deny()
    await waitFor(() => expect(window.location.hash).toBe('#/inicio'))
    expect(storedPreferences()).toMatchObject({ onboarding: 'done', countVisit: false })
  })

  it('Agora não stores done and false, does not ask the browser and shows Início', async () => {
    renderApp('#/localizacao')
    await userEvent.click(screen.getByRole('button', { name: 'Agora não' }))
    await waitFor(() => expect(window.location.hash).toBe('#/inicio'))
    expect(geo.getCurrentPosition).not.toHaveBeenCalled()
    expect(storedPreferences()).toMatchObject({ onboarding: 'done', countVisit: false })
    expect(screen.getByRole('heading', { level: 1, name: 'Hoje em Ilhéus' })).toBeInTheDocument()
  })

  it('Idioma from Perfil shows no shortcut and Continuar returns to Perfil', async () => {
    seedPreferences()
    renderApp('#/perfil')
    await userEvent.click(screen.getByRole('link', { name: /Idioma do app/ }))
    await waitFor(() => expect(window.location.hash).toBe('#/idioma'))
    expect(screen.queryByRole('link', { name: 'Abrir perfil' })).toBeNull()
    expect(screen.getByRole('navigation', { name: 'Navegação principal' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('radio', { name: 'English' }))
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }))
    await waitFor(() => expect(window.location.hash).toBe('#/perfil'))
    expect(storedPreferences()?.language).toBe('en')
    expect(screen.getByRole('heading', { level: 1, name: 'Profile' })).toBeInTheDocument()
  })
})
