import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderApp, resetBrowser, seedPreferences } from '../../../test-utils/app'
import { getSession, signIn, signOut } from '../../account/session'

beforeEach(() => {
  resetBrowser()
  signOut()
})

const welcome = () => screen.getByRole('heading', { level: 1, name: 'Bem-vindo ao Amado' })

describe('Boas-vindas', () => {
  it('lets the visitor pick the language on the first screen, from a list of six', async () => {
    renderApp()
    const menu = screen.getByRole('button', { name: 'Escolha o idioma: Português' })
    expect(menu).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(menu)
    expect(menu).toHaveAttribute('aria-expanded', 'true')
    const options = within(
      screen.getByRole('radiogroup', { name: 'Escolha o idioma' }),
    ).getAllByRole('radio')
    expect(options.map((option) => option.textContent)).toEqual([
      'Português',
      'English',
      'Español',
      'Français',
      'Deutsch',
      'Italiano',
    ])
    await userEvent.click(screen.getByRole('radio', { name: 'English' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Welcome to Amado' })).toBeInTheDocument()
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Choose your language: English' })).toHaveFocus()
    expect(document.documentElement.lang).toBe('en')
    expect(JSON.parse(window.localStorage.getItem('amado.preferences.v1') ?? '{}').language).toBe(
      'en',
    )
  })

  it('closes the language list with Escape and keeps the language', async () => {
    renderApp()
    await userEvent.click(screen.getByRole('button', { name: 'Escolha o idioma: Português' }))
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument()
    expect(welcome()).toBeInTheDocument()
  })

  it('asks the person to log in or create an account, and offers to go on without one', () => {
    renderApp()
    expect(welcome()).toBeInTheDocument()
    expect(screen.getByText('Ilhéus contada por quem ama')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Fazer login' })).toHaveAttribute('href', '#/entrar')
    expect(screen.getByRole('link', { name: 'Criar uma conta' })).toHaveAttribute(
      'href',
      '#/cadastro',
    )
    expect(screen.getByRole('button', { name: 'Continuar sem conta' })).toBeInTheDocument()
  })

  it('announces Google sign-in as coming soon, disabled, and clicking it does nothing', async () => {
    renderApp()
    const google = screen.getByRole('button', { name: /Continuar com o Google/ })
    expect(google).toHaveAttribute('aria-disabled', 'true')
    expect(google).toHaveTextContent('Em breve')
    const before = window.location.hash
    await userEvent.click(google)
    expect(window.location.hash).toBe(before)
    expect(welcome()).toBeInTheDocument()
    expect(getSession()).toBeNull()
  })

  it('keeps the emergency numbers one tap away without an account', async () => {
    renderApp()
    await userEvent.click(screen.getByRole('link', { name: 'Emergência' }))
    await waitFor(() => expect(window.location.hash).toBe('#/emergencia'))
    expect(screen.getByRole('link', { name: /190/ })).toHaveAttribute('href', 'tel:190')
  })

  it('Fazer login opens the login and Criar uma conta opens the signup', async () => {
    seedPreferences()
    const first = renderApp()
    await userEvent.click(screen.getByRole('link', { name: 'Fazer login' }))
    await waitFor(() => expect(window.location.hash).toBe('#/entrar'))
    first.unmount()

    renderApp()
    await userEvent.click(screen.getByRole('link', { name: 'Criar uma conta' }))
    await waitFor(() => expect(window.location.hash).toBe('#/cadastro'))
  })

  it('Continuar sem conta goes to Idioma on the first visit and to Início afterwards', async () => {
    const first = renderApp()
    await userEvent.click(screen.getByRole('button', { name: 'Continuar sem conta' }))
    await waitFor(() => expect(window.location.hash).toBe('#/idioma'))
    first.unmount()

    seedPreferences()
    renderApp()
    await userEvent.click(screen.getByRole('button', { name: 'Continuar sem conta' }))
    await waitFor(() => expect(window.location.hash).toBe('#/inicio'))
  })

  it('does not show to someone who is signed in', async () => {
    seedPreferences()
    signIn('Maria')
    renderApp('#/boas-vindas')
    await waitFor(() => expect(window.location.hash).toBe('#/inicio'))
  })

  it('comes back after logout and again after a reload, since nobody is signed in', async () => {
    seedPreferences()
    signIn('Maria')
    const first = renderApp('#/conta')
    await userEvent.click(await screen.findByRole('button', { name: 'Sair' }))
    await waitFor(() => expect(window.location.hash).toBe('#/boas-vindas'))
    expect(welcome()).toBeInTheDocument()
    first.unmount()

    renderApp(window.location.hash)
    expect(welcome()).toBeInTheDocument()
  })

  it('shows in the chosen language', () => {
    seedPreferences({ language: 'en' })
    renderApp()
    expect(screen.getByRole('heading', { level: 1, name: 'Welcome to Amado' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Sign in' })).toBeInTheDocument()
  })
})
