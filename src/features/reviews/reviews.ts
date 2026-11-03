import type { KeyValueStorage } from '../../preferences/preferences'

export const REVIEWS_KEY = 'amado.reviews.v1'
export const MAX_COMMENT = 280
export const STARS = [1, 2, 3, 4, 5] as const

export type Rating = (typeof STARS)[number]

// invariant: a review has no name, id, coordinate or time; the only key is the place, and it never leaves the device
export interface Review {
  rating: Rating
  comment: string
  counted: boolean
}

export type ReviewBook = Record<string, Review>

const isRating = (value: unknown): value is Rating => STARS.some((star) => star === value)

function parseReview(value: unknown): Review | null {
  if (typeof value !== 'object' || value === null) return null
  const { rating, comment, counted } = value as Record<string, unknown>
  if (!isRating(rating)) return null
  return {
    rating,
    comment: typeof comment === 'string' ? comment.slice(0, MAX_COMMENT) : '',
    counted: counted === true,
  }
}

export function parseReviews(raw: string | null): ReviewBook {
  if (raw === null) return {}
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return {}
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {}
  const book: ReviewBook = {}
  for (const [placeId, value] of Object.entries(parsed)) {
    const review = parseReview(value)
    if (review) book[placeId] = review
  }
  return book
}

export function browserStorage(): KeyValueStorage | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function loadReview(storage: KeyValueStorage | null, placeId: string): Review | null {
  if (!storage) return null
  try {
    return parseReviews(storage.getItem(REVIEWS_KEY))[placeId] ?? null
  } catch {
    return null
  }
}

export function saveReview(
  storage: KeyValueStorage | null,
  placeId: string,
  review: Review,
): boolean {
  if (!storage) return false
  try {
    const book = parseReviews(storage.getItem(REVIEWS_KEY))
    book[placeId] = { ...review, comment: review.comment.trim().slice(0, MAX_COMMENT) }
    storage.setItem(REVIEWS_KEY, JSON.stringify(book))
    return true
  } catch {
    return false
  }
}

export function loadReviewBook(storage: KeyValueStorage | null): ReviewBook {
  if (!storage) return {}
  try {
    return parseReviews(storage.getItem(REVIEWS_KEY))
  } catch {
    return {}
  }
}
