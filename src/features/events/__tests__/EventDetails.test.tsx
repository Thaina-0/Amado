import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { I18nProvider } from '../../../i18n/I18nProvider'
import { EVENTS, findEvent } from '../data'
import { EventScreen } from '../EventScreen'

const NOW = new Date(2026, 9, 29)

function show(id: string, language: 'pt' | 'en' = 'pt') {
  const event = findEvent(id)
  if (!event) throw new Error(`missing event ${id}`)
  return render(
    <I18nProvider language={language}>
      <EventScreen event={event} now={NOW} />
    </I18nProvider>,
  )
}

describe('event details, data', () => {
  it('uses https for every ticket, poster and Instagram link', () => {
    for (const item of EVENTS) {
      for (const url of [item.tickets?.online?.url, item.poster?.src, item.poster?.page]) {
        if (url) expect(url, item.id).toMatch(/^https:\/\//)
      }
      if (item.instagram)
        expect(item.instagram, item.id).toMatch(/^https:\/\/www\.instagram\.com\//)
    }
  })

  it('gives every paid or registration event an online sales page', () => {
    for (const item of EVENTS.filter(
      (e) => e.admission === 'paid' || e.admission === 'registration',
    )) {
      expect(item.tickets?.online?.url, item.id).toBeTruthy()
    }
  })

  it('never lists a price on a free event', () => {
    for (const item of EVENTS.filter((e) => e.admission === 'free')) {
      expect(item.tickets, item.id).toBeUndefined()
    }
  })

  it('credits every poster and points it at a page that sells or announces the event', () => {
    for (const item of EVENTS.filter((e) => e.poster)) {
      expect(item.poster?.credit, item.id).toBeTruthy()
      expect(item.sources, item.id).toContain(item.poster?.page)
    }
  })
})

describe('EventScreen, paid event', () => {
  it('shows the poster with its credit, the address with a map link and the organiser', () => {
    show('festa-latina-casa-maya')
    const poster = screen.getByRole('img', { name: 'Cartaz de divulgação: Festa Latina' })
    expect(poster).toHaveAttribute('src', 'https://images.sympla.com.br/6ac6b188d55d3.jpg')
    expect(poster).toHaveAttribute('referrerpolicy', 'no-referrer')
    expect(screen.getByRole('link', { name: 'Divulgação: Casa Maya e o Mar' })).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    )
    expect(screen.getByText(/CXX5\+P7, km 24/)).toBeInTheDocument()
    const map = screen.getByRole('link', { name: 'Ver no mapa' })
    expect(new URL(map.getAttribute('href') ?? '').searchParams.get('query')).toBe(
      'Casa Maya e o Mar, CXX5+P7, km 24, Mansões de Luzimares, Serra Grande, BA',
    )
    expect(screen.getByText('Organização')).toBeInTheDocument()
    expect(screen.getByText('Ingresso pago')).toBeInTheDocument()
  })

  it('offers the online ticket in a new tab and says the physical sales point was not given', () => {
    show('festa-latina-casa-maya')
    const buy = screen.getByRole('link', { name: /Comprar ingresso no Sympla/ })
    expect(buy).toHaveAttribute(
      'href',
      'https://www.sympla.com.br/evento/festa-latina-na-casa-maya-e-o-mar/3611178',
    )
    expect(buy).toHaveAttribute('target', '_blank')
    expect(buy).toHaveAttribute('rel', 'noopener noreferrer')
    const section = screen.getByRole('region', { name: 'Ingressos' })
    expect(within(section).getByText('Ponto de venda físico')).toBeInTheDocument()
    expect(within(section).getByText('Não informado pela organização.')).toBeInTheDocument()
    expect(
      within(section).getByText(/Confira valores e lotes na página de venda/),
    ).toBeInTheDocument()
  })

  it('invents no Instagram link where the sources gave none', () => {
    show('festa-latina-casa-maya')
    expect(screen.queryByRole('link', { name: /Instagram/ })).toBeNull()
  })

  it('goes on without the poster when it fails to load', () => {
    show('festa-latina-casa-maya')
    fireEvent.error(screen.getByRole('img', { name: /Cartaz de divulgação/ }))
    expect(screen.queryByRole('img', { name: /Cartaz de divulgação/ })).toBeNull()
    expect(screen.getByRole('link', { name: /Comprar ingresso no Sympla/ })).toBeInTheDocument()
  })

  it('writes the labels in the chosen language', () => {
    show('festa-latina-casa-maya', 'en')
    expect(screen.getByRole('link', { name: /Buy a ticket on Sympla/ })).toBeInTheDocument()
    expect(screen.getByText('Physical sales point')).toBeInTheDocument()
  })
})

describe('EventScreen, registration event', () => {
  it('shows the prices, the registration link, the kit pickup and the Instagram of the race', () => {
    show('corrida-da-ponte-2026')
    expect(screen.getByRole('heading', { level: 3, name: 'Inscrição' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Inscrever-se no Races/ })).toHaveAttribute(
      'href',
      'https://www.races.com.br/corrida-da-ponte-ilheus-ba-2026',
    )
    expect(screen.getByText('Kit Premium (6 km ou 12 km)')).toBeInTheDocument()
    expect(screen.getByText('R$ 145,00')).toBeInTheDocument()
    expect(screen.getByText('R$ 72,00')).toBeInTheDocument()
    expect(screen.getByText(/Retirada do kit de 10 a 12 de dezembro/)).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Instagram do evento: instagram.com/ }),
    ).toHaveAttribute('href', 'https://www.instagram.com/corridadaponteilheus/')
    expect(screen.queryByRole('img', { name: /Cartaz/ })).toBeNull()
  })
})

describe('EventScreen, free event', () => {
  it('says the entry is free and shows no buy button, price or physical sales point', () => {
    show('festa-literaria-de-ilheus-2026')
    expect(screen.getByText('Entrada gratuita. Não precisa comprar ingresso.')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Comprar|Inscrever/ })).toBeNull()
    expect(screen.queryByText('Ponto de venda físico')).toBeNull()
    expect(screen.getByRole('link', { name: /Instagram do evento/ })).toHaveAttribute(
      'href',
      'https://www.instagram.com/fli_oficial/',
    )
  })
})

describe('EventScreen, event with no sales data', () => {
  it('shows no ticket section at all rather than an empty one', () => {
    show('carnaval-2027')
    expect(screen.queryByRole('region', { name: 'Ingressos' })).toBeNull()
    expect(screen.queryByText('Ponto de venda físico')).toBeNull()
  })
})
