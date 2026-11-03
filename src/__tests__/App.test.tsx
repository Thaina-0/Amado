import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mockGeolocation } from '../test-utils/geolocation'
import { App } from '../App'

beforeEach(() => {
  Object.defineProperty(navigator, 'language', { value: 'pt-BR', configurable: true })
  window.localStorage.clear()
  window.location.hash = ''
  mockGeolocation()
})

afterEach(() => {
  Reflect.deleteProperty(navigator, 'geolocation')
})

describe('App', () => {
  it('opens on the first screen, the welcome with login and signup, on the first visit', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Bem-vindo ao Amado' }),
    ).toBeInTheDocument()
  })
})
