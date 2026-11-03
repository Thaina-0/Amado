import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { resetBrowser } from '../../../test-utils/app'
import { EXAMPLE_PLACES, type Place } from '../../places/places'
import { ExploreCategoryScreen } from '../ExploreCategoryScreen'

const load = () => Promise.resolve(EXAMPLE_PLACES)
const withoutBeaches = () =>
  Promise.resolve(EXAMPLE_PLACES.filter((place) => place.category !== 'praias'))

beforeEach(() => resetBrowser())

describe('ExploreCategoryScreen', () => {
  it('shows the places of the category', async () => {
    const view = render(<ExploreCategoryScreen category="cultura" load={load} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Cultura' })).toBeInTheDocument()
    const cards = await screen.findAllByRole('link', { name: /Exemplo/ })
    expect(cards.map((card) => card.getAttribute('href'))).toEqual([
      '#/lugar/casa-de-jorge-amado',
      '#/lugar/catedral-de-sao-sebastiao',
      '#/lugar/teatro-municipal',
      '#/lugar/igreja-de-sao-jorge',
      '#/lugar/igreja-de-nossa-senhora-da-escada',
    ])
    expect(within(cards[0]!).getByText('Exemplo')).toBeInTheDocument()
    view.unmount()

    render(<ExploreCategoryScreen category="gastronomia" load={load} />)
    const food = await screen.findAllByRole('link', { name: /Exemplo/ })
    expect(food.map((card) => card.textContent)).toEqual([
      expect.stringContaining('Bar Vesúvio'),
      expect.stringContaining('Bataclan'),
      expect.stringContaining('Acarajé da Zélia'),
      expect.stringContaining('Estrada do Chocolate'),
      expect.stringContaining('Fazenda Yrerê'),
      expect.stringContaining('Fazenda Provisão'),
      expect.stringContaining('Fazenda Riachuelo e Mendoá'),
      expect.stringContaining('Chocolate Caseiro Ilhéus'),
      expect.stringContaining('Bahia Cacau'),
    ])
  })

  it('shows the empty line for a category without places', async () => {
    render(<ExploreCategoryScreen category="praias" load={withoutBeaches} />)
    expect(await screen.findByText('Nenhum lugar nesta categoria')).toBeInTheDocument()
    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })

  it('lists the sports with Futevôlei pointing to the CTM10', async () => {
    render(<ExploreCategoryScreen category="esportes" load={load} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Esportes' })).toBeInTheDocument()
    const cards = await screen.findAllByRole('link', { name: /Exemplo/ })
    expect(cards.map((card) => card.getAttribute('href'))).toEqual([
      '#/lugar/surf',
      '#/lugar/beach-tennis',
      '#/lugar/stand-up-paddle',
      '#/lugar/kitesurf-windsurf',
      '#/lugar/futevolei',
      '#/lugar/academias',
    ])
    expect(cards[4]).toHaveTextContent('Centro de treinamento e copa de futevôlei')
  })

  it('shows the loading and error states', async () => {
    const loading = render(
      <ExploreCategoryScreen
        category="cultura"
        load={() => new Promise<readonly Place[]>(() => undefined)}
      />,
    )
    expect(screen.getByRole('status', { name: 'Procurando lugares' })).toBeInTheDocument()
    loading.unmount()

    let attempts = 0
    const flaky = () => {
      attempts += 1
      return attempts === 1 ? Promise.reject(new Error('down')) : Promise.resolve(EXAMPLE_PLACES)
    }
    render(<ExploreCategoryScreen category="cultura" load={flaky} />)
    expect(await screen.findByText('Não foi possível carregar os lugares')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Tentar de novo' }))
    expect(await screen.findByRole('link', { name: /Casa de Jorge Amado/ })).toBeInTheDocument()
  })

  it('lists the circuits and opens one', async () => {
    render(<ExploreCategoryScreen category="circuitos" load={load} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Circuitos' })).toBeInTheDocument()
    const card = screen.getByRole('link', { name: /Circuito Cultural do Centro/ })
    expect(card).toHaveAttribute('href', '#/circuito/circuito-cultural-do-centro')
    expect(within(card).getByText('Exemplo')).toBeInTheDocument()
    await userEvent.click(card)
    expect(window.location.hash).toBe('#/circuito/circuito-cultural-do-centro')
  })
})
