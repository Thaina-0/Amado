import type { Coordinates } from './places'

const DECIMALS = 6

// why: a plain maps link opens in any app and needs nothing from Amado, so there is no server and no stored point
export function positionLink({ lat, lng }: Coordinates): string {
  return `https://www.google.com/maps?q=${lat.toFixed(DECIMALS)},${lng.toFixed(DECIMALS)}`
}

export function shareMessage(intro: string, position: Coordinates): string {
  return `${intro} ${positionLink(position)}`
}
