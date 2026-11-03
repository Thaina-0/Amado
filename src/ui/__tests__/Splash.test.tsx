import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Splash } from '../Splash'

function stubMotion(reduce: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    value: vi.fn().mockReturnValue({ matches: reduce }),
    configurable: true,
    writable: true,
  })
}

describe('Splash', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    window.sessionStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
    Reflect.deleteProperty(window, 'matchMedia')
  })

  it('plays on the first open, fades out and then leaves the page', () => {
    stubMotion(false)
    render(<Splash />)
    const splash = screen.getByTestId('splash')
    expect(splash).toHaveClass('opacity-100')

    act(() => void vi.advanceTimersByTime(2400))
    expect(screen.getByTestId('splash')).toHaveClass('opacity-0')

    act(() => void vi.advanceTimersByTime(450))
    expect(screen.queryByTestId('splash')).toBeNull()
  })

  it('writes the name and the whole tagline, with the last word set apart', () => {
    stubMotion(false)
    render(<Splash />)
    const splash = screen.getByTestId('splash')
    expect(splash).toHaveTextContent('Amado')
    expect(splash).toHaveTextContent('Ilhéus contada por quem ama')
    expect(screen.getByText('ama')).toHaveClass('animate-ama-pop')
  })

  it('stays hidden from assistive technology so it never reads before the app', () => {
    stubMotion(false)
    render(<Splash />)
    expect(screen.getByTestId('splash')).toHaveAttribute('aria-hidden', 'true')
  })

  it('is skipped when the person asks for reduced motion', () => {
    stubMotion(true)
    render(<Splash />)
    expect(screen.queryByTestId('splash')).toBeNull()
  })

  it('plays again on every page load, so a reload of the first screen shows it', () => {
    stubMotion(false)
    const first = render(<Splash />)
    act(() => void vi.advanceTimersByTime(2850))
    expect(screen.queryByTestId('splash')).toBeNull()
    first.unmount()

    render(<Splash />)
    expect(screen.getByTestId('splash')).toHaveClass('opacity-100')
  })

  it('is skipped where matchMedia does not exist', () => {
    render(<Splash />)
    expect(screen.queryByTestId('splash')).toBeNull()
  })
})
