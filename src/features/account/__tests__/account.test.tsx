import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderApp, resetBrowser, seedPreferences } from '../../../test-utils/app'
import { REVIEWS_KEY } from '../../reviews/reviews'
import { getSession, SESSION_KEY, signOut } from '../session'

const heading = (name: string) => screen.getByRole('heading', { level: 1, name })

async function signInAs(email = 'maria@exemplo.com') {
  await userEvent.type(screen.getByLabelText('E-mail'), email)
  await userEvent.type(screen.getByLabelText('Senha'), 'qualquer')
  await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
}

beforeEach(() => {
  resetBrowser()
  seedPreferences()
  signOut()
})

describe('login and logout, demo', () => {
  it('offers Entrar in Perfil, says it is optional and opens the login', async () => {
    renderApp('#/perfil')
    const row = screen.getByRole('link', { name: /Entrar/ })
    expect(row).toHaveTextContent('Opcional. O app funciona sem conta')
    await userEvent.click(row)
    await waitFor(() => expect(window.location.hash).toBe('#/entrar'))
    expect(heading('Entrar no Amado')).toBeInTheDocument()
    expect(screen.getByText('Versão de demonstração')).toBeInTheDocument()
    expect(screen.getByText(/Entrar é opcional/)).toBeInTheDocument()
  })

  it('asks for a valid e-mail and a password before it lets anyone in', async () => {
    renderApp('#/entrar')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(screen.getByText('Digite um e-mail válido, como nome@exemplo.com.')).toBeInTheDocument()
    expect(screen.getByText('Digite a senha.')).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('aria-invalid', 'true')
    expect(getSession()).toBeNull()
    expect(window.location.hash).toBe('#/entrar')
  })

  it('lets any e-mail and password in, greets by first name and stores nothing else', async () => {
    renderApp('#/entrar')
    await userEvent.type(screen.getByLabelText('E-mail'), 'maria.souza@exemplo.com')
    await userEvent.type(screen.getByLabelText('Senha'), 'segredo123')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    await waitFor(() => expect(window.location.hash).toBe('#/conta'))
    expect(heading('Olá, Maria')).toBeInTheDocument()
    const stored = window.localStorage.getItem(SESSION_KEY) ?? ''
    expect(JSON.parse(stored)).toEqual({ name: 'Maria' })
    for (const key of Object.keys(window.localStorage)) {
      expect(window.localStorage.getItem(key) ?? '').not.toMatch(/segredo123|exemplo\.com/)
    }
  })

  it('shows the account link with the name in Perfil once signed in', async () => {
    renderApp('#/entrar')
    await signInAs('joao@x.io')
    await screen.findByRole('heading', { level: 1, name: 'Olá, Joao' })
    await userEvent.click(screen.getByRole('button', { name: 'Voltar' }))
    window.location.hash = '#/perfil'
    const row = await screen.findByRole('link', { name: /Minha conta/ })
    expect(row).toHaveTextContent('Joao')
    expect(screen.queryByRole('link', { name: /^Entrar/ })).toBeNull()
  })

  it('lists the places the person reviewed, each opening that place', async () => {
    window.localStorage.setItem(
      REVIEWS_KEY,
      JSON.stringify({
        'bar-vesuvio': { rating: 5, comment: 'ótimo', counted: false },
        bataclan: { rating: 3, comment: '', counted: false },
        'lugar-que-nao-existe': { rating: 1, comment: '', counted: false },
      }),
    )
    renderApp('#/entrar')
    await signInAs()
    await screen.findByRole('heading', { level: 2, name: 'Minhas avaliações' })
    const rows = screen.getAllByRole('link', { name: /Nota:/ })
    expect(rows.map((row) => [row.textContent, row.getAttribute('href')])).toEqual([
      ['Bar VesúvioNota: 5 de 5', '#/lugar/bar-vesuvio'],
      ['BataclanNota: 3 de 5', '#/lugar/bataclan'],
    ])
    await userEvent.click(rows[0]!)
    await waitFor(() => expect(window.location.hash).toBe('#/lugar/bar-vesuvio'))
    expect(screen.getByRole('heading', { level: 2, name: 'Bar Vesúvio' })).toBeInTheDocument()
  })

  it('invites the person to explore when there is no review yet', async () => {
    renderApp('#/entrar')
    await signInAs()
    expect(await screen.findByText('Você ainda não avaliou nenhum lugar.')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('link', { name: 'Ver lugares para explorar' }))
    await waitFor(() => expect(window.location.hash).toBe('#/explorar'))
  })

  it('signs out, goes back to Boas-vindas and forgets the name but not the reviews', async () => {
    window.localStorage.setItem(
      REVIEWS_KEY,
      JSON.stringify({ 'bar-vesuvio': { rating: 4, comment: '', counted: false } }),
    )
    renderApp('#/entrar')
    await signInAs()
    await screen.findByRole('heading', { level: 1, name: 'Olá, Maria' })
    expect(screen.getByText(/As avaliações continuam neste aparelho/)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Sair' }))
    await waitFor(() => expect(window.location.hash).toBe('#/boas-vindas'))
    expect(heading('Bem-vindo ao Amado')).toBeInTheDocument()
    expect(window.localStorage.getItem(SESSION_KEY)).toBeNull()
    expect(window.localStorage.getItem(REVIEWS_KEY)).toContain('bar-vesuvio')
  })

  it('shows Entrar again in Perfil after signing out', async () => {
    renderApp('#/entrar')
    await signInAs()
    await userEvent.click(await screen.findByRole('button', { name: 'Sair' }))
    window.location.hash = '#/perfil'
    expect(await screen.findByRole('link', { name: /Entrar/ })).toBeInTheDocument()
  })

  it('sends someone who is not signed in from Conta to Entrar', async () => {
    renderApp('#/conta')
    await waitFor(() => expect(window.location.hash).toBe('#/entrar'))
    expect(heading('Entrar no Amado')).toBeInTheDocument()
  })

  it('sends someone who is already signed in from Entrar to Conta', async () => {
    renderApp('#/entrar')
    await signInAs()
    await screen.findByRole('heading', { level: 1, name: 'Olá, Maria' })
    window.location.hash = '#/entrar'
    await waitFor(() => expect(window.location.hash).toBe('#/conta'))
  })

  it('never puts a login in front of the emergency numbers', () => {
    renderApp('#/emergencia')
    expect(screen.getByRole('heading', { level: 1, name: 'Emergência' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /190/ })).toHaveAttribute('href', 'tel:190')
  })
})
