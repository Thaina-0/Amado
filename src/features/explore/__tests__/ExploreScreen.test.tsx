import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { resetBrowser } from '../../../test-utils/app'
import { ExploreScreen } from '../ExploreScreen'

beforeEach(() => resetBrowser())

describe('ExploreScreen', () => {
  it('lists the six categories as links', () => {
    render(<ExploreScreen />)
    expect(screen.getByRole('heading', { level: 1, name: 'Explorar' })).toBeInTheDocument()
    expect(screen.getByText('Descubra Ilhéus por categoria')).toBeInTheDocument()
    const rows = within(
      screen.getByRole('list', { name: 'Categorias para explorar' }),
    ).getAllByRole('link')
    expect(rows.map((row) => [row.textContent, row.getAttribute('href')])).toEqual([
      ['GastronomiaBares, restaurantes e sabores do cacau', '#/explorar/gastronomia'],
      ['CulturaCasas, igrejas e teatros da Ilhéus de Jorge Amado', '#/explorar/cultura'],
      ['PraiasPraias para descansar e curtir o mar', '#/explorar/praias'],
      ['NaturezaLagoas, rios e cachoeiras para um dia ao ar livre', '#/explorar/natureza'],
      [
        'EsportesSurf, beach tennis, stand up paddle e mais, com onde praticar',
        '#/explorar/esportes',
      ],
      ['CircuitosRoteiros prontos, com os lugares na ordem do passeio', '#/explorar/circuitos'],
    ])
    expect(screen.getByRole('link', { name: 'Abrir perfil' })).toHaveAttribute('href', '#/perfil')
  })
})
