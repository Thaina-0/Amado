import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PhotoCarousel } from '../PhotoCarousel'
import { EXAMPLE_PLACES } from '../places'

const place = (id: string) => EXAMPLE_PLACES.find((candidate) => candidate.id === id)!
const VESUVIO = place('bar-vesuvio')
const slide = (n: number, total = 3) => screen.getByRole('group', { name: `Foto ${n} de ${total}` })
const click = (name: string) => fireEvent.click(screen.getByRole('button', { name }))
const NEXT = 'Próxima foto'
const PREVIOUS = 'Foto anterior'

function stubMotion(reduce: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    value: vi.fn().mockReturnValue({ matches: reduce }),
    configurable: true,
    writable: true,
  })
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  Reflect.deleteProperty(window, 'matchMedia')
})

describe('PhotoCarousel', () => {
  it('shows the first photo of a carousel named after the place, with its credit', () => {
    render(<PhotoCarousel place={VESUVIO} />)
    expect(screen.getByRole('region', { name: 'Fotos de Bar Vesúvio' })).toHaveAttribute(
      'aria-roledescription',
      'carousel',
    )
    expect(slide(1)).toBeInTheDocument()
    expect(screen.getAllByRole('img')).toHaveLength(1)
    const photo = screen.getByRole('img', { name: 'Foto de Bar Vesúvio' })
    expect(photo).toHaveAttribute('src', '/places/bar-vesuvio/1.webp')
    expect(photo).toHaveAttribute(
      'srcset',
      '/places/bar-vesuvio/1-480.webp 480w, /places/bar-vesuvio/1.webp 960w',
    )
    expect(photo).toHaveAttribute('fetchpriority', 'high')
    const credit = screen.getByRole('link', { name: 'Foto: Sintegrity · CC BY-SA 4.0' })
    expect(credit).toHaveAttribute('href', expect.stringContaining('commons.wikimedia.org'))
    expect(credit).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('moves with the arrows and comes around at both ends', () => {
    render(<PhotoCarousel place={VESUVIO} />)
    click(NEXT)
    expect(slide(2)).toBeInTheDocument()
    click(NEXT)
    expect(screen.getByRole('link', { name: 'Foto: Zaharinha · CC BY-SA 4.0' })).toBeInTheDocument()
    click(NEXT)
    expect(slide(1)).toBeInTheDocument()
    click(PREVIOUS)
    expect(slide(3)).toBeInTheDocument()
  })

  it('moves with the keyboard arrows', () => {
    render(<PhotoCarousel place={VESUVIO} />)
    const region = screen.getByRole('region', { name: 'Fotos de Bar Vesúvio' })
    fireEvent.keyDown(region, { key: 'ArrowRight' })
    expect(slide(2)).toBeInTheDocument()
    fireEvent.keyDown(region, { key: 'ArrowLeft' })
    fireEvent.keyDown(region, { key: 'ArrowLeft' })
    expect(slide(3)).toBeInTheDocument()
  })

  it('changes photo by itself every five seconds and comes back to the first', () => {
    render(<PhotoCarousel place={VESUVIO} />)
    act(() => void vi.advanceTimersByTime(4900))
    expect(slide(1)).toBeInTheDocument()
    act(() => void vi.advanceTimersByTime(200))
    expect(slide(2)).toBeInTheDocument()
    act(() => void vi.advanceTimersByTime(5000))
    expect(slide(3)).toBeInTheDocument()
    act(() => void vi.advanceTimersByTime(5000))
    expect(slide(1)).toBeInTheDocument()
  })

  it('stops by itself once the person takes control with an arrow', () => {
    render(<PhotoCarousel place={VESUVIO} />)
    click(NEXT)
    act(() => void vi.advanceTimersByTime(30000))
    expect(slide(2)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Retomar a troca automática de fotos' }),
    ).toBeInTheDocument()
  })

  it('pauses and resumes with the button', () => {
    render(<PhotoCarousel place={VESUVIO} />)
    click('Pausar a troca automática de fotos')
    act(() => void vi.advanceTimersByTime(20000))
    expect(slide(1)).toBeInTheDocument()
    click('Retomar a troca automática de fotos')
    act(() => void vi.advanceTimersByTime(5100))
    expect(slide(2)).toBeInTheDocument()
  })

  it('waits while the pointer rests on it or the focus is inside', () => {
    render(<PhotoCarousel place={VESUVIO} />)
    const region = screen.getByRole('region', { name: 'Fotos de Bar Vesúvio' })
    fireEvent.mouseEnter(region)
    act(() => void vi.advanceTimersByTime(12000))
    expect(slide(1)).toBeInTheDocument()
    fireEvent.mouseLeave(region)
    act(() => void vi.advanceTimersByTime(5100))
    expect(slide(2)).toBeInTheDocument()
  })

  it('does not change by itself for people who ask for less motion', () => {
    stubMotion(true)
    render(<PhotoCarousel place={VESUVIO} />)
    act(() => void vi.advanceTimersByTime(30000))
    expect(slide(1)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Retomar a troca automática de fotos' }),
    ).toBeInTheDocument()
  })

  it('has no arrows, button or dots for a single photo', () => {
    const single = place('igreja-de-sao-jorge')
    render(<PhotoCarousel place={single} />)
    expect(screen.queryByRole('button')).toBeNull()
    expect(slide(1, 1)).toBeInTheDocument()
  })

  it('says plainly that a place has no photos yet', () => {
    render(<PhotoCarousel place={place('futevolei')} />)
    expect(
      screen.getByRole('img', { name: 'Ainda não temos fotos deste lugar.' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('marks a photo that only illustrates the place', () => {
    render(<PhotoCarousel place={place('surf')} />)
    expect(screen.getByText(/Foto ilustrativa/)).toBeInTheDocument()
  })

  it('does not call a photo of the place illustrative when it is the place itself', () => {
    render(<PhotoCarousel place={VESUVIO} />)
    expect(screen.queryByText(/Foto ilustrativa/)).toBeNull()
  })

  it('reads in English', async () => {
    const { I18nProvider } = await import('../../../i18n/I18nProvider')
    render(
      <I18nProvider language="en">
        <PhotoCarousel place={VESUVIO} />
      </I18nProvider>,
    )
    expect(screen.getByRole('region', { name: 'Photos of Bar Vesúvio' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next photo' })).toBeInTheDocument()
  })
})
