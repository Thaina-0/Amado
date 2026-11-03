import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockPermission, resetBrowser } from '../../../test-utils/app'
import { NearbyScreen } from '../NearbyScreen'
import { EXAMPLE_PLACES, type Place } from '../places'

const load = () => Promise.resolve(EXAMPLE_PLACES)
const withoutBeaches = () =>
  Promise.resolve(EXAMPLE_PLACES.filter((place) => place.category !== 'praias'))
const cards = () => screen.queryAllByRole('listitem')

beforeEach(() => {
  resetBrowser()
  mockPermission('granted')
})

describe('NearbyScreen', () => {
  it('shows the list with Exemplo and Sem distância on every place', async () => {
    render(<NearbyScreen load={load} />)
    await screen.findByText('Bar Vesúvio')
    expect(screen.getByRole('heading', { level: 1, name: 'Perto de mim' })).toBeInTheDocument()
    expect(screen.getByText('Lugares de exemplo em Ilhéus')).toBeInTheDocument()
    expect(cards()).toHaveLength(EXAMPLE_PLACES.length)
    for (const card of cards()) {
      expect(within(card).getByText('Exemplo')).toBeInTheDocument()
      expect(within(card).getByText('Sem distância')).toBeInTheDocument()
    }
  })

  it('shows the loading blocks while the places load', () => {
    render(<NearbyScreen load={() => new Promise<readonly Place[]>(() => undefined)} />)
    expect(screen.getByRole('status', { name: 'Procurando lugares' })).toBeInTheDocument()
    expect(cards()).toHaveLength(0)
  })

  it('shows the empty state for a category with no place and Ver todos os lugares selects Tudo', async () => {
    render(<NearbyScreen load={withoutBeaches} />)
    await screen.findByText('Bar Vesúvio')
    await userEvent.click(screen.getByRole('button', { name: 'Praias' }))
    expect(screen.getByText('Nenhum lugar nesta categoria')).toBeInTheDocument()
    expect(cards()).toHaveLength(0)
    await userEvent.click(screen.getByRole('button', { name: 'Ver todos os lugares' }))
    expect(cards()).toHaveLength(
      EXAMPLE_PLACES.filter((place) => place.category !== 'praias').length,
    )
    expect(screen.getByRole('button', { name: 'Tudo' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('shows the error block and Tentar de novo loads again', async () => {
    const failing = vi
      .fn<() => Promise<readonly Place[]>>()
      .mockRejectedValueOnce(new Error('down'))
      .mockResolvedValue(EXAMPLE_PLACES)
    render(<NearbyScreen load={failing} />)
    expect(await screen.findByText('Não foi possível carregar os lugares')).toBeInTheDocument()
    expect(
      screen.getByText('Os números de emergência continuam salvos neste aparelho.'),
    ).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Tentar de novo' }))
    await screen.findByText('Bar Vesúvio')
    expect(failing).toHaveBeenCalledTimes(2)
  })

  it('shows the location warning while the permission is not granted', async () => {
    mockPermission('denied')
    render(<NearbyScreen load={load} />)
    expect(await screen.findByText('Sem a sua localização')).toBeInTheDocument()
    expect(
      screen.getByText('Não dá para ordenar por distância. Os lugares aparecem por tipo.'),
    ).toBeInTheDocument()
    const action = screen.getByRole('link', { name: 'Como ligar a localização' })
    expect(action).toHaveAttribute('href', '#/privacidade')
    await userEvent.click(action)
    expect(window.location.hash).toBe('#/privacidade')
  })

  it('shows the location warning when the browser cannot tell', async () => {
    mockPermission(undefined)
    render(<NearbyScreen load={load} />)
    expect(await screen.findByText('Sem a sua localização')).toBeInTheDocument()
  })

  it('does not show the location warning when the permission is granted', async () => {
    render(<NearbyScreen load={load} />)
    await screen.findByText('Bar Vesúvio')
    expect(screen.queryByText('Sem a sua localização')).toBeNull()
  })

  it('the Perfil icon shows Perfil', async () => {
    render(<NearbyScreen load={load} />)
    await screen.findByText('Bar Vesúvio')
    await userEvent.click(screen.getByRole('link', { name: 'Abrir perfil' }))
    expect(window.location.hash).toBe('#/perfil')
  })
})
