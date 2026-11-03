import { describe, expect, it } from 'vitest'
import { CONTENT_LANGUAGES } from '../../../i18n/i18n'
import { EXAMPLE_PLACES } from '../../places/places'
import { CIRCUITS, findCircuit } from '../circuits'

describe('circuits', () => {
  it('every stop is an example place', () => {
    expect(CIRCUITS.length).toBeGreaterThan(0)
    const known = new Set(EXAMPLE_PLACES.map((place) => place.id))
    for (const circuit of CIRCUITS) {
      expect(circuit.stops.length, circuit.id).toBeGreaterThanOrEqual(2)
      for (const stop of circuit.stops) expect(known.has(stop), `${circuit.id}: ${stop}`).toBe(true)
    }
  })

  it('holds ids and no place data', () => {
    for (const circuit of CIRCUITS) {
      expect(Object.keys(circuit).sort()).toEqual(['example', 'id', 'stops', 'summary', 'title'])
      expect(circuit.stops.every((stop) => typeof stop === 'string')).toBe(true)
      expect(circuit.example).toBe(true)
    }
  })

  it('offers the eight themed circuits, each with its own stops and no repeated stop', () => {
    const themed = CIRCUITS.filter((circuit) => circuit.id !== 'circuito-cultural-do-centro')
    expect(themed.map((circuit) => circuit.title.pt)).toEqual([
      'Circuito Histórico',
      'Circuito Religioso',
      'Circuito Gastronômico',
      'Circuito Jorge Amado',
      'Circuito Água Doce',
      'Circuito Água Salgada',
      'Circuito Cacau e Chocolate',
      'Circuito Fazenda de Cacau',
    ])
    expect(new Set(CIRCUITS.map((circuit) => circuit.id)).size).toBe(CIRCUITS.length)
    for (const circuit of CIRCUITS) {
      expect(new Set(circuit.stops).size, circuit.id).toBe(circuit.stops.length)
    }
  })

  it('writes every title and summary in the three languages', () => {
    for (const circuit of CIRCUITS) {
      for (const language of CONTENT_LANGUAGES) {
        expect(circuit.title[language].length, `${circuit.id} title ${language}`).toBeGreaterThan(5)
        expect(
          circuit.summary[language].length,
          `${circuit.id} summary ${language}`,
        ).toBeGreaterThan(10)
      }
    }
  })

  it('finds a circuit by id and nothing for an unknown id', () => {
    expect(findCircuit('circuito-cultural-do-centro')?.stops).toEqual([
      'casa-de-jorge-amado',
      'catedral-de-sao-sebastiao',
      'bar-vesuvio',
    ])
    expect(findCircuit('unknown')).toBeUndefined()
  })
})
