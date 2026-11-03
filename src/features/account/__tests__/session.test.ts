import { beforeEach, describe, expect, it } from 'vitest'
import { getSession, isValidEmail, nameFromEmail, SESSION_KEY, signIn, signOut } from '../session'

beforeEach(() => {
  window.localStorage.clear()
  signOut()
})

describe('isValidEmail', () => {
  it.each(['maria@exemplo.com', ' joao.silva@mail.com.br ', 'ana+turismo@x.io'])(
    'accepts %j',
    (v) => {
      expect(isValidEmail(v)).toBe(true)
    },
  )

  it.each(['', 'maria', 'maria@', '@exemplo.com', 'maria@exemplo', '123@exemplo.com', 'a b@x.com'])(
    'rejects %j',
    (v) => {
      expect(isValidEmail(v)).toBe(false)
    },
  )
})

describe('nameFromEmail', () => {
  it.each([
    ['maria@exemplo.com', 'Maria'],
    ['JOAO.silva@mail.com', 'Joao'],
    ['ana_2024@x.io', 'Ana'],
    ['zé.santos@x.io', 'Zé'],
  ])('turns %j into %j', (email, name) => {
    expect(nameFromEmail(email)).toBe(name)
  })
})

describe('session', () => {
  it('starts signed out', () => {
    expect(getSession()).toBeNull()
  })

  it('keeps only the first name on the device', () => {
    signIn('Maria')
    expect(getSession()).toEqual({ name: 'Maria' })
    expect(JSON.parse(window.localStorage.getItem(SESSION_KEY) ?? '{}')).toEqual({ name: 'Maria' })
  })

  it('signs out and forgets the name', () => {
    signIn('Maria')
    signOut()
    expect(getSession()).toBeNull()
    expect(window.localStorage.getItem(SESSION_KEY)).toBeNull()
  })

  it.each(['{not json', '[]', '{"name":""}', '{"name":5}', 'null'])(
    'treats a damaged store %j as signed out',
    (raw) => {
      window.localStorage.setItem(SESSION_KEY, raw)
      expect(getSession()).toBeNull()
    },
  )
})
