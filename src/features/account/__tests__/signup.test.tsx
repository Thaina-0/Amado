import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { LANGUAGES, MESSAGES } from '../../../i18n/i18n'
import {
  renderApp,
  resetBrowser,
  seedPreferences,
  storedPreferences,
} from '../../../test-utils/app'
import { answeredCount, parseProfile, PROFILE_QUESTIONS, PROFILE_TOTAL } from '../profile'
import { getSession, SESSION_KEY, signOut } from '../session'
import { saveTravelProfile, TRAVEL_PROFILE_KEY } from '../travelProfile'

beforeEach(() => {
  resetBrowser()
  seedPreferences()
  signOut()
  saveTravelProfile({})
})

const group = (name: string) => screen.getByRole('radiogroup', { name })

describe('profile data', () => {
  it('has a label for every question and option in the three languages', () => {
    for (const language of LANGUAGES) {
      const messages = MESSAGES[language] as Record<string, string>
      for (const [id, options] of Object.entries(PROFILE_QUESTIONS)) {
        expect(messages[`signup.q.${id}`], `${language} q ${id}`).toBeTruthy()
        for (const option of options) {
          expect(messages[`signup.o.${id}.${option}`], `${language} ${id}.${option}`).toBeTruthy()
        }
      }
    }
  })

  it('keeps only known buckets and drops anything else, free text included', () => {
    expect(
      parseProfile({
        origin: 'bahia',
        age: '1990-04-12',
        reason: 'Maria Souza',
        email: 'maria@exemplo.com',
        interests: ['praias', 'bogus', 'esportes'],
      }),
    ).toEqual({ origin: 'bahia', interests: ['praias', 'esportes'] })
    expect(parseProfile(null)).toEqual({})
    expect(parseProfile([])).toEqual({})
  })

  it('counts the answered questions', () => {
    expect(answeredCount(undefined)).toBe(0)
    expect(answeredCount({ origin: 'bahia', interests: ['praias'] })).toBe(2)
    expect(PROFILE_TOTAL).toBe(7)
  })
})

