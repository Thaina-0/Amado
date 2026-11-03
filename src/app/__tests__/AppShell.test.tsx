import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Place } from '../../features/places/places'
import { PreferencesProvider } from '../../preferences/PreferencesProvider'
import { mockGeolocation } from '../../test-utils/geolocation'
import { AppShell } from '../AppShell'
import { signIn } from '../../features/account/session'
import { mockPermission, renderApp, resetBrowser, seedPreferences } from '../../test-utils/app'

beforeEach(() => {
  resetBrowser()
  mockGeolocation()
  mockPermission(undefined)
})

afterEach(() => {
  Reflect.deleteProperty(navigator, 'geolocation')
  vi.restoreAllMocks()
})

const bar = () => screen.queryByRole('navigation', { name: 'Navegação principal' })

describe('AppShell', () => {
  it('opens on Boas-vindas with no preferences and no account', async () => {
    renderApp()
    expect(heading('Bem-vindo ao Amado')).toBeInTheDocument()
    await waitFor(() => expect(window.location.hash).toBe('#/boas-vindas'))
    expect(bar()).toBeNull()
  })

  it('opens on Boas-vindas when onboarding is done but nobody is signed in', async () => {
    seedPreferences()
    renderApp()
    expect(heading('Bem-vindo ao Amado')).toBeInTheDocument()
    await waitFor(() => expect(window.location.hash).toBe('#/boas-vindas'))
  })

  it('opens on Início when onboarding is done and someone is signed in', async () => {
    seedPreferences()
    signIn('Maria')
    renderApp()
    expect(screen.getByRole('heading', { level: 1, name: 'Hoje em Ilhéus' })).toBeInTheDocument()
    await waitFor(() => expect(window.location.hash).toBe('#/inicio'))
  })

  it('tapping a tab goes to its route and marks it', async () => {
    seedPreferences()
    renderApp('#/inicio')
    const tabs = within(bar()!)
    expect(tabs.getAllByRole('link').map((link) => link.textContent)).toEqual([
      'Início',
      'Explorar',
      'Perto de mim',
      'Roteiro',
      'Emergência',
    ])
    await userEvent.click(tabs.getByRole('link', { name: 'Perto de mim' }))
    await waitFor(() => expect(window.location.hash).toBe('#/perto-de-mim'))
    expect(tabs.getByRole('link', { name: 'Perto de mim' })).toHaveAttribute('aria-current', 'page')
    expect(tabs.getByRole('link', { name: 'Início' })).not.toHaveAttribute('aria-current')
    await userEvent.click(tabs.getByRole('link', { name: 'Emergência' }))
    await waitFor(() => expect(window.location.hash).toBe('#/emergencia'))
    expect(screen.getByRole('heading', { level: 1, name: 'Emergência' })).toBeInTheDocument()
  })

  it('tapping a tab goes to its route: Lugar marks Perto de mim, Perfil and Privacidade mark none', () => {
    seedPreferences()
    const lugar = renderApp('#/lugar/bar-vesuvio')
    expect(within(bar()!).getByRole('link', { name: 'Perto de mim' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    lugar.unmount()
    for (const hash of ['#/perfil', '#/privacidade']) {
      const view = renderApp(hash)
      for (const link of within(bar()!).getAllByRole('link')) {
        expect(link).not.toHaveAttribute('aria-current')
      }
      view.unmount()
    }
  })

  it('Back returns to the previous screen without reloading', async () => {
    seedPreferences()
    renderApp('#/inicio')
    await userEvent.click(within(bar()!).getByRole('link', { name: 'Perto de mim' }))
    await waitFor(() => expect(window.location.hash).toBe('#/perto-de-mim'))
    window.history.back()
    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1, name: 'Hoje em Ilhéus' })).toBeInTheDocument(),
    )
  })

  it('pending onboarding guards the tabs and keeps Emergência reachable', async () => {
    renderApp('#/emergencia')
    expect(screen.getByRole('heading', { level: 1, name: 'Emergência' })).toBeInTheDocument()
    await userEvent.click(within(bar()!).getByRole('link', { name: 'Início' }))
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { level: 1, name: 'Escolha o idioma' }),
      ).toBeInTheDocument(),
    )
    window.history.replaceState(null, '', '#/emergencia')
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1, name: 'Emergência' })).toBeInTheDocument(),
    )
  })

  it('Emergência shows the bar with five tabs and no Perfil icon', () => {
    seedPreferences()
    renderApp('#/emergencia')
    expect(within(bar()!).getAllByRole('link')).toHaveLength(5)
    expect(within(bar()!).getByRole('link', { name: 'Emergência' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.queryByRole('link', { name: 'Abrir perfil' })).toBeNull()
  })

  it('picking a language changes the text and lang', async () => {
    renderApp('#/idioma')
    expect(screen.getByText('Você pode trocar depois, no perfil.')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('radio', { name: 'English' }))
    expect(screen.getByText('You can change this later, in your profile.')).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('en')
    await userEvent.click(screen.getByRole('radio', { name: 'Español' }))
    expect(screen.getByText('Puedes cambiarlo después, en tu perfil.')).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('es')
    await userEvent.click(screen.getByRole('radio', { name: 'Português' }))
    expect(document.documentElement.lang).toBe('pt-BR')
  })

  it('no bar on the first screens', async () => {
    renderApp()
    expect(bar()).toBeNull()
    await userEvent.click(screen.getByRole('link', { name: 'Fazer login' }))
    await waitFor(() => expect(window.location.hash).toBe('#/entrar'))
    expect(bar()).toBeNull()
    window.location.hash = '#/idioma'
    await screen.findByRole('heading', { level: 1, name: 'Escolha o idioma' })
    expect(bar()).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }))
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { level: 1, name: 'Mostre o que há perto de você' }),
      ).toBeInTheDocument(),
    )
    expect(bar()).toBeNull()
  })

  it.each([
    '#/idioma',
    '#/localizacao',
    '#/inicio',
    '#/explorar',
    '#/explorar/cultura',
    '#/explorar/circuitos',
    '#/circuito/circuito-cultural-do-centro',
    '#/perto-de-mim',
    '#/lugar/bar-vesuvio',
    '#/emergencia',
    '#/urgencias',
    '#/perfil',
    '#/privacidade',
  ])('shows no patrocinado on any screen: %s', (hash) => {
    seedPreferences()
    renderApp(hash)
    expect(screen.queryByText(/patrocinado|sponsored/i)).toBeNull()
  })
})

