import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { I18nProvider } from '../../../i18n/I18nProvider'
import { mockGeolocation } from '../../../test-utils/geolocation'
import { ShareLocation } from '../ShareLocation'

const LINK = 'https://www.google.com/maps?q=-14.788900,-39.046300'
let geo: ReturnType<typeof mockGeolocation>

beforeEach(() => {
  geo = mockGeolocation()
  window.localStorage.clear()
  window.sessionStorage.clear()
})

afterEach(() => {
  Reflect.deleteProperty(navigator, 'geolocation')
  Reflect.deleteProperty(navigator, 'share')
  Reflect.deleteProperty(navigator, 'clipboard')
  vi.restoreAllMocks()
})

const start = () => userEvent.click(screen.getByRole('button', { name: 'Enviar minha posição' }))

describe('ShareLocation', () => {
  it('asks for nothing until the button is tapped, and says Amado keeps nothing', () => {
    render(<ShareLocation />)
    expect(geo.getCurrentPosition).not.toHaveBeenCalled()
    expect(screen.getByText(/O Amado não guarda a sua posição/)).toBeInTheDocument()
  })

  it('finds the position on tap and shows the ready message before anything leaves', async () => {
    render(<ShareLocation />)
    await start()
    expect(screen.getByRole('status')).toHaveTextContent('Procurando a sua posição')
    expect(screen.getByRole('button', { name: 'Enviar minha posição' })).toBeDisabled()
    act(() => geo.resolve())
    expect(
      await screen.findByRole('heading', { name: 'Mensagem pronta para enviar' }),
    ).toBeInTheDocument()
    expect(screen.getByText(`Preciso de ajuda. Estou aqui: ${LINK}`)).toBeInTheDocument()
  })

  it('writes the message in the language of the screen', async () => {
    render(
      <I18nProvider language="en">
        <ShareLocation />
      </I18nProvider>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Send my position' }))
    act(() => geo.resolve())
    expect(await screen.findByText(`I need help. I am here: ${LINK}`)).toBeInTheDocument()
  })

  it('says it could not get the position, without blocking anything, and lets the person retry', async () => {
    render(<ShareLocation />)
    await start()
    act(() => geo.deny())
    expect(await screen.findByRole('alert')).toHaveTextContent('Não deu para pegar a sua posição')
    expect(screen.getByRole('button', { name: 'Enviar minha posição' })).toBeEnabled()
  })

  it('hands the message to the share sheet when the device has one', async () => {
    const share = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'share', { value: share, configurable: true })
    render(<ShareLocation />)
    await start()
    act(() => geo.resolve())
    await userEvent.click(await screen.findByRole('button', { name: 'Compartilhar' }))
    expect(share).toHaveBeenCalledWith({ text: `Preciso de ajuda. Estou aqui: ${LINK}` })
  })

  it('offers only Copiar when the device cannot share', async () => {
    render(<ShareLocation />)
    await start()
    act(() => geo.resolve())
    await screen.findByRole('button', { name: 'Copiar' })
    expect(screen.queryByRole('button', { name: 'Compartilhar' })).toBeNull()
  })

  it('copies the message and confirms it', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    render(<ShareLocation />)
    await start()
    act(() => geo.resolve())
    await userEvent.click(await screen.findByRole('button', { name: 'Copiar' }))
    expect(writeText).toHaveBeenCalledWith(`Preciso de ajuda. Estou aqui: ${LINK}`)
    expect(await screen.findByText('Copiado.')).toBeInTheDocument()
  })

  it('keeps the message on screen when the clipboard is refused', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockRejectedValue(new Error('refused')) },
      configurable: true,
    })
    render(<ShareLocation />)
    await start()
    act(() => geo.resolve())
    await userEvent.click(await screen.findByRole('button', { name: 'Copiar' }))
    expect(screen.queryByText('Copiado.')).toBeNull()
    expect(screen.getByText(`Preciso de ajuda. Estou aqui: ${LINK}`)).toBeInTheDocument()
  })

  it('drops the position when the panel is closed', async () => {
    render(<ShareLocation />)
    await start()
    act(() => geo.resolve())
    await userEvent.click(await screen.findByRole('button', { name: 'Fechar' }))
    expect(screen.queryByText(/google\.com\/maps/)).toBeNull()
    expect(screen.getByRole('button', { name: 'Enviar minha posição' })).toBeEnabled()
  })

  it('stores the position nowhere and logs nothing', async () => {
    const log = vi.spyOn(console, 'log')
    const error = vi.spyOn(console, 'error')
    render(<ShareLocation />)
    await start()
    act(() => geo.resolve())
    await screen.findByText(/google\.com\/maps/)
    expect(window.localStorage).toHaveLength(0)
    expect(window.sessionStorage).toHaveLength(0)
    expect(log).not.toHaveBeenCalled()
    expect(error).not.toHaveBeenCalled()
  })

  it('does not update a screen the person already left', async () => {
    const error = vi.spyOn(console, 'error')
    const view = render(<ShareLocation />)
    await start()
    view.unmount()
    act(() => geo.resolve())
    expect(error).not.toHaveBeenCalled()
  })
})
