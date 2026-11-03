import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { I18nProvider } from '../../../i18n/I18nProvider'
import { resetBrowser } from '../../../test-utils/app'
import { CircuitScreen } from '../CircuitScreen'
import { findCircuit } from '../circuits'

const circuit = findCircuit('circuito-cultural-do-centro')!

beforeEach(() => resetBrowser())

describe('CircuitScreen', () => {
  it('shows the stops in order as links', () => {
    render(<CircuitScreen circuit={circuit} />)
    expect(
      screen.getByRole('heading', { level: 2, name: 'Circuito Cultural do Centro' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Três lugares do centro histórico, na ordem do passeio'),
    ).toBeInTheDocument()
    expect(screen.getByText('Exemplo')).toBeInTheDocument()
    const stops = within(screen.getByRole('list')).getAllByRole('link')
    expect(stops.map((stop) => stop.textContent)).toEqual([
      '1. Casa de Jorge Amado',
      '2. Catedral de São Sebastião',
      '3. Bar Vesúvio',
    ])
    expect(stops.map((stop) => stop.getAttribute('href'))).toEqual([
      '#/lugar/casa-de-jorge-amado',
      '#/lugar/catedral-de-sao-sebastiao',
      '#/lugar/bar-vesuvio',
    ])
  })

  it('Iniciar roteiro opens the first stop', async () => {
    render(<CircuitScreen circuit={circuit} />)
    const start = screen.getByRole('link', { name: 'Iniciar roteiro' })
    expect(start).toHaveAttribute('href', '#/lugar/casa-de-jorge-amado')
    await userEvent.click(start)
    expect(window.location.hash).toBe('#/lugar/casa-de-jorge-amado')
  })

  it('shows no duration author distance or route', () => {
    render(<CircuitScreen circuit={circuit} />)
    expect(document.body.textContent).not.toMatch(
      /\bkm\b|\b\d+ ?(m|h|min)\b|\bautor|curado|\bRota\b/i,
    )
  })

  it('reads in English', () => {
    render(
      <I18nProvider language="en">
        <CircuitScreen circuit={circuit} />
      </I18nProvider>,
    )
    expect(
      screen.getByRole('heading', { level: 2, name: 'Historic centre cultural circuit' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Start the route' })).toBeInTheDocument()
  })
})
