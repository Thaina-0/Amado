import { vi, type Mock } from 'vitest'

export const USER = { lat: -14.7889, lng: -39.0463 }

const METERS_PER_DEGREE = 111_194.93

export function metersNorth(from: { lat: number; lng: number }, meters: number) {
  return { lat: from.lat + meters / METERS_PER_DEGREE, lng: from.lng }
}

type SuccessFn = (position: { coords: { latitude: number; longitude: number } }) => void
type ErrorFn = (error: { code: number; message: string }) => void

type CurrentPositionArgs = [SuccessFn, ErrorFn, PositionOptions?]

export interface GeolocationMock {
  getCurrentPosition: Mock<(...args: CurrentPositionArgs) => void>
  watchPosition: Mock
  resolve(position?: { lat: number; lng: number }): void
  deny(): void
  timeout(): void
  unavailable(): void
}

export function mockGeolocation(): GeolocationMock {
  let success: SuccessFn | undefined
  let failure: ErrorFn | undefined
  const getCurrentPosition = vi.fn((...args: CurrentPositionArgs) => {
    success = args[0]
    failure = args[1]
  })
  const watchPosition = vi.fn()
  Object.defineProperty(navigator, 'geolocation', {
    value: { getCurrentPosition, watchPosition },
    configurable: true,
  })
  return {
    getCurrentPosition,
    watchPosition,
    resolve(position = USER) {
      success?.({ coords: { latitude: position.lat, longitude: position.lng } })
    },
    deny() {
      failure?.({ code: 1, message: 'denied' })
    },
    timeout() {
      failure?.({ code: 3, message: 'timeout' })
    },
    unavailable() {
      failure?.({ code: 2, message: 'unavailable' })
    },
  }
}

export function setOnline(online: boolean) {
  Object.defineProperty(navigator, 'onLine', { value: online, configurable: true })
}
