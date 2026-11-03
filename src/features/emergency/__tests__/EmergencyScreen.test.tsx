import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StrictMode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { metersNorth, mockGeolocation, setOnline, USER } from '../../../test-utils/geolocation'
import { I18nProvider } from '../../../i18n/I18nProvider'
import type { Language } from '../../../i18n/i18n'
import { EmergencyScreen } from '../EmergencyScreen'
import type { EmergencyPlace, PlaceCategory } from '../places'

function place(
  id: string,
  category: PlaceCategory,
  metersFromUser: number,
  extra: Partial<EmergencyPlace> = {},
): EmergencyPlace {
  const { lat, lng } = metersNorth(USER, metersFromUser)
  return {
    id,
    category,
    name: `Fixture ${id}`,
    phone: `(00) 0000-00${id.length}${metersFromUser % 10}`,
    lat,
    lng,
    verifiedAt: '2026-01-01',
    source: 'fixture',
    ...extra,
  }
}

const PLACES: EmergencyPlace[] = [
  place('fire', 'fire', 2300),
  place('hospital', 'hospital', 1200, { hours: 'aberto 24 h' }),
  place('police-far', 'police', 900),
  place('police', 'police', 500),
  place('upa', 'upa', 1800),
]

const NUMBERS = [
  ['Polícia Militar', 'Police, Policía', '190'],
  ['SAMU, ambulância', 'Ambulance, Ambulancia', '192'],
  ['Corpo de Bombeiros', 'Fire department, Bomberos', '193'],
  ['Violência contra a mulher', 'Violence against women, Violencia contra la mujer', '180'],
  ['Defesa Civil', 'Civil defense, Defensa Civil', '199'],
] as const

let geo: ReturnType<typeof mockGeolocation>

beforeEach(() => {
  geo = mockGeolocation()
  setOnline(true)
})

