import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { I18nProvider } from '../../../i18n/I18nProvider'
import { renderApp, resetBrowser, seedPreferences } from '../../../test-utils/app'
import { EventScreen } from '../EventScreen'
import { EventsScreen } from '../EventsScreen'
import { EVENTS, findEvent } from '../data'

const OCT_29 = new Date(2026, 9, 29)
const NOV_9 = new Date(2026, 10, 9)
const cards = () =>
  screen.queryAllByRole('link').filter((link) => link.getAttribute('href')?.startsWith('#/evento/'))
const titles = () => cards().map((card) => card.querySelector('span.text-title')?.textContent)
const chip = (name: string) => screen.getByRole('button', { name })

beforeEach(() => {
  resetBrowser()
  seedPreferences()
})

describe('EventsScreen', () => {
  it('opens with the upcoming events already listed, earliest first', () => {
    render(<EventsScreen now={OCT_29} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Eventos' })).toBeInTheDocument()
    expect(cards().length).toBeGreaterThanOrEqual(10)
    expect(titles()[0]).toBe('Festa Latina')
    expect(titles()[1]).toBe('9ª Festa Literária de Ilhéus (FLI)')
    expect(titles()).not.toContain('Chocolat Bahia (17ª Edição)')
    expect(screen.getByText(`${cards().length} eventos`)).toBeInTheDocument()
  })

  it('shows each event with its date, its place, a summary and a link to the detail', () => {
    render(<EventsScreen now={OCT_29} />)
    const first = cards()[0]
    expect(first).toHaveAttribute('href', '#/evento/festa-latina-casa-maya')
    expect(first).toHaveTextContent('Casa Maya e o Mar')
    expect(first).toHaveTextContent(/nov.*2026/i)
    expect(first).toHaveTextContent('Música e shows')
  })

  it('says when the place is still to be confirmed', () => {
    render(<EventsScreen now={OCT_29} />)
    const natal = cards().find((card) => card.getAttribute('href')?.includes('natal-encantado'))
    expect(natal).toHaveTextContent('Local a confirmar')
  })

  it('marks a date that is only a pattern or only a month', () => {
    render(<EventsScreen now={OCT_29} />)
    const reveillon = cards().find((card) => card.getAttribute('href')?.includes('reveillon'))
    const natal = cards().find((card) => card.getAttribute('href')?.includes('natal-encantado'))
    expect(reveillon).toHaveTextContent('Data prevista')
    expect(natal).toHaveTextContent('Data a divulgar')
  })

  it('filters by category and marks only that chip', async () => {
    render(<EventsScreen now={OCT_29} />)
    expect(chip('Todos')).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(chip('Música e shows'))
    expect(titles().sort()).toEqual(['Festa Latina', 'Noite do Brega', 'Sunset Fest (2ª Edição)'])
    expect(chip('Música e shows')).toHaveAttribute('aria-pressed', 'true')
    expect(chip('Todos')).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByText('3 eventos')).toBeInTheDocument()
  })

  it('says "1 evento" for a single one', async () => {
    render(<EventsScreen now={OCT_29} />)
    await userEvent.click(chip('Cultura'))
    await userEvent.click(chip('Escolher um dia'))
    fireEvent.change(screen.getByLabelText('Dia'), { target: { value: '2026-11-29' } })
    expect(titles()).toEqual(['I Copa Jorge Amado de Bandas e Fanfarras'])
    expect(screen.getByText('1 evento')).toBeInTheDocument()
  })

  it('filters by the next seven days', async () => {
    render(<EventsScreen now={NOV_9} />)
    await userEvent.click(chip('Próximos 7 dias'))
    expect(titles()).toEqual(['9ª Festa Literária de Ilhéus (FLI)'])
  })

  it('filters by this month', async () => {
    render(<EventsScreen now={NOV_9} />)
    await userEvent.click(chip('Este mês'))
    expect(titles()).toEqual([
      '9ª Festa Literária de Ilhéus (FLI)',
      'Noite do Brega',
      'Sunset Fest (2ª Edição)',
      'I Copa Jorge Amado de Bandas e Fanfarras',
    ])
  })

  it('filters by today', async () => {
    render(<EventsScreen now={new Date(2026, 10, 12)} />)
    await userEvent.click(chip('Hoje'))
    expect(titles()).toEqual(['9ª Festa Literária de Ilhéus (FLI)'])
  })

  it('shows a day field only when picking a day, and filters by it', async () => {
    render(<EventsScreen now={OCT_29} />)
    expect(screen.queryByLabelText('Dia')).toBeNull()
    await userEvent.click(chip('Escolher um dia'))
    const field = screen.getByLabelText('Dia')
    fireEvent.change(field, { target: { value: '2026-11-13' } })
    expect(titles()).toEqual(['9ª Festa Literária de Ilhéus (FLI)'])
    fireEvent.change(field, { target: { value: '' } })
    expect(cards().length).toBeGreaterThanOrEqual(10)
  })

  it('sorts by date both ways, by name and by category', async () => {
    render(<EventsScreen now={OCT_29} />)
    const sort = screen.getByLabelText('Ordenar por')
    expect(
      within(sort)
        .getAllByRole('option')
        .map((option) => option.textContent),
    ).toEqual([
      'Data: mais cedo primeiro',
      'Data: mais tarde primeiro',
      'Nome (A a Z)',
      'Categoria',
    ])
    await userEvent.selectOptions(sort, 'Data: mais tarde primeiro')
    expect(titles()[0]).toBe('Festa de São Jorge dos Ilhéus')
    await userEvent.selectOptions(sort, 'Nome (A a Z)')
    expect(titles()[0]).toBe('9ª Festa Literária de Ilhéus (FLI)')
    expect(titles()[1]).toBe('Carnaval 2027')
    await userEvent.selectOptions(sort, 'Categoria')
    expect(titles()[0]).toBe('Natal Encantado')
  })

  it('keeps the filters when the order changes', async () => {
    render(<EventsScreen now={OCT_29} />)
    await userEvent.click(chip('Esportes'))
    await userEvent.selectOptions(screen.getByLabelText('Ordenar por'), 'Nome (A a Z)')
    expect(titles()).toEqual(['Circuito do Cacau Surf: Etapa Final', 'Corrida da Ponte'])
  })

  it('brings back the events that already happened, marked as such', async () => {
    render(<EventsScreen now={OCT_29} />)
    await userEvent.click(chip('Gastronomia'))
    expect(screen.getByText('Nenhum evento com esses filtros')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('switch', { name: /Mostrar eventos que já passaram/ }))
    expect(titles()).toEqual(['Chocolat Bahia (17ª Edição)'])
    expect(cards()[0]).toHaveTextContent('Já aconteceu')
  })

  it('says plainly when nothing matches and clears the filters', async () => {
    render(<EventsScreen now={OCT_29} />)
    await userEvent.click(chip('Este mês'))
    expect(screen.getByText('Nenhum evento com esses filtros')).toBeInTheDocument()
    expect(screen.getByText('0 eventos')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }))
    expect(cards().length).toBeGreaterThanOrEqual(10)
    expect(chip('Qualquer data')).toHaveAttribute('aria-pressed', 'true')
  })

  it('warns that dates and schedules may change', () => {
    render(<EventsScreen now={OCT_29} />)
    expect(screen.getByText(/Datas e programação podem mudar/)).toBeInTheDocument()
  })

  it('reads in English and in French', () => {
    const english = render(
      <I18nProvider language="en">
        <EventsScreen now={OCT_29} />
      </I18nProvider>,
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Events' })).toBeInTheDocument()
    expect(chip('Music and concerts')).toBeInTheDocument()
    expect(screen.getByLabelText('Sort by')).toBeInTheDocument()
    english.unmount()
    render(
      <I18nProvider language="fr">
        <EventsScreen now={OCT_29} />
      </I18nProvider>,
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Événements' })).toBeInTheDocument()
  })
})