describe('Cadastro', () => {
  it('is reached from the login and says what the questions are for and that they are optional', async () => {
    renderApp('#/entrar')
    await userEvent.click(
      screen.getByRole('link', { name: 'Ainda não tem cadastro? Criar cadastro' }),
    )
    await waitFor(() => expect(window.location.hash).toBe('#/cadastro'))
    expect(screen.getByRole('heading', { level: 1, name: 'Criar cadastro' })).toBeInTheDocument()
    expect(screen.getByText('Para que servem as perguntas')).toBeInTheDocument()
    expect(screen.getByText(/nada sai do seu aparelho/)).toBeInTheDocument()
    expect(
      screen.getByText(/Não pedimos CPF, telefone, e-mail nem localização/),
    ).toBeInTheDocument()
    expect(screen.getByText(/Opcional\. Responda só o que quiser/)).toBeInTheDocument()
  })

  it('asks for the first name and nothing else before it lets anyone in', async () => {
    renderApp('#/cadastro')
    await userEvent.click(screen.getByRole('button', { name: 'Criar cadastro' }))
    expect(screen.getByText('Digite o seu primeiro nome.')).toBeInTheDocument()
    expect(screen.getByLabelText('Como podemos te chamar?')).toHaveAttribute('aria-invalid', 'true')
    expect(getSession()).toBeNull()
    expect(window.location.hash).toBe('#/cadastro')
  })

  it('creates the account with only the name when no question is answered', async () => {
    renderApp('#/cadastro')
    await userEvent.type(screen.getByLabelText('Como podemos te chamar?'), 'Maria')
    await userEvent.click(screen.getByRole('button', { name: 'Criar cadastro' }))
    await waitFor(() => expect(window.location.hash).toBe('#/conta'))
    expect(JSON.parse(window.localStorage.getItem(SESSION_KEY) ?? '')).toEqual({ name: 'Maria' })
  })

  it('stores the chosen buckets and the interests, and lets an answer be taken back', async () => {
    renderApp('#/cadastro')
    await userEvent.type(screen.getByLabelText('Como podemos te chamar?'), 'Maria')
    await userEvent.click(
      within(group('De onde você vem?')).getByRole('radio', { name: 'Outra cidade da Bahia' }),
    )
    await userEvent.click(
      within(group('Com quem você viaja?')).getByRole('radio', { name: 'Em casal' }),
    )
    await userEvent.click(
      within(group('Com quem você viaja?')).getByRole('radio', { name: 'Em casal' }),
    )
    await userEvent.click(screen.getByRole('button', { name: 'Praias' }))
    await userEvent.click(screen.getByRole('button', { name: 'Esportes' }))
    await userEvent.click(screen.getByRole('button', { name: 'Praias' }))
    await userEvent.click(screen.getByRole('button', { name: 'Criar cadastro' }))
    await waitFor(() => expect(window.location.hash).toBe('#/conta'))
    expect(JSON.parse(window.localStorage.getItem(SESSION_KEY) ?? '')).toEqual({
      name: 'Maria',
      profile: { origin: 'bahia', interests: ['esportes'] },
    })
  })

  it('does not count the answers in the group data unless the person turns it on', async () => {
    renderApp('#/cadastro')
    const toggle = screen.getByRole('switch', {
      name: /Contar minhas respostas nos dados de grupo/,
    })
    expect(toggle).toHaveAttribute('aria-checked', 'false')
    await userEvent.type(screen.getByLabelText('Como podemos te chamar?'), 'Maria')
    await userEvent.click(screen.getByRole('button', { name: 'Criar cadastro' }))
    await waitFor(() => expect(window.location.hash).toBe('#/conta'))
    expect(storedPreferences()?.countVisit).toBe(false)
  })

  it('turns on the shared group-data setting when the person agrees', async () => {
    renderApp('#/cadastro')
    await userEvent.click(screen.getByRole('switch', { name: /Contar minhas respostas/ }))
    await userEvent.type(screen.getByLabelText('Como podemos te chamar?'), 'Maria')
    await userEvent.click(screen.getByRole('button', { name: 'Criar cadastro' }))
    await waitFor(() => expect(window.location.hash).toBe('#/conta'))
    expect(storedPreferences()?.countVisit).toBe(true)
  })

  it('collects no e-mail, phone or password', () => {
    renderApp('#/cadastro')
    expect(screen.queryByLabelText(/e-mail|senha|telefone|CPF/i)).toBeNull()
    expect(
      document.querySelector('input[type="password"], input[type="email"], input[type="tel"]'),
    ).toBeNull()
  })

  it('shows the progress in the account, reopens filled in Meu perfil de viagem and keeps the answers on sign out', async () => {
    renderApp('#/cadastro')
    await userEvent.type(screen.getByLabelText('Como podemos te chamar?'), 'Maria')
    await userEvent.click(
      within(group('Quanto tempo você fica em Ilhéus?')).getByRole('radio', { name: 'Só o dia' }),
    )
    await userEvent.click(screen.getByRole('button', { name: 'Criar cadastro' }))
    const row = await screen.findByRole('link', { name: /Meu perfil de viagem/ })
    expect(row).toHaveTextContent('1 de 7 respondidas')
    await userEvent.click(row)
    await waitFor(() => expect(window.location.hash).toBe('#/perfil-de-viagem'))
    expect(
      screen.getByRole('heading', { level: 1, name: 'Meu perfil de viagem' }),
    ).toBeInTheDocument()
    expect(
      within(group('Quanto tempo você fica em Ilhéus?')).getByRole('radio', { name: 'Só o dia' }),
    ).toHaveAttribute('aria-checked', 'true')
    window.location.hash = '#/conta'
    await userEvent.click(await screen.findByRole('button', { name: 'Sair' }))
    await waitFor(() => expect(window.location.hash).toBe('#/boas-vindas'))
    expect(window.localStorage.getItem(SESSION_KEY)).toBeNull()
    expect(window.localStorage.getItem(TRAVEL_PROFILE_KEY)).toContain('"stay":"day"')
  })

  it('invites to answer when nothing was answered yet', async () => {
    renderApp('#/entrar')
    await userEvent.type(screen.getByLabelText('E-mail'), 'maria@exemplo.com')
    await userEvent.type(screen.getByLabelText('Senha'), 'x')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    const row = await screen.findByRole('link', { name: /Meu perfil de viagem/ })
    expect(row).toHaveTextContent('Opcional. Responda para ajudar a planejar o destino')
  })
})