afterEach(() => {
  Reflect.deleteProperty(navigator, 'geolocation')
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function numberLinks() {
  return screen
    .getAllByRole('link')
    .filter((link) => /^tel:(190|192|193|180|199)$/.test(link.getAttribute('href') ?? ''))
}

async function clickedHref(link: HTMLElement) {
  const seen: { href: string | null } = { href: null }
  const listener = (event: Event) => {
    event.preventDefault()
    seen.href = (event.target as Element).closest('a')?.getAttribute('href') ?? null
  }
  document.addEventListener('click', listener)
  await userEvent.click(link)
  document.removeEventListener('click', listener)
  return seen.href
}

function placeNames() {
  const list = screen.getByRole('list', { name: 'Lugares perto de você' })
  return within(list)
    .getAllByRole('listitem')
    .map((item) => within(item).getByRole('heading').textContent)
}

describe('EmergencyScreen', () => {
  it.each(NUMBERS)(
    'lists the five numbers: %s with %s and number %s',
    (title, subtitle, number) => {
      render(<EmergencyScreen places={PLACES} />)
      const link = screen.getByRole('link', { name: new RegExp(title) })
      expect(link).toHaveAttribute('href', `tel:${number}`)
      expect(within(link).getByText(title, { exact: true })).toBeInTheDocument()
      expect(within(link).getByText(subtitle, { exact: true })).toBeInTheDocument()
      expect(within(link).getByText(number, { exact: true })).toBeInTheDocument()
    },
  )

  it('lists the five numbers in the order 190, 192, 193, 180, 199', () => {
    render(<EmergencyScreen places={PLACES} />)
    expect(numberLinks().map((link) => link.getAttribute('href'))).toEqual([
      'tel:190',
      'tel:192',
      'tel:193',
      'tel:180',
      'tel:199',
    ])
  })

  describe('keeps the five numbers', () => {
    const expected = ['tel:190', 'tel:192', 'tel:193', 'tel:180', 'tel:199']
    const hrefs = () => numberLinks().map((link) => link.getAttribute('href'))

    it('while the position is pending', () => {
      render(<EmergencyScreen places={PLACES} />)
      expect(hrefs()).toEqual(expected)
    })

    it('when the position is denied', async () => {
      render(<EmergencyScreen places={PLACES} />)
      await act(async () => geo.deny())
      expect(hrefs()).toEqual(expected)
    })

    it('when the position fails with a timeout', async () => {
      render(<EmergencyScreen places={PLACES} />)
      await act(async () => geo.timeout())
      expect(hrefs()).toEqual(expected)
    })

    it('while the device is offline', () => {
      setOnline(false)
      render(<EmergencyScreen places={PLACES} />)
      expect(hrefs()).toEqual(expected)
    })
  })

  it('shows no patrocinado label', async () => {
    render(<EmergencyScreen places={PLACES} />)
    await act(async () => geo.resolve())
    expect(screen.queryByText(/patrocinado/i)).not.toBeInTheDocument()
  })

  it('does not ask the position while the places list is empty', async () => {
    render(
      <StrictMode>
        <EmergencyScreen places={[]} />
      </StrictMode>,
    )
    await act(async () => undefined)
    expect(geo.getCurrentPosition).not.toHaveBeenCalled()
    expect(screen.getByText(/Ainda não há lugares verificados/)).toBeInTheDocument()
    expect(numberLinks()).toHaveLength(5)
  })

  it('puts the Urgências row after the numbers', () => {
    render(<EmergencyScreen places={[]} />)
    const row = screen.getByRole('link', { name: 'Urgências do dia a dia' })
    expect(row).toHaveAttribute('href', '#/urgencias')
    const heading = screen.getByRole('heading', { level: 2, name: 'Mais perto de você' })
    const after = Node.DOCUMENT_POSITION_FOLLOWING
    expect(numberLinks().every((link) => link.compareDocumentPosition(row) & after)).toBe(true)
    expect(heading.compareDocumentPosition(row) & after).toBeTruthy()
  })

  it('asks the position once under StrictMode', async () => {
    render(
      <StrictMode>
        <EmergencyScreen places={PLACES} />
      </StrictMode>,
    )
    await act(async () => geo.resolve())
    expect(geo.getCurrentPosition).toHaveBeenCalledTimes(1)
    expect(geo.watchPosition).not.toHaveBeenCalled()
    expect(placeNames()).toHaveLength(4)
  })

  it('lists the nearest place of each category, nearest first', async () => {
    render(<EmergencyScreen places={PLACES} />)
    await act(async () => geo.resolve())
    expect(screen.getByRole('heading', { name: 'Mais perto de você' })).toBeInTheDocument()
    expect(placeNames()).toEqual([
      'Fixture police',
      'Fixture hospital',
      'Fixture upa',
      'Fixture fire',
    ])
  })

  it('shows the place row with name, category, distance, verification and hours', async () => {
    render(<EmergencyScreen places={PLACES} />)
    await act(async () => geo.resolve())
    const list = screen.getByRole('list', { name: 'Lugares perto de você' })
    const hospital = within(list).getByRole('heading', { name: 'Fixture hospital' }).closest('li')!
    expect(hospital).toHaveTextContent('Hospital, 1,2 km, aberto 24 h')
    expect(hospital).toHaveTextContent('Verificado pela equipe do Amado')
    const police = within(list).getByRole('heading', { name: 'Fixture police' }).closest('li')!
    expect(police).toHaveTextContent('Polícia, 500 m')
    expect(police).not.toHaveTextContent('aberto')
  })

  it('shows the place row for a place at the user position as 0 m', async () => {
    render(<EmergencyScreen places={[place('here', 'police', 0)]} />)
    await act(async () => geo.resolve())
    const row = screen.getByRole('heading', { name: 'Fixture here' }).closest('li')!
    expect(row).toHaveTextContent('Polícia, 0 m')
  })

  it('Ligar opens the dialer with the place phone', async () => {
    render(<EmergencyScreen places={PLACES} />)
    await act(async () => geo.resolve())
    const link = screen.getByRole('link', { name: /Ligar para Fixture hospital/ })
    expect(link).toHaveTextContent('Ligar')
    expect(await clickedHref(link)).toBe(`tel:${PLACES[1]!.phone}`)
  })

  it('Rota opens the directions link of the place, without the user position', async () => {
    render(<EmergencyScreen places={PLACES} />)
    await act(async () => geo.resolve())
    const link = screen.getByRole('link', { name: /Rota para Fixture hospital/ })
    expect(link).toHaveTextContent('Rota')
    const href = await clickedHref(link)
    const target = PLACES[1]!
    expect(href).toBe(
      `https://www.google.com/maps/dir/?api=1&destination=${target.lat},${target.lng}`,
    )
    expect(href).not.toContain(String(USER.lat))
    expect(href).not.toContain('origin')
  })

  it.each([
    ['denied', () => geo.deny()],
    ['unavailable', () => geo.unavailable()],
    ['timed out', () => geo.timeout()],
  ])(
    'without a position (%s) lists every place by category with no distance',
    async (_name, fail) => {
      render(<EmergencyScreen places={PLACES} />)
      await act(async () => fail())
      expect(
        screen.getByText('Sem a sua localização, não dá para ordenar por distância.'),
      ).toBeInTheDocument()
      expect(placeNames()).toEqual([
        'Fixture police',
        'Fixture police-far',
        'Fixture hospital',
        'Fixture upa',
        'Fixture fire',
      ])
      const list = screen.getByRole('list', { name: 'Lugares perto de você' })
      expect(list).not.toHaveTextContent(/\d+(,\d)? (m|km)\b/)
    },
  )

  it('shows a loading block while the position is pending and keeps the numbers usable', async () => {
    render(<EmergencyScreen places={PLACES} />)
    expect(
      screen.getByRole('status', { name: 'Procurando lugares perto de você' }),
    ).toBeInTheDocument()
    for (const link of numberLinks()) {
      expect(link).not.toHaveAttribute('aria-disabled')
    }
    await act(async () => geo.resolve())
    expect(screen.queryByRole('status', { name: 'Procurando lugares perto de você' })).toBeNull()
  })

  it('shows the empty state when there is no place', async () => {
    render(<EmergencyScreen places={[]} />)
    await act(async () => geo.resolve())
    expect(
      screen.getByText(
        'Ainda não há lugares verificados para mostrar. Os números acima funcionam sempre.',
      ),
    ).toBeInTheDocument()
    expect(numberLinks()).toHaveLength(5)
  })

  it('offline shows the same places and distances and makes no network request', async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    const xhrSpy = vi.fn()
    vi.stubGlobal('XMLHttpRequest', xhrSpy)

    const online = render(<EmergencyScreen places={PLACES} />)
    await act(async () => geo.resolve())
    const onlineRows = screen.getByRole('list', { name: 'Lugares perto de você' }).textContent
    online.unmount()

    setOnline(false)
    render(<EmergencyScreen places={PLACES} />)
    await act(async () => geo.resolve())
    const offlineRows = screen.getByRole('list', { name: 'Lugares perto de você' }).textContent

    expect(offlineRows).toBe(onlineRows)
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(xhrSpy).not.toHaveBeenCalled()
  })

  it('offline and online events show and remove the alert without a reload', () => {
    render(<EmergencyScreen places={PLACES} />)
    expect(screen.queryByRole('alert')).toBeNull()

    act(() => {
      setOnline(false)
      window.dispatchEvent(new Event('offline'))
    })
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Sem internet')
    expect(alert).toHaveTextContent(
      'Os números de emergência e os lugares salvos no aparelho continuam funcionando.',
    )

    act(() => {
      setOnline(true)
      window.dispatchEvent(new Event('online'))
    })
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('never keeps the position in storage, cookies, the console or the network', async () => {
    const consoleSpies = (['log', 'info', 'warn', 'error', 'debug'] as const).map((method) =>
      vi.spyOn(console, method).mockImplementation(() => undefined),
    )
    const cookieSetter = vi.spyOn(document, 'cookie', 'set')
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    const xhrSpy = vi.fn()
    vi.stubGlobal('XMLHttpRequest', xhrSpy)
    const indexedDbOpen = vi.fn()
    vi.stubGlobal('indexedDB', { open: indexedDbOpen })
    localStorage.clear()
    sessionStorage.clear()

    render(<EmergencyScreen places={PLACES} />)
    await act(async () => geo.resolve())
    await clickedHref(screen.getByRole('link', { name: /Rota para Fixture hospital/ }))

    expect(localStorage).toHaveLength(0)
    expect(sessionStorage).toHaveLength(0)
    expect(indexedDbOpen).not.toHaveBeenCalled()
    expect(cookieSetter).not.toHaveBeenCalled()
    for (const spy of consoleSpies) {
      const logged = JSON.stringify(spy.mock.calls)
      expect(logged).not.toContain('14.78')
      expect(logged).not.toContain('39.04')
    }
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(xhrSpy).not.toHaveBeenCalled()
  })

  describe('in the chosen language', () => {
    const renderIn = (language: Language, places: EmergencyPlace[] = PLACES) =>
      render(
        <I18nProvider language={language}>
          <EmergencyScreen places={places} />
        </I18nProvider>,
      )

    it.each([
      ['en', 'Emergency', 'Tap to call. The numbers are saved on your device.', 'Closest to you'],
      [
        'es',
        'Emergencia',
        'Toca para llamar. Los números están guardados en tu dispositivo.',
        'Más cerca de ti',
      ],
    ] as const)('reads in the chosen language: %s', async (language, title, lead, nearby) => {
      renderIn(language)
      await act(async () => geo.resolve())
      expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument()
      expect(screen.getByText(lead)).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: nearby })).toBeInTheDocument()
    })

    it('reads the call and route actions and the empty state in the chosen language', async () => {
      renderIn('en')
      await act(async () => geo.resolve())
      expect(screen.getByRole('link', { name: 'Call Fixture hospital' })).toHaveTextContent('Call')
      expect(screen.getByRole('link', { name: 'Route to Fixture hospital' })).toHaveTextContent(
        'Route',
      )
      expect(screen.getByRole('link', { name: /Police/ })).toBeInTheDocument()
    })

    it('reads the empty state and the no-position line in the chosen language', async () => {
      const empty = renderIn('es', [])
      expect(
        screen.getByText(
          'Aún no hay lugares verificados para mostrar. Los números de arriba siempre funcionan.',
        ),
      ).toBeInTheDocument()
      empty.unmount()
      renderIn('en')
      await act(async () => geo.deny())
      expect(
        screen.getByText('Without your location we cannot sort by distance.'),
      ).toBeInTheDocument()
    })

    it.each(['pt', 'en', 'es'] as const)(
      'keeps the tel links in every language: %s',
      (language) => {
        renderIn(language)
        expect(numberLinks().map((link) => link.getAttribute('href'))).toEqual([
          'tel:190',
          'tel:192',
          'tel:193',
          'tel:180',
          'tel:199',
        ])
      },
    )

    it('offline and online events show the alert in Spanish', async () => {
      renderIn('es')
      await act(async () => {
        setOnline(false)
        window.dispatchEvent(new Event('offline'))
      })
      const alert = screen.getByRole('alert')
      expect(alert).toHaveTextContent('Sin internet')
      expect(alert).toHaveTextContent(
        'Los números de emergencia y los lugares guardados en tu dispositivo siguen funcionando.',
      )
    })
  })
})

describe('EmergencyScreen order', () => {
  it('offline and online events keep the alert above the numbers', async () => {
    render(<EmergencyScreen places={PLACES} />)
    await act(async () => {
      setOnline(false)
      window.dispatchEvent(new Event('offline'))
    })
    const alert = screen.getByRole('alert')
    const numbers = screen.getByRole('list', { name: 'Números de emergência' })
    expect(alert.compareDocumentPosition(numbers) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})
