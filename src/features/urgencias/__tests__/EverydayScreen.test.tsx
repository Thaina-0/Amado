import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StrictMode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockGeolocation } from '../../../test-utils/geolocation'
import { provider } from '../../../test-utils/providers'
import { EverydayScreen } from '../EverydayScreen'
import { PROVIDER_CATEGORIES } from '../providers'

const LOCKSMITH = provider('lock', 'chaveiro', 300, { open24h: true, hours: 'plantão' })
const TOW = provider('tow', 'guincho', 100)

let geo: ReturnType<typeof mockGeolocation>

beforeEach(() => {
  geo = mockGeolocation()
})

afterEach(() => {
  Reflect.deleteProperty(navigator, 'geolocation')
  vi.restoreAllMocks()
})

const listed = () => screen.queryAllByRole('heading', { level: 3 }).map((item) => item.textContent)

describe('EverydayScreen', () => {
  it('shows the lead and the link to Emergência', () => {
    render(<EverydayScreen />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Urgências do dia a dia' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Para o que não é risco de vida')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver números de emergência' })).toHaveAttribute(
      'href',
      '#/emergencia',
    )
    expect(screen.getByRole('button', { name: 'Voltar' })).toBeInTheDocument()
  })

  it('shows the eight chips with Tudo selected', () => {
    render(<EverydayScreen />)
    const chips = within(screen.getByRole('group', { name: 'Tipos de urgência' })).getAllByRole(
      'button',
    )
    expect(chips.map((chip) => chip.textContent)).toEqual([
      'Tudo',
      'Chaveiro',
      'Mecânico',
      'Guincho',
      'Borracheiro',
      'Farmácia de plantão',
      'Eletricista',
      'Encanador',
    ])
    expect(chips.map((chip) => chip.getAttribute('aria-pressed'))).toEqual([
      'true',
      ...Array<string>(7).fill('false'),
    ])
  })

  it('a chip filters the providers', async () => {
    render(<EverydayScreen providers={[LOCKSMITH, TOW]} />)
    await act(async () => geo.resolve())
    expect(listed()).toEqual(['Fixture tow', 'Fixture lock'])
    await userEvent.click(screen.getByRole('button', { name: 'Guincho' }))
    expect(listed()).toEqual(['Fixture tow'])
    expect(screen.getByRole('button', { name: 'Guincho' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Tudo' })).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(screen.getByRole('button', { name: 'Tudo' }))
    expect(listed()).toHaveLength(2)
  })

  it('shows the empty line when no provider matches', async () => {
    const empty = render(<EverydayScreen />)
    expect(screen.getByText('Ainda não há prestadores verificados aqui.')).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Prestadores verificados' })).toBeNull()
    const chips = within(screen.getByRole('group', { name: 'Tipos de urgência' })).getAllByRole(
      'button',
    )
    expect(chips).toHaveLength(PROVIDER_CATEGORIES.length + 1)
    for (const chip of chips) {
      await userEvent.click(chip)
      expect(screen.getByText('Ainda não há prestadores verificados aqui.')).toBeInTheDocument()
    }
    empty.unmount()

    render(<EverydayScreen providers={[LOCKSMITH]} />)
    await act(async () => geo.resolve())
    await userEvent.click(screen.getByRole('button', { name: 'Guincho' }))
    expect(screen.getByText('Ainda não há prestadores verificados aqui.')).toBeInTheDocument()
    expect(listed()).toEqual([])
    await userEvent.click(screen.getByRole('button', { name: 'Chaveiro' }))
    expect(listed()).toEqual(['Fixture lock'])
  })

  it('a provider row shows its details and links', async () => {
    render(<EverydayScreen providers={[LOCKSMITH]} />)
    await act(async () => geo.resolve())
    const row = screen.getByRole('heading', { level: 3, name: 'Fixture lock' }).closest('li')!
    const text = row.textContent ?? ''
    for (const part of [
      'Chaveiro',
      '300 m',
      'Aberto 24 h',
      'plantão',
      'Verificado pela equipe do Amado',
    ]) {
      expect(text).toContain(part)
    }
    expect(within(row).getByRole('link', { name: 'Ligar para Fixture lock' })).toHaveAttribute(
      'href',
      'tel:(73) 0000-1111',
    )
    const route = within(row).getByRole('link', { name: 'Rota para Fixture lock' })
    expect(route.getAttribute('href')).toContain(`${LOCKSMITH.lat},${LOCKSMITH.lng}`)
  })

  it('a provider row shows its details and links, Aberto 24 h only when open24h', async () => {
    render(<EverydayScreen providers={[LOCKSMITH, TOW]} />)
    await act(async () => geo.resolve())
    const lock = screen.getByRole('heading', { level: 3, name: 'Fixture lock' }).closest('li')!
    const tow = screen.getByRole('heading', { level: 3, name: 'Fixture tow' }).closest('li')!
    expect(lock).toHaveTextContent('Aberto 24 h')
    expect(tow).not.toHaveTextContent('Aberto 24 h')
    expect(tow).not.toHaveTextContent('plantão')
  })

  it('every control has a name and a visible label', async () => {
    render(<EverydayScreen providers={[LOCKSMITH, TOW]} />)
    await act(async () => geo.resolve())
    const controls = [...screen.getAllByRole('link'), ...screen.getAllByRole('button')]
    for (const control of controls) {
      expect(control).toHaveAccessibleName()
      if (control.getAttribute('aria-label') !== 'Voltar') {
        expect(control.textContent?.trim(), control.outerHTML).toBeTruthy()
      }
    }
    expect(screen.getAllByRole('link', { name: /^Ligar para / })).toHaveLength(2)
    expect(screen.getAllByRole('link', { name: /^Rota para / })).toHaveLength(2)
  })

  it('shows the providers without a distance when the position is denied', async () => {
    render(<EverydayScreen providers={[LOCKSMITH]} />)
    await act(async () => geo.deny())
    expect(
      screen.getByText('Sem a sua localização, não dá para ordenar por distância.'),
    ).toBeInTheDocument()
    expect(listed()).toEqual(['Fixture lock'])
    expect(document.body.textContent).not.toContain('300 m')
  })

  it('shows no patrocinado', async () => {
    render(<EverydayScreen providers={[LOCKSMITH, TOW]} />)
    await act(async () => geo.resolve())
    expect(screen.queryByText(/patrocinado|sponsored/i)).not.toBeInTheDocument()
  })

  it('asks the position only with a provider', async () => {
    const empty = render(<EverydayScreen providers={[]} />)
    await act(async () => undefined)
    expect(geo.getCurrentPosition).not.toHaveBeenCalled()
    empty.unmount()

    render(
      <StrictMode>
        <EverydayScreen providers={[LOCKSMITH]} />
      </StrictMode>,
    )
    await act(async () => geo.resolve())
    expect(geo.getCurrentPosition).toHaveBeenCalledTimes(1)
    expect(geo.watchPosition).not.toHaveBeenCalled()
  })
})
