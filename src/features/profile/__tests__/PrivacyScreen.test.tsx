import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockPermission, renderWithPreferences, resetBrowser } from '../../../test-utils/app'
import { STORAGE_KEY } from '../../../preferences/preferences'
import { PrivacyScreen } from '../PrivacyScreen'

beforeEach(() => {
  resetBrowser()
  mockPermission(undefined)
})
afterEach(() => vi.restoreAllMocks())

describe('PrivacyScreen', () => {
  it('shows the intro, the three facts, the switch and the location row', async () => {
    renderWithPreferences(<PrivacyScreen />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Privacidade e dados' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'O Amado usa só o que precisa para funcionar. Recusar não tira nada do app.',
      ),
    ).toBeInTheDocument()
    for (const title of ['Só enquanto você usa', 'Em emergência, na hora', 'Dados só de grupos']) {
      expect(screen.getByText(title)).toBeInTheDocument()
    }
    expect(screen.getByRole('switch', { name: /Contar a minha visita/ })).toBeInTheDocument()
    expect(
      screen.getByText('Para mudar a permissão de localização, use os ajustes do navegador.'),
    ).toBeInTheDocument()
  })

  it('the switch flips countVisit, stores it and writes Ligado or Desligado', async () => {
    const { storage } = renderWithPreferences(<PrivacyScreen />)
    const toggle = screen.getByRole('switch', { name: /Contar a minha visita/ })
    expect(toggle).toHaveAttribute('aria-checked', 'false')
    expect(toggle).toHaveTextContent('Desligado')
    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-checked', 'true')
    expect(toggle).toHaveTextContent('Ligado')
    expect(JSON.parse(storage.data.get(STORAGE_KEY) ?? '{}')).toMatchObject({ countVisit: true })
    await userEvent.click(toggle)
    expect(toggle).toHaveTextContent('Desligado')
    expect(JSON.parse(storage.data.get(STORAGE_KEY) ?? '{}')).toMatchObject({ countVisit: false })
  })

  describe('the location row', () => {
    it.each([
      ['granted', 'Permitida'],
      ['denied', 'Negada'],
      ['prompt', 'Não perguntada'],
    ] as const)('reads %s as %s', async (state, text) => {
      mockPermission(state)
      renderWithPreferences(<PrivacyScreen />)
      expect(await screen.findByText(text)).toBeInTheDocument()
    })

    it('reads Não perguntada when the browser cannot tell', () => {
      mockPermission(undefined)
      renderWithPreferences(<PrivacyScreen />)
      expect(screen.getByText('Não perguntada')).toBeInTheDocument()
    })
  })

  it('Voltar returns to the previous screen', async () => {
    window.history.pushState(null, '', '#/perfil')
    window.history.pushState(null, '', '#/privacidade')
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => undefined)
    renderWithPreferences(<PrivacyScreen />)
    await userEvent.click(screen.getByRole('button', { name: 'Voltar' }))
    expect(back).toHaveBeenCalledTimes(1)
  })
})

describe('PrivacyScreen Voltar', () => {
  it('Voltar goes to Início when there is no previous screen', async () => {
    vi.spyOn(window.history, 'length', 'get').mockReturnValue(1)
    renderWithPreferences(<PrivacyScreen />)
    await userEvent.click(screen.getByRole('button', { name: 'Voltar' }))
    expect(window.location.hash).toBe('#/inicio')
  })
})
