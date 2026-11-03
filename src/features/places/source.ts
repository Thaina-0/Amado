import { EXAMPLE_PLACES, type Place } from './places'

// invariant: the real source will be asynchronous, so the screens only ever see this contract (door 4)
export function loadPlaces(): Promise<readonly Place[]> {
  if (import.meta.env.DEV) {
    // why: design review needs to see the loading and error states, which example data never produces
    const mode = new URLSearchParams(window.location.search).get('simular')
    if (mode === 'carregando') return new Promise(() => undefined)
    if (mode === 'erro') return Promise.reject(new Error('simulated failure'))
  }
  return Promise.resolve(EXAMPLE_PLACES)
}
