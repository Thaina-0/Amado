import { describe, expect, it } from 'vitest'
import { USER } from '../../../test-utils/geolocation'
import { positionLink, shareMessage } from '../share'

describe('positionLink', () => {
  it('builds a plain maps link with six decimals and no other data', () => {
    expect(positionLink(USER)).toBe('https://www.google.com/maps?q=-14.788900,-39.046300')
  })

  it('keeps the sign of the coordinates and pads short ones', () => {
    expect(positionLink({ lat: -1.5, lng: 2 })).toBe(
      'https://www.google.com/maps?q=-1.500000,2.000000',
    )
  })
})

describe('shareMessage', () => {
  it('puts the intro first and the link last, in one line', () => {
    const message = shareMessage('Preciso de ajuda. Estou aqui:', USER)
    expect(message).toBe(
      'Preciso de ajuda. Estou aqui: https://www.google.com/maps?q=-14.788900,-39.046300',
    )
    expect(message).not.toContain('\n')
  })
})
