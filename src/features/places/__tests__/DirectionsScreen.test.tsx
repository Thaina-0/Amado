import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderApp, resetBrowser, seedPreferences } from '../../../test-utils/app'
import { DirectionsScreen } from '../DirectionsScreen'
import { mapsUrl } from '../maps'
import { EXAMPLE_PLACES } from '../places'

const place = (id: string) => EXAMPLE_PLACES.find((candidate) => candidate.id === id)!

beforeEach(() => {
  resetBrowser()
  seedPreferences()
})

describe('mapsUrl', () => {
  it('asks the map for the name and the city, never for a coordinate', () => {
    const url = new URL(mapsUrl(place('bar-vesuvio')))
    expect(url.origin + url.pathname).toBe('https://www.google.com/maps/search/')
    expect(url.searchParams.get('query')).toBe('Bar Vesúvio, Ilhéus, BA')
    expect(mapsUrl(place('bar-vesuvio'))).not.toMatch(/-?\d+\.\d{3,}/)
  })
})

describe('DirectionsScreen', () => {
  it('names the place, warns the location is not confirmed and opens the map in a new tab', () => {
    render(<DirectionsScreen place={place('casa-de-jorge-amado')} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Como chegar' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Casa de Jorge Amado' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Localização ainda não confirmada')).toBeInTheDocument()
    expect(screen.getByText('O mapa precisa de internet.')).toBeInTheDocument()
    const open = screen.getByRole('link', { name: 'Abrir no mapa' })
    expect(open).toHaveAttribute('href', mapsUrl(place('casa-de-jorge-amado')))
    expect(open).toHaveAttribute('target', '_blank')
    expect(open).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('goes back to that place', async () => {
    renderApp('#/como-chegar/bataclan')
    await userEvent.click(screen.getByRole('link', { name: 'Voltar ao lugar' }))
    expect(window.location.hash).toBe('#/lugar/bataclan')
    expect(screen.getByRole('heading', { level: 2, name: 'Bataclan' })).toBeInTheDocument()
  })

  it('opens from the place page with Como chegar', async () => {
    renderApp('#/lugar/bataclan')
    await userEvent.click(screen.getByRole('link', { name: 'Como chegar' }))
    expect(window.location.hash).toBe('#/como-chegar/bataclan')
    expect(screen.getByRole('heading', { level: 1, name: 'Como chegar' })).toBeInTheDocument()
  })

  it('has no Como chegar for a sport, which is not a single spot', () => {
    renderApp('#/lugar/surf')
    expect(screen.queryByRole('link', { name: 'Como chegar' })).toBeNull()
  })

  it('falls back to Perto de mim for a place that does not exist', () => {
    renderApp('#/como-chegar/nao-existe')
    expect(window.location.hash).toBe('#/perto-de-mim')
  })

  it('keeps the tab bar on Perto de mim', () => {
    renderApp('#/como-chegar/bataclan')
    expect(screen.getByRole('link', { name: /Perto de mim/ })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })
})
