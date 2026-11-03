import { afterEach, describe, expect, it } from 'vitest'
import { mockGeolocation, USER } from '../../../test-utils/geolocation'
import { getPosition } from '../location'

afterEach(() => {
  Reflect.deleteProperty(navigator, 'geolocation')
})

describe('getPosition', () => {
  it('asks the position once with maximumAge 0 and timeout 10000, and never watches', () => {
    const geo = mockGeolocation()
    void getPosition().catch(() => undefined)
    expect(geo.getCurrentPosition).toHaveBeenCalledTimes(1)
    expect(geo.getCurrentPosition.mock.calls[0]?.[2]).toEqual({ maximumAge: 0, timeout: 10000 })
    expect(geo.watchPosition).not.toHaveBeenCalled()
  })

  it('resolves with the latitude and longitude only', async () => {
    const geo = mockGeolocation()
    const pending = getPosition()
    geo.resolve(USER)
    await expect(pending).resolves.toEqual(USER)
  })

  it.each(['deny', 'timeout', 'unavailable'] as const)(
    'rejects when the browser reports %s',
    async (kind) => {
      const geo = mockGeolocation()
      const pending = getPosition()
      geo[kind]()
      await expect(pending).rejects.toBeDefined()
    },
  )

  it('rejects when the browser has no geolocation', async () => {
    Object.defineProperty(navigator, 'geolocation', { value: undefined, configurable: true })
    await expect(getPosition()).rejects.toBeDefined()
  })
})
