import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { I18nProvider } from '../../../i18n/I18nProvider'
import { PreferencesProvider } from '../../../preferences/PreferencesProvider'
import { resetBrowser, seedPreferences } from '../../../test-utils/app'
import { ReviewForm } from '../ReviewForm'
import { MAX_COMMENT, parseReviews, REVIEWS_KEY } from '../reviews'

function renderForm(placeId = 'bar-vesuvio') {
  return render(
    <PreferencesProvider>
      <ReviewForm placeId={placeId} />
    </PreferencesProvider>,
  )
}

const stored = () => parseReviews(window.localStorage.getItem(REVIEWS_KEY))
const star = (n: number) => screen.getByRole('radio', { name: `${n} de 5 estrelas` })

beforeEach(() => {
  resetBrowser()
  seedPreferences()
})

describe('ReviewForm', () => {
  it('asks for a rating first, and Salvar waits for it', async () => {
    renderForm()
    expect(screen.getByRole('heading', { name: 'Avalie este lugar' })).toBeInTheDocument()
    expect(screen.getByText('Toque numa estrela para dar a sua nota.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Salvar avaliação' })).toBeDisabled()
    await userEvent.click(star(4))
    expect(screen.getByText('Nota: 4 de 5')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Salvar avaliação' })).toBeEnabled()
  })

  it('shows the rating as stars that are checked and as text', async () => {
    renderForm()
    await userEvent.click(star(3))
    expect(star(3)).toHaveAttribute('aria-checked', 'true')
    expect(star(2)).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByRole('radiogroup', { name: 'Sua nota' })).toBeInTheDocument()
  })

  it('moves the rating with the arrow keys', async () => {
    renderForm()
    star(1).focus()
    await userEvent.keyboard('{ArrowRight}{ArrowRight}')
    expect(star(3)).toHaveAttribute('aria-checked', 'true')
    expect(star(3)).toHaveFocus()
    await userEvent.keyboard('{ArrowLeft}')
    expect(star(2)).toHaveAttribute('aria-checked', 'true')
  })

  it('saves the rating and the comment for that place only, on this device', async () => {
    renderForm()
    await userEvent.click(star(5))
    await userEvent.type(screen.getByLabelText('Comentário (opcional)'), '  Quibe ótimo  ')
    await userEvent.click(screen.getByRole('button', { name: 'Salvar avaliação' }))
    expect(stored()).toEqual({
      'bar-vesuvio': { rating: 5, comment: 'Quibe ótimo', counted: false },
    })
    expect(screen.getByText('Avaliação salva')).toBeInTheDocument()
    expect(screen.getByText('Sua avaliação: Nota: 5 de 5')).toBeInTheDocument()
    expect(screen.getByText('Quibe ótimo')).toBeInTheDocument()
  })

  it('stores no name, id, place or time of the person', async () => {
    renderForm()
    await userEvent.click(star(2))
    await userEvent.click(screen.getByRole('button', { name: 'Salvar avaliação' }))
    const raw = JSON.parse(window.localStorage.getItem(REVIEWS_KEY) ?? '{}') as Record<
      string,
      Record<string, unknown>
    >
    expect(Object.keys(raw['bar-vesuvio'] ?? {}).sort()).toEqual(['comment', 'counted', 'rating'])
  })

  it('counts in the group only when the person accepted the data', async () => {
    seedPreferences({ countVisit: true })
    renderForm()
    await userEvent.click(star(4))
    await userEvent.click(screen.getByRole('button', { name: 'Salvar avaliação' }))
    expect(stored()['bar-vesuvio']?.counted).toBe(true)
  })

  it('works when the person refused the data', async () => {
    seedPreferences({ countVisit: false })
    renderForm()
    await userEvent.click(star(1))
    await userEvent.click(screen.getByRole('button', { name: 'Salvar avaliação' }))
    expect(stored()['bar-vesuvio']).toMatchObject({ rating: 1, counted: false })
  })

  it('says the review is anonymous and stays on the device', () => {
    renderForm()
    expect(
      screen.getByText(
        'Anônima. Fica neste aparelho e só entra na contagem de grupos se você aceitou os dados.',
      ),
    ).toBeInTheDocument()
  })

  it('stops the comment at 280 characters and counts them', async () => {
    renderForm()
    const field = screen.getByLabelText('Comentário (opcional)')
    await userEvent.click(field)
    await userEvent.paste('a'.repeat(MAX_COMMENT + 40))
    expect(field).toHaveValue('a'.repeat(MAX_COMMENT))
    expect(screen.getByText('280 de 280')).toBeInTheDocument()
  })

  it('opens again with the saved review, lets the person change it and keeps one per place', async () => {
    renderForm()
    await userEvent.click(star(2))
    await userEvent.click(screen.getByRole('button', { name: 'Salvar avaliação' }))
    await userEvent.click(screen.getByRole('button', { name: 'Mudar avaliação' }))
    expect(star(2)).toHaveAttribute('aria-checked', 'true')
    await userEvent.click(star(5))
    await userEvent.click(screen.getByRole('button', { name: 'Salvar avaliação' }))
    expect(Object.keys(stored())).toEqual(['bar-vesuvio'])
    expect(stored()['bar-vesuvio']?.rating).toBe(5)
  })

  it('remembers the review after the screen is closed and opened again', async () => {
    const first = renderForm()
    await userEvent.click(star(3))
    await userEvent.click(screen.getByRole('button', { name: 'Salvar avaliação' }))
    first.unmount()
    renderForm()
    expect(screen.getByText('Sua avaliação: Nota: 3 de 5')).toBeInTheDocument()
  })

  it('keeps places apart', async () => {
    const first = renderForm('bar-vesuvio')
    await userEvent.click(star(3))
    await userEvent.click(screen.getByRole('button', { name: 'Salvar avaliação' }))
    first.unmount()
    renderForm('bataclan')
    expect(screen.getByText('Toque numa estrela para dar a sua nota.')).toBeInTheDocument()
  })

  it('ignores a damaged store instead of breaking the page', () => {
    window.localStorage.setItem(REVIEWS_KEY, '{not json')
    renderForm()
    expect(screen.getByText('Toque numa estrela para dar a sua nota.')).toBeInTheDocument()
  })

  it('reads in English', async () => {
    render(
      <PreferencesProvider>
        <I18nProvider language="en">
          <ReviewForm placeId="bar-vesuvio" />
        </I18nProvider>
      </PreferencesProvider>,
    )
    expect(screen.getByRole('heading', { name: 'Rate this place' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: '4 of 5 stars' })).toBeInTheDocument()
  })
})

describe('parseReviews', () => {
  it('drops entries that are not a rating from 1 to 5', () => {
    expect(
      parseReviews(
        JSON.stringify({
          ok: { rating: 4, comment: 'x', counted: true },
          zero: { rating: 0 },
          six: { rating: 6 },
          text: { rating: '5' },
          nothing: null,
        }),
      ),
    ).toEqual({ ok: { rating: 4, comment: 'x', counted: true } })
  })

  it('returns an empty book for anything that is not an object', () => {
    expect(parseReviews(null)).toEqual({})
    expect(parseReviews('[1]')).toEqual({})
    expect(parseReviews('"x"')).toEqual({})
  })
})