describe('AppShell, further cases', () => {
  it('shows the bar on Idioma once onboarding is done', () => {
    seedPreferences()
    renderApp('#/idioma')
    expect(within(bar()!).getAllByRole('link')).toHaveLength(5)
    expect(screen.queryByRole('link', { name: 'Abrir perfil' })).toBeNull()
  })

  it('loading keeps the bar usable', async () => {
    seedPreferences()
    window.history.replaceState(null, '', '#/perto-de-mim')
    render(
      <PreferencesProvider>
        <AppShell load={() => new Promise<readonly Place[]>(() => undefined)} />
      </PreferencesProvider>,
    )
    expect(screen.getByRole('status', { name: 'Procurando lugares' })).toBeInTheDocument()
    await userEvent.click(within(bar()!).getByRole('link', { name: 'Emergência' }))
    await waitFor(() => expect(window.location.hash).toBe('#/emergencia'))
    expect(screen.getByRole('heading', { level: 1, name: 'Emergência' })).toBeInTheDocument()
  })

  it('does not crash on a malformed hash', async () => {
    seedPreferences()
    signIn('Maria')
    renderApp('#/lugar/%')
    expect(screen.getByRole('heading', { level: 1, name: 'Hoje em Ilhéus' })).toBeInTheDocument()
    await waitFor(() => expect(window.location.hash).toBe('#/inicio'))
  })
})

const NEW_HASHES = [
  '#/explorar',
  '#/explorar/gastronomia',
  '#/explorar/cultura',
  '#/explorar/praias',
  '#/explorar/esportes',
  '#/explorar/circuitos',
  '#/circuito/circuito-cultural-do-centro',
  '#/urgencias',
]

const heading = (name: string) => screen.getByRole('heading', { level: 1, name })