describe('EventScreen', () => {
  const fli = findEvent('festa-literaria-de-ilheus-2026')

  it('shows the event with its date, place, story, link to the place and sources', () => {
    if (!fli) throw new Error('missing event')
    render(<EventScreen event={fli} now={OCT_29} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Evento' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: '9ª Festa Literária de Ilhéus (FLI)' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/11.*14.*nov.*2026/)).toBeInTheDocument()
    expect(screen.getByText(/Praça Dom Eduardo e região da Catedral/)).toBeInTheDocument()
    expect(screen.getByText(/Como será o amanhã/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Catedral de São Sebastião/ })).toHaveAttribute(
      'href',
      '#/lugar/catedral-de-sao-sebastiao',
    )
    const source = screen.getByRole('link', { name: /Fonte: jornalgrandebahia.com.br/ })
    expect(source).toHaveAttribute('target', '_blank')
    expect(source).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.getByText(/Datas e programação podem mudar/)).toBeInTheDocument()
  })

  it('marks an event that already happened', () => {
    const chocolat = findEvent('chocolat-bahia-2026')
    if (!chocolat) throw new Error('missing event')
    render(<EventScreen event={chocolat} now={OCT_29} />)
    expect(screen.getByText('Já aconteceu')).toBeInTheDocument()
  })

  it('opens from the list and goes back to it', async () => {
    renderApp('#/eventos')
    await userEvent.click(await screen.findByRole('link', { name: /9ª Festa Literária de Ilhéus/ }))
    expect(window.location.hash).toBe('#/evento/festa-literaria-de-ilheus-2026')
    expect(screen.getByRole('heading', { level: 1, name: 'Evento' })).toBeInTheDocument()
  })

  it('sends an event that does not exist back to the list', () => {
    renderApp('#/evento/nao-existe')
    expect(window.location.hash).toBe('#/eventos')
  })

  it('keeps Explorar marked in the bar on both screens', () => {
    renderApp('#/eventos')
    const bar = screen.getByRole('navigation', { name: 'Navegação principal' })
    expect(within(bar).getByRole('link', { name: 'Explorar' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('has an event page for every event in the list', () => {
    expect(EVENTS.every((item) => findEvent(item.id) === item)).toBe(true)
  })
})

describe('the way into the events', () => {
  it('is a row in Explorar', async () => {
    renderApp('#/explorar')
    const row = screen.getByRole('link', { name: /Eventos/ })
    expect(row).toHaveAttribute('href', '#/eventos')
    await userEvent.click(row)
    expect(window.location.hash).toBe('#/eventos')
  })
})
