import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { I18nProvider } from '../../../i18n/I18nProvider'
import { resetBrowser } from '../../../test-utils/app'
import { EXAMPLE_PLACES } from '../places'
import { PlaceScreen } from '../PlaceScreen'

const CASA = EXAMPLE_PLACES.find((place) => place.id === 'casa-de-jorge-amado')!

beforeEach(() => resetBrowser())

describe('PlaceScreen', () => {
  it('shows the place page with Voltar, the photo area, the tag, the name and the summary', () => {
    render(<PlaceScreen place={CASA} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Lugar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Voltar' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Fotos de Casa de Jorge Amado' })).toBeInTheDocument()
    expect(screen.getByText('Exemplo')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Casa de Jorge Amado' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Museu no Centro histórico')).toBeInTheDocument()
  })

  it('shows the summary in the chosen language', () => {
    render(
      <I18nProvider language="en">
        <PlaceScreen place={CASA} />
      </I18nProvider>,
    )
    expect(screen.getByText('Museum in the historic centre')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument()
  })

  it('shows the place page and Voltar returns to the previous screen', async () => {
    window.history.pushState(null, '', '#/perto-de-mim')
    window.history.pushState(null, '', '#/lugar/casa-de-jorge-amado')
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => undefined)
    render(<PlaceScreen place={CASA} />)
    await userEvent.click(screen.getByRole('button', { name: 'Voltar' }))
    expect(back).toHaveBeenCalledTimes(1)
    back.mockRestore()
  })

  describe('no distance and no route', () => {
    it.each(EXAMPLE_PLACES.map((place) => [place.name, place] as const))(
      'for %s',
      (_name, place) => {
        render(<PlaceScreen place={place} />)
        expect(screen.queryByText(/\d+(,\d)?\s?(m|km)\b/)).toBeNull()
        expect(screen.queryByRole('link', { name: /rota|route|ruta/i })).toBeNull()
        expect(screen.queryByText(/sem distância/i)).toBeNull()
      },
    )
  })
})

describe('PlaceScreen, about and sources', () => {
  it('shows the details, the unconfirmed notice and a link to each public source', () => {
    render(<PlaceScreen place={CASA} />)
    expect(screen.getByRole('heading', { level: 3, name: 'Sobre' })).toBeInTheDocument()
    expect(
      screen.getByText(/Nesta casa o menino Jorge Amado viveu parte da infância/),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Informação de fonte pública, ainda a confirmar pelo time.'),
    ).toBeInTheDocument()
    const link = screen.getByRole('link', { name: /Fonte: seguroviagem.srv.br/ })
    expect(link).toHaveAttribute(
      'href',
      'https://www.seguroviagem.srv.br/blog/o-que-fazer-em-ilheus/',
    )
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('tells what the news say about the CTM10 for Futevôlei and links each source', () => {
    render(<PlaceScreen place={EXAMPLE_PLACES.find((place) => place.id === 'futevolei')!} />)
    expect(screen.getByText(/O CTM10, Centro de Treinamento Esportivo e Funcional/)).toBeVisible()
    expect(screen.getByText(/não dizem o endereço/)).toBeVisible()
    expect(screen.getAllByRole('link', { name: /Fonte:/ })).toHaveLength(2)
    expect(screen.getByText(/ainda a confirmar pelo time/)).toBeVisible()
  })

  it('offers Onde praticar on sports and Como chegar on the other places, never both', () => {
    const { unmount } = render(<PlaceScreen place={EXAMPLE_PLACES.find((p) => p.id === 'surf')!} />)
    expect(screen.getByRole('link', { name: 'Onde praticar' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Como chegar' })).toBeNull()
    unmount()
    render(<PlaceScreen place={CASA} />)
    expect(screen.getByRole('link', { name: 'Como chegar' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Onde praticar' })).toBeNull()
  })

  it('offers the review form on every place', () => {
    render(<PlaceScreen place={CASA} />)
    expect(screen.getByRole('heading', { name: 'Avalie este lugar' })).toBeInTheDocument()
  })
})
