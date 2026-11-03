import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { I18nProvider } from '../../../i18n/I18nProvider'
import { renderApp, resetBrowser, seedPreferences } from '../../../test-utils/app'
import { providerMapsUrl } from '../../places/maps'
import { EXAMPLE_PLACES } from '../../places/places'
import { providersFor, SPORT_PROVIDERS } from '../providers'
import { SportSpotsScreen } from '../SportSpotsScreen'

const place = (id: string) => EXAMPLE_PLACES.find((candidate) => candidate.id === id)!

beforeEach(() => {
  resetBrowser()
  seedPreferences()
})

describe('providers', () => {
  it('has a public source for every provider and invents no phone or price', () => {
    for (const provider of SPORT_PROVIDERS) {
      expect(provider.sources.length).toBeGreaterThan(0)
      for (const url of provider.sources) expect(url).toMatch(/^https:\/\//)
      expect(JSON.stringify(provider)).not.toMatch(/\(\d{2}\)|\d{4,5}-\d{4}|R\$/)
    }
  })

  it('points every provider at a sport that exists in the catalogue', () => {
    const ids = new Set(EXAMPLE_PLACES.map((candidate) => candidate.id))
    for (const provider of SPORT_PROVIDERS) {
      for (const sport of provider.sports) expect(ids.has(sport)).toBe(true)
    }
  })

  it('finds providers by sport and none for the sports without a source', () => {
    expect(providersFor('beach-tennis').map((provider) => provider.name)).toEqual([
      'Beach Tennis Team',
    ])
    expect(providersFor('surf').map((provider) => provider.name)).toEqual([
      'Surf’s Up Club Pontal',
      'Cana Brava Resort',
    ])
    expect(providersFor('kitesurf-windsurf')).toEqual([])
    expect(providersFor('futevolei').map((provider) => provider.name)).toEqual(['CTM10'])
  })
})

describe('gyms', () => {
  it('lists the gyms with an address, a Wellhub source and the day-pass warning', () => {
    const gyms = providersFor('academias')
    expect(gyms.map((gym) => gym.name)).toEqual([
      'Academia Vip Ilhéus',
      'Selfit Ilhéus',
      'Academia Stilus Center',
      'Academia Corpore',
      'Pontal Fit',
    ])
    for (const gym of gyms) {
      expect(gym.address, gym.id).toBeTruthy()
      expect(
        gym.sources.every((url) => url.startsWith('https://wellhub.com/')),
        gym.id,
      ).toBe(true)
      expect(gym.caveat?.pt, gym.id).toMatch(/diária/)
    }
  })

  it('shows them on the Academias page', () => {
    render(<SportSpotsScreen place={place('academias')} />)
    expect(screen.getByRole('heading', { level: 2, name: 'Academias' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(5)
    expect(screen.getByText('Av. Dois de Julho, 378, Centro')).toBeInTheDocument()
  })
})

describe('providerMapsUrl', () => {
  it('asks the map for the name, the address and the city, never for a coordinate', () => {
    const url = providerMapsUrl({ name: 'SUP Ilhéus', address: 'Av. Dois de Julho, São Sebastião' })
    expect(new URL(url).searchParams.get('query')).toBe(
      'SUP Ilhéus, Av. Dois de Julho, São Sebastião, Ilhéus, BA',
    )
    expect(url).not.toMatch(/-?\d+\.\d{3,}/)
  })

  it('falls back to the name and the city when the source gives no address', () => {
    const url = providerMapsUrl({ name: 'Cana Brava Resort' })
    expect(new URL(url).searchParams.get('query')).toBe('Cana Brava Resort, Ilhéus, BA')
  })
})

describe('SportSpotsScreen', () => {
  it('names the sport, warns the data is unconfirmed and lists each provider with address and links', () => {
    render(<SportSpotsScreen place={place('beach-tennis')} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Onde praticar' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Beach Tennis' })).toBeInTheDocument()
    expect(screen.getByText('Fontes públicas, ainda a confirmar')).toBeInTheDocument()
    const card = screen.getByRole('article')
    expect(within(card).getByRole('heading', { level: 3, name: 'Beach Tennis Team' })).toBeVisible()
    expect(within(card).getByText('Av. Soares Lopes, Centro')).toBeInTheDocument()
    const map = within(card).getByRole('link', { name: /Ver no mapa/ })
    expect(map).toHaveAttribute('href', providerMapsUrl(SPORT_PROVIDERS[0]!))
    expect(map).toHaveAttribute('target', '_blank')
    expect(map).toHaveAttribute('rel', 'noopener noreferrer')
    const source = within(card).getByRole('link', { name: /Fonte: wellhub.com/ })
    expect(source).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('lists two providers for surf and shows the caveat of the one with an old source', () => {
    render(<SportSpotsScreen place={place('surf')} />)
    expect(screen.getAllByRole('article')).toHaveLength(2)
    expect(screen.getByText(/A notícia é antiga/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Site: surfsupclub.com/ })).toHaveAttribute(
      'href',
      'https://surfsupclub.com',
    )
  })

  it.each(['kitesurf-windsurf'])(
    'says honestly there is no confirmed place for %s and shows no provider',
    (id) => {
      render(<SportSpotsScreen place={place(id)} />)
      expect(
        screen.getByText('Ainda não há local confirmado para este esporte.'),
      ).toBeInTheDocument()
      expect(screen.queryByRole('article')).toBeNull()
      expect(screen.queryByRole('link', { name: /mapa/ })).toBeNull()
    },
  )

  it('lists the CTM10 for futevôlei, without an address it does not know and with both news sources', () => {
    render(<SportSpotsScreen place={place('futevolei')} />)
    const card = screen.getByRole('article')
    expect(within(card).getByRole('heading', { level: 3, name: 'CTM10' })).toBeVisible()
    expect(within(card).getByText('Ilhéus')).toBeInTheDocument()
    expect(within(card).getByText(/não dizem o endereço/)).toBeInTheDocument()
    expect(within(card).getAllByRole('link', { name: /Fonte:/ })).toHaveLength(2)
    const map = within(card).getByRole('link', { name: /Ver no mapa/ })
    expect(new URL(map.getAttribute('href') ?? '').searchParams.get('query')).toBe(
      'CTM10, Ilhéus, BA',
    )
  })

  it('speaks the chosen language', () => {
    render(
      <I18nProvider language="en">
        <SportSpotsScreen place={place('beach-tennis')} />
      </I18nProvider>,
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Where to practise' })).toBeVisible()
    expect(screen.getByText('Beach tennis lessons, beginner to advanced')).toBeInTheDocument()
  })
})

describe('Onde praticar flow', () => {
  it('opens from the sport page and the page of a non-sport place does not offer it', () => {
    renderApp('#/lugar/surf')
    expect(screen.getByRole('link', { name: 'Onde praticar' })).toHaveAttribute(
      'href',
      '#/onde-praticar/surf',
    )
  })

  it('shows the screen from the hash with the bottom bar', () => {
    renderApp('#/onde-praticar/surf')
    expect(screen.getByRole('heading', { level: 2, name: 'Surf' })).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('goes to Perto de mim for an unknown sport', () => {
    renderApp('#/onde-praticar/unknown')
    expect(window.location.hash).toBe('#/perto-de-mim')
  })
})
