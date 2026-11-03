import { screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderApp, resetBrowser, seedPreferences } from '../../../test-utils/app'
import { signIn, signOut } from '../../account/session'
import { saveTravelProfile } from '../../account/travelProfile'

// why: the catalogue now holds more places than the longest stay can use, so the "stay longer than the places" state only shows with a short list
vi.mock('../../places/places', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../places/places')>()
  return { ...actual, EXAMPLE_PLACES: actual.EXAMPLE_PLACES.slice(0, 10) }
})

const heading = (name: string) => screen.getByRole('heading', { level: 1, name })

beforeEach(() => {
  resetBrowser()
  seedPreferences()
  signOut()
  saveTravelProfile({})
})

describe('Meu roteiro', () => {
  it('builds the days from the travel profile and explains each place', () => {
    saveTravelProfile({ stay: 'day', reason: 'food', interests: ['gastronomia'] })
    renderApp('#/meu-roteiro')
    expect(heading('Meu roteiro')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Dia 1 · Gastronomia' })).toBeInTheDocument()
    expect(screen.getByText('1 dia · 3 lugares por dia')).toBeInTheDocument()
    const stops = screen.getAllByRole('link', { name: /^\d\. / }).map((link) => link.closest('li'))
    expect(stops).toHaveLength(3)
    const first = stops[0]
    expect(first).toBeDefined()
    if (!first) return
    expect(within(first).getByRole('link', { name: /Bar Vesúvio/ })).toHaveAttribute(
      'href',
      '#/lugar/bar-vesuvio',
    )
    expect(
      within(first).getByText('Você escolheu Gastronomia entre os seus interesses'),
    ).toBeInTheDocument()
    expect(
      within(first).getByText('Combina com o motivo da viagem: Gastronomia'),
    ).toBeInTheDocument()
  })

  it('explains how the plan was made, and what the other answers do not change', () => {
    saveTravelProfile({ stay: 'short', party: 'family', age: 'a30', origin: 'abroad' })
    renderApp('#/meu-roteiro')
    expect(screen.getByRole('heading', { name: 'Como montamos este roteiro' })).toBeInTheDocument()
    expect(
      screen.getByText('Usamos só as suas respostas, aqui no aparelho. Nada é enviado.'),
    ).toBeInTheDocument()
    expect(screen.getByText(/Duração da estadia: De 2 a 3 dias/)).toBeInTheDocument()
    expect(screen.getByText(/Ritmo: 2 lugares por dia, mais leve/)).toBeInTheDocument()
    expect(
      screen.getByText(/Idade, origem e como você conheceu o Amado não mudam/),
    ).toBeInTheDocument()
    expect(
      screen.getAllByText('Você viaja em família, então priorizamos praias e cultura').length,
    ).toBeGreaterThan(0)
  })

  it('says plainly when the stay is longer than the places it has', () => {
    saveTravelProfile({ stay: 'long' })
    renderApp('#/meu-roteiro')
    expect(
      screen.getByText(/Você vai ficar 7 dias, mas por enquanto temos lugares para/),
    ).toBeInTheDocument()
  })

  it('asks for the travel profile when there are no answers, with or without an account', () => {
    renderApp('#/meu-roteiro')
    expect(screen.getByText('Ainda não há respostas para montar o roteiro')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Responder o perfil' })).toHaveAttribute(
      'href',
      '#/perfil-de-viagem',
    )
    expect(screen.queryByRole('link', { name: 'Entrar' })).toBeNull()
  })

  it('asks for the profile when only the answers that do not shape the plan exist', () => {
    saveTravelProfile({ age: 'a30', origin: 'abroad', channel: 'qr' })
    renderApp('#/meu-roteiro')
    expect(screen.getByText('Ainda não há respostas para montar o roteiro')).toBeInTheDocument()
  })

  it('builds the plan without an account', () => {
    saveTravelProfile({ stay: 'day', interests: ['cultura'] })
    renderApp('#/meu-roteiro')
    expect(screen.getByRole('heading', { name: 'Dia 1 · Cultura' })).toBeInTheDocument()
  })

  it('edits the answers in Meu perfil de viagem', () => {
    saveTravelProfile({ stay: 'day', interests: ['cultura'] })
    renderApp('#/meu-roteiro')
    expect(screen.getByRole('link', { name: 'Mudar minhas respostas' })).toHaveAttribute(
      'href',
      '#/perfil-de-viagem',
    )
  })

  it('is reached from the account, and follows the language', () => {
    signIn('Maria')
    saveTravelProfile({ stay: 'day', interests: ['cultura'] })
    renderApp('#/conta')
    expect(screen.getByRole('link', { name: /Meu roteiro/ })).toHaveAttribute(
      'href',
      '#/meu-roteiro',
    )
  })

  it('speaks the chosen language', () => {
    seedPreferences({ language: 'fr' })
    saveTravelProfile({ stay: 'day', interests: ['cultura'] })
    renderApp('#/meu-roteiro')
    expect(heading('Mon itinéraire')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Jour 1 · Culture' })).toBeInTheDocument()
  })
})
