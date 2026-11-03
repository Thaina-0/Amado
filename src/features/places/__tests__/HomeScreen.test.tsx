import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { resetBrowser } from '../../../test-utils/app'
import { CIRCUITS } from '../../circuits/circuits'
import { HomeScreen } from '../HomeScreen'
import { EXAMPLE_PLACES } from '../places'

const load = () => Promise.resolve(EXAMPLE_PLACES)
const withoutBeaches = () =>
  Promise.resolve(EXAMPLE_PLACES.filter((place) => place.category !== 'praias'))
const WITH_CIRCUIT = EXAMPLE_PLACES.length + CIRCUITS.length
const TODAY = new Date(2026, 9, 28)

async function renderHome(loader = load) {
  render(<HomeScreen load={loader} now={TODAY} />)
  await screen.findByText('Bar Vesúvio')
}

const cards = () =>
  within(screen.getByRole('region', { name: 'Para fazer hoje' })).queryAllByRole('link')

beforeEach(() => resetBrowser())

describe('HomeScreen', () => {
  it('shows the title and the date, the search, the chips, the list and the Perfil icon', async () => {
    await renderHome()
    expect(screen.getByRole('heading', { level: 1, name: 'Hoje em Ilhéus' })).toBeInTheDocument()
    expect(screen.getByText('Quarta, 28 de outubro')).toBeInTheDocument()
    expect(screen.getByLabelText('Buscar em Ilhéus')).toHaveAttribute(
      'placeholder',
      'Buscar restaurantes, passeios...',
    )
    const chips = within(screen.getByRole('group', { name: 'Categorias' })).getAllByRole('button')
    expect(chips.map((chip) => chip.textContent)).toEqual([
      'Tudo',
      'Gastronomia',
      'Cultura',
      'Praias',
      'Natureza',
      'Esportes',
    ])
    expect(screen.getByRole('heading', { level: 2, name: 'Para fazer hoje' })).toBeInTheDocument()
    expect(cards()).toHaveLength(WITH_CIRCUIT)
    expect(screen.getByRole('link', { name: 'Abrir perfil' })).toBeInTheDocument()
  })

  it('typing in the search filters the list', async () => {
    await renderHome()
    const search = screen.getByLabelText('Buscar em Ilhéus')
    await userEvent.type(search, 'vesuvio')
    expect(cards()).toHaveLength(1)
    expect(cards()[0]).toHaveTextContent('Bar Vesúvio')
    await userEvent.clear(search)
    await userEvent.type(search, 'JORGE')
    expect(cards().map((card) => card.textContent)).toEqual([
      expect.stringContaining('Casa de Jorge Amado'),
      expect.stringContaining('Teatro Municipal'),
      expect.stringContaining('Igreja de São Jorge'),
    ])
    await userEvent.clear(search)
    await userEvent.type(search, 'xyz')
    expect(cards()).toHaveLength(0)
    expect(screen.getByText('Nenhum lugar encontrado. Tente outra busca.')).toBeInTheDocument()
    await userEvent.clear(search)
    expect(cards()).toHaveLength(WITH_CIRCUIT)
  })

  it('tapping a chip filters the list and marks only that chip', async () => {
    await renderHome(withoutBeaches)
    const chip = (name: string) => screen.getByRole('button', { name })
    expect(chip('Tudo')).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(chip('Cultura'))
    expect(cards()).toHaveLength(5)
    expect(chip('Cultura')).toHaveAttribute('aria-pressed', 'true')
    expect(chip('Tudo')).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(chip('Gastronomia'))
    expect(cards()).toHaveLength(9)
    expect(chip('Cultura')).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(chip('Praias'))
    expect(cards()).toHaveLength(0)
    await userEvent.click(chip('Natureza'))
    expect(cards()).toHaveLength(2)
  })

  it('shows the circuit card first and opens it', async () => {
    await renderHome()
    const first = cards()[0]!
    expect(first).toHaveTextContent('Circuito Cultural do Centro')
    expect(first).toHaveTextContent('Exemplo')
    await userEvent.click(first)
    expect(window.location.hash).toBe('#/circuito/circuito-cultural-do-centro')
  })

  it('hides the circuit card while filtering', async () => {
    await renderHome()
    const circuit = () => screen.queryByRole('link', { name: /Circuito Cultural do Centro/ })
    await userEvent.click(screen.getByRole('button', { name: 'Cultura' }))
    expect(circuit()).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: 'Tudo' }))
    expect(circuit()).not.toBeNull()
    await userEvent.type(screen.getByLabelText('Buscar em Ilhéus'), 'jorge')
    expect(circuit()).toBeNull()
    await userEvent.clear(screen.getByLabelText('Buscar em Ilhéus'))
    expect(circuit()).not.toBeNull()
  })

  it('tapping a card opens Lugar for that place', async () => {
    await renderHome()
    await userEvent.click(screen.getByRole('link', { name: /Casa de Jorge Amado/ }))
    expect(window.location.hash).toBe('#/lugar/casa-de-jorge-amado')
  })

  it('the Perfil icon shows Perfil', async () => {
    await renderHome()
    await userEvent.click(screen.getByRole('link', { name: 'Abrir perfil' }))
    expect(window.location.hash).toBe('#/perfil')
  })

  it('reads in English with the date in English', async () => {
    const { I18nProvider } = await import('../../../i18n/I18nProvider')
    render(
      <I18nProvider language="en">
        <HomeScreen load={load} now={TODAY} />
      </I18nProvider>,
    )
    expect(await screen.findByText('Wednesday, October 28')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Today in Ilhéus' })).toBeInTheDocument()
  })

  describe('events section', () => {
    const section = () => screen.getByRole('region', { name: 'Eventos em Ilhéus' })

    it('shows the next three events and a link to all of them', async () => {
      await renderHome()
      const links = within(section())
        .getAllByRole('link')
        .filter((link) => link.getAttribute('href')?.startsWith('#/evento/'))
      expect(links.map((link) => link.getAttribute('href'))).toEqual([
        '#/evento/festa-latina-casa-maya',
        '#/evento/festa-literaria-de-ilheus-2026',
        '#/evento/noite-do-brega-boca-do-mar',
      ])
      expect(within(section()).getByRole('link', { name: 'Ver todos os eventos' })).toHaveAttribute(
        'href',
        '#/eventos',
      )
    })

    it('stays out of the way while filtering or searching', async () => {
      await renderHome()
      await userEvent.click(screen.getByRole('button', { name: 'Cultura' }))
      expect(screen.queryByRole('region', { name: 'Eventos em Ilhéus' })).toBeNull()
      await userEvent.click(screen.getByRole('button', { name: 'Tudo' }))
      expect(screen.queryByRole('region', { name: 'Eventos em Ilhéus' })).not.toBeNull()
      await userEvent.type(screen.getByLabelText('Buscar em Ilhéus'), 'jorge')
      expect(screen.queryByRole('region', { name: 'Eventos em Ilhéus' })).toBeNull()
    })

    it('says plainly when there is nothing coming up', async () => {
      render(<HomeScreen load={load} now={new Date(2030, 0, 1)} />)
      await screen.findByText('Bar Vesúvio')
      expect(within(section()).getByText('Nenhum evento próximo no momento.')).toBeInTheDocument()
    })
  })
})
