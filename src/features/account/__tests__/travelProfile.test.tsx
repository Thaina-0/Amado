import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderApp, resetBrowser, seedPreferences } from '../../../test-utils/app'
import { canPlan, EXTRA_QUESTIONS, PLAN_QUESTIONS } from '../profile'
import { signIn, signOut } from '../session'
import { getTravelProfile, saveTravelProfile, TRAVEL_PROFILE_KEY } from '../travelProfile'

const group = (name: string) => screen.getByRole('radiogroup', { name })
const STAY = 'Quanto tempo você fica em Ilhéus?'
const heading = (name: string) => screen.getByRole('heading', { level: 1, name })

beforeEach(() => {
  resetBrowser()
  seedPreferences()
  signOut()
  saveTravelProfile({})
})

describe('travel profile store', () => {
  it('starts empty and keeps what is saved on the device only', () => {
    expect(getTravelProfile()).toEqual({})
    saveTravelProfile({ stay: 'short', interests: ['praias'] })
    expect(getTravelProfile()).toEqual({ stay: 'short', interests: ['praias'] })
    expect(JSON.parse(window.localStorage.getItem(TRAVEL_PROFILE_KEY) ?? '{}')).toEqual({
      stay: 'short',
      interests: ['praias'],
    })
  })

  it('keeps only known buckets, with no free text, e-mail or name', () => {
    saveTravelProfile({
      stay: 'day',
      age: '1990-04-12',
      email: 'maria@exemplo.com',
      name: 'Maria',
    } as never)
    expect(getTravelProfile()).toEqual({ stay: 'day' })
    expect(window.localStorage.getItem(TRAVEL_PROFILE_KEY)).not.toMatch(/maria|1990/i)
  })

  it('forgets everything when saved empty, and ignores a damaged store', () => {
    saveTravelProfile({ stay: 'day' })
    saveTravelProfile({})
    expect(window.localStorage.getItem(TRAVEL_PROFILE_KEY)).toBeNull()
    window.localStorage.setItem(TRAVEL_PROFILE_KEY, '{not json')
    expect(getTravelProfile()).toEqual({})
  })

  it('can plan only from the answers that shape the plan', () => {
    expect(PLAN_QUESTIONS).toEqual(['stay', 'reason', 'party'])
    expect(EXTRA_QUESTIONS).toEqual(['origin', 'age', 'channel'])
    expect(canPlan({})).toBe(false)
    expect(canPlan(undefined)).toBe(false)
    expect(canPlan({ age: 'a30', origin: 'abroad', channel: 'qr' })).toBe(false)
    expect(canPlan({ stay: 'day' })).toBe(true)
    expect(canPlan({ party: 'alone' })).toBe(true)
    expect(canPlan({ interests: ['praias'] })).toBe(true)
  })
})