describe('AppShell, P2 screens', () => {
  it.each([
    '#/inicio',
    '#/explorar',
    '#/explorar/cultura',
    '#/circuito/circuito-cultural-do-centro',
    '#/perto-de-mim',
    '#/lugar/bar-vesuvio',
    '#/emergencia',
    '#/urgencias',
    '#/perfil',
    '#/privacidade',
    '#/idioma',
  ])('the bar has five tabs in order on %s', (hash) => {
    seedPreferences()
    renderApp(hash)
    expect(
      within(bar()!)
        .getAllByRole('link')
        .map((link) => link.textContent),
    ).toEqual(['Início', 'Explorar', 'Perto de mim', 'Roteiro', 'Emergência'])
  })

  it('tapping the Explorar tab shows Explorar and marks it', async () => {
    seedPreferences()
    renderApp('#/inicio')
    await userEvent.click(within(bar()!).getByRole('link', { name: 'Explorar' }))
    await waitFor(() => expect(window.location.hash).toBe('#/explorar'))
    expect(heading('Explorar')).toBeInTheDocument()
    expect(within(bar()!).getByRole('link', { name: 'Explorar' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it.each([
    ['#/explorar/cultura', 'Explorar'],
    ['#/circuito/circuito-cultural-do-centro', 'Explorar'],
    ['#/urgencias', 'Emergência'],
  ])('%s marks the %s tab', (hash, tab) => {
    seedPreferences()
    renderApp(hash)
    expect(within(bar()!).getByRole('link', { name: tab })).toHaveAttribute('aria-current', 'page')
  })

  it('pending onboarding guards Explorar and keeps Urgências open', async () => {
    renderApp('#/emergencia')
    await userEvent.click(within(bar()!).getByRole('link', { name: 'Explorar' }))
    await waitFor(() => expect(heading('Escolha o idioma')).toBeInTheDocument())
    window.history.replaceState(null, '', '#/urgencias')
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    await waitFor(() => expect(heading('Urgências do dia a dia')).toBeInTheDocument())
  })

  it('Back from a category returns to Explorar', async () => {
    seedPreferences()
    renderApp('#/explorar')
    await userEvent.click(screen.getByRole('link', { name: /^Cultura/ }))
    await waitFor(() => expect(window.location.hash).toBe('#/explorar/cultura'))
    await userEvent.click(screen.getByRole('button', { name: 'Voltar' }))
    await waitFor(() => expect(window.location.hash).toBe('#/explorar'))
    expect(heading('Explorar')).toBeInTheDocument()
  })

  it('Back from the first stop returns to the circuit', async () => {
    seedPreferences()
    renderApp('#/circuito/circuito-cultural-do-centro')
    await userEvent.click(screen.getByRole('link', { name: 'Iniciar roteiro' }))
    await waitFor(() => expect(window.location.hash).toBe('#/lugar/casa-de-jorge-amado'))
    await userEvent.click(screen.getByRole('button', { name: 'Voltar' }))
    await waitFor(() => expect(heading('Circuito')).toBeInTheDocument())
    expect(window.location.hash).toBe('#/circuito/circuito-cultural-do-centro')
  })

  it('the Urgências row opens Urgências and Back returns', async () => {
    seedPreferences()
    renderApp('#/emergencia')
    await userEvent.click(screen.getByRole('link', { name: 'Urgências do dia a dia' }))
    await waitFor(() => expect(window.location.hash).toBe('#/urgencias'))
    expect(heading('Urgências do dia a dia')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Voltar' }))
    await waitFor(() => expect(heading('Emergência')).toBeInTheDocument())
  })

  it('the new screens work offline without a request', async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    seedPreferences()
    const settled = async () =>
      waitFor(() => expect(screen.queryByRole('status', { name: 'Procurando lugares' })).toBeNull())
    const contentOf = async (hash: string) => {
      const view = renderApp(hash)
      await settled()
      const text = view.container.textContent
      view.unmount()
      return text
    }
    const online = new Map<string, string | null>()
    for (const hash of NEW_HASHES) online.set(hash, await contentOf(hash))
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true })
    try {
      for (const hash of NEW_HASHES) {
        const offline = await contentOf(hash)
        expect(offline, hash).toBe(online.get(hash))
        expect(offline?.length, hash).toBeGreaterThan(40)
      }
      const expected: [string, string][] = [
        ['#/explorar/cultura', 'Casa de Jorge Amado'],
        ['#/explorar/praias', 'Praia dos Milionários'],
        ['#/explorar/esportes', 'Futevôlei'],
        ['#/explorar/circuitos', 'Circuito Cultural do Centro'],
        ['#/circuito/circuito-cultural-do-centro', '3. Bar Vesúvio'],
        ['#/urgencias', 'Ainda não há prestadores verificados aqui.'],
      ]
      for (const [hash, text] of expected) {
        expect(await contentOf(hash), hash).toContain(text)
      }
      expect(fetchSpy).not.toHaveBeenCalled()
    } finally {
      Object.defineProperty(navigator, 'onLine', { value: true, configurable: true })
      vi.unstubAllGlobals()
    }
  })

  it('the new screens write nothing to storage', () => {
    seedPreferences()
    const before = { ...window.localStorage }
    for (const hash of NEW_HASHES) {
      const view = renderApp(hash)
      view.unmount()
    }
    expect({ ...window.localStorage }).toEqual(before)
    expect(Object.keys(window.localStorage)).toEqual(['amado.preferences.v1'])
  })

  it.each(NEW_HASHES)('every control of the new screens has a name on %s', (hash) => {
    seedPreferences()
    renderApp(hash)
    const controls = [...screen.getAllByRole('link'), ...screen.queryAllByRole('button')]
    expect(controls.length).toBeGreaterThan(0)
    for (const control of controls) {
      expect(control).toHaveAccessibleName()
      if (!['Voltar', 'Abrir perfil'].includes(control.getAttribute('aria-label') ?? '')) {
        expect(control.textContent?.trim(), control.outerHTML).toBeTruthy()
      }
    }
  })
})
