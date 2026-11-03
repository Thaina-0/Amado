import type { Coordinates } from './places'

// invariant: the position is handed back as a value and never stored, logged or sent anywhere
export function getPosition(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    const geolocation = navigator.geolocation
    if (!geolocation) {
      reject(new Error('Geolocation is not available'))
      return
    }
    geolocation.getCurrentPosition(
      (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
      (failure) => reject(new Error(failure.message)),
      { maximumAge: 0, timeout: 10_000 },
    )
  })
}
