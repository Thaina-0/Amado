import type { Localized } from '../../i18n/i18n'
import { CIRCUITS } from './data'

// invariant: a circuit points at places by id and holds no place data, duration, author, coordinate or hours (door 2, AD-008)
export interface Circuit {
  id: string
  title: Localized
  summary: Localized
  stops: readonly string[]
  example: true
}

export { CIRCUITS }

export function findCircuit(id: string): Circuit | undefined {
  return CIRCUITS.find((circuit) => circuit.id === id)
}
