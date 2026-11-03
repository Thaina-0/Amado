import { useEffect, useState } from 'react'

export type LocationPermission = 'granted' | 'denied' | 'prompt' | 'unknown'

export function useLocationPermission(): LocationPermission {
  const [state, setState] = useState<LocationPermission>('unknown')

  useEffect(() => {
    let status: PermissionStatus | undefined
    let active = true
    const sync = () => {
      if (active && status) setState(status.state)
    }
    navigator.permissions
      ?.query({ name: 'geolocation' })
      .then((result) => {
        status = result
        sync()
        result.addEventListener('change', sync)
      })
      .catch(() => undefined)
    return () => {
      active = false
      status?.removeEventListener('change', sync)
    }
  }, [])

  return state
}

// invariant: the answer is a yes or no; the position itself is never read or kept here
export function askLocationPermission(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      () => resolve(true),
      () => resolve(false),
      { maximumAge: 0, timeout: 10_000 },
    )
  })
}
