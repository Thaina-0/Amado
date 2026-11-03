import { useCallback, useEffect, useState } from 'react'
import type { Place } from './places'

export type PlacesState =
  { status: 'loading' } | { status: 'ready'; places: readonly Place[] } | { status: 'error' }

export function usePlaces(load: () => Promise<readonly Place[]>): [PlacesState, () => void] {
  const [state, setState] = useState<PlacesState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    load().then(
      (places) => {
        if (active) setState({ status: 'ready', places })
      },
      () => {
        if (active) setState({ status: 'error' })
      },
    )
    return () => {
      active = false
    }
  }, [load, attempt])

  const retry = useCallback(() => {
    setState({ status: 'loading' })
    setAttempt((count) => count + 1)
  }, [])

  return [state, retry]
}