describe('Meu perfil de viagem', () => {
  it('opens without an account and says the answers stay on the device', () => {
    renderApp('#/perfil-de-viagem')
    expect(heading('Meu perfil de viagem')).toBeInTheDocument()
    expect(screen.getByText('Fica só neste aparelho')).toBeInTheDocument()
    expect(screen.getByText(/Não precisa de conta/)).toBeInTheDocument()
    expect(screen.queryByLabelText('Como podemos te chamar?')).toBeNull()
  })

  it('splits what shapes the roteiro from what only helps plan the destination', () => {
    renderApp('#/perfil-de-viagem')
    const plan = within(screen.getByRole('region', { name: 'Para montar o roteiro' }))
    expect(plan.getByRole('radiogroup', { name: STAY })).toBeInTheDocument()
    expect(plan.getByRole('group', { name: /O que você mais curte/ })).toBeInTheDocument()
    const extra = within(screen.getByRole('region', { name: 'Para ajudar a planejar o destino' }))
    expect(extra.getAllByRole('radiogroup')).toHaveLength(3)
    expect(extra.getByText(/não mudam o seu roteiro/)).toBeInTheDocument()
  })

  it('does not build a roteiro with nothing answered, and says what is missing', async () => {
    renderApp('#/perfil-de-viagem')
    await userEvent.click(screen.getByRole('button', { name: 'Montar meu roteiro' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Falta uma resposta')
    expect(window.location.hash).toBe('#/perfil-de-viagem')
    expect(getTravelProfile()).toEqual({})
  })

  it('does not count the answers that do not shape the plan', async () => {
    renderApp('#/perfil-de-viagem')
    await userEvent.click(
      within(group('Qual a sua faixa de idade? (18 anos ou mais)')).getByRole('radio', {
        name: '18 a 29 anos',
      }),
    )
    await userEvent.click(screen.getByRole('button', { name: 'Montar meu roteiro' }))
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(window.location.hash).toBe('#/perfil-de-viagem')
  })

  it('saves the answers and shows the roteiro made from them', async () => {
    renderApp('#/perfil-de-viagem')
    await userEvent.click(within(group(STAY)).getByRole('radio', { name: 'Só o dia' }))
    await userEvent.click(screen.getByRole('button', { name: 'Gastronomia' }))
    await userEvent.click(screen.getByRole('button', { name: 'Montar meu roteiro' }))
    await waitFor(() => expect(window.location.hash).toBe('#/meu-roteiro'))
    expect(heading('Meu roteiro')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Dia 1 · Gastronomia' })).toBeInTheDocument()
    expect(getTravelProfile()).toEqual({ stay: 'day', interests: ['gastronomia'] })
  })

  it('reopens with the saved answers and counts them', async () => {
    saveTravelProfile({ stay: 'week', interests: ['praias'] })
    renderApp('#/perfil-de-viagem')
    expect(within(group(STAY)).getByRole('radio', { name: /De 4 a 7 dias|4 a 7/ })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Praias' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('2 de 7 respondidas')).toBeInTheDocument()
  })

  it('clears the answers, and the roteiro asks for them again', async () => {
    saveTravelProfile({ stay: 'day', reason: 'food' })
    renderApp('#/perfil-de-viagem')
    await userEvent.click(screen.getByRole('button', { name: 'Limpar respostas' }))
    expect(getTravelProfile()).toEqual({})
    expect(screen.queryByRole('button', { name: 'Limpar respostas' })).toBeNull()
    window.location.hash = '#/meu-roteiro'
    expect(
      await screen.findByText('Ainda não há respostas para montar o roteiro'),
    ).toBeInTheDocument()
  })

  it('is reached from the empty roteiro', async () => {
    renderApp('#/meu-roteiro')
    await userEvent.click(screen.getByRole('link', { name: 'Responder o perfil' }))
    await waitFor(() => expect(window.location.hash).toBe('#/perfil-de-viagem'))
    expect(heading('Meu perfil de viagem')).toBeInTheDocument()
  })

  it('is reached from the account, which keeps the answers after sign out', async () => {
    signIn('Maria')
    saveTravelProfile({ stay: 'day' })
    renderApp('#/conta')
    const row = screen.getByRole('link', { name: /Meu perfil de viagem/ })
    expect(row).toHaveAttribute('href', '#/perfil-de-viagem')
    expect(row).toHaveTextContent('1 de 7 respondidas')
    await userEvent.click(screen.getByRole('button', { name: 'Sair' }))
    await waitFor(() => expect(window.location.hash).toBe('#/boas-vindas'))
    expect(getTravelProfile()).toEqual({ stay: 'day' })
  })

  it('speaks the chosen language', () => {
    seedPreferences({ language: 'en' })
    renderApp('#/perfil-de-viagem')
    expect(heading('My travel profile')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Build my itinerary' })).toBeInTheDocument()
  })
})

describe('the Roteiro tab', () => {
  it('is the fourth tab, opens the roteiro and is marked there and on the profile', async () => {
    renderApp('#/inicio')
    const bar = screen.getByRole('navigation', { name: 'Navegação principal' })
    const tab = within(bar).getByRole('link', { name: 'Roteiro' })
    expect(tab).toHaveAttribute('href', '#/meu-roteiro')
    await userEvent.click(tab)
    await waitFor(() => expect(window.location.hash).toBe('#/meu-roteiro'))
    expect(within(bar).getByRole('link', { name: 'Roteiro' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    window.location.hash = '#/perfil-de-viagem'
    await screen.findByRole('heading', { level: 1, name: 'Meu perfil de viagem' })
    expect(within(bar).getByRole('link', { name: 'Roteiro' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('shows the planned roteiro right in the tab once the profile is filled', async () => {
    saveTravelProfile({ stay: 'day', reason: 'culture' })
    renderApp('#/inicio')
    await userEvent.click(
      within(screen.getByRole('navigation', { name: 'Navegação principal' })).getByRole('link', {
        name: 'Roteiro',
      }),
    )
    expect(await screen.findByRole('heading', { name: /^Dia 1 · / })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /^\d\. / })).toHaveLength(3)
  })
})
