import { describe, expect, it } from 'vitest'
import { PHOTOS } from '../data'
import { photoImage } from '../photoImage'

const WEBP_FILES = new Set(Object.keys(import.meta.glob('/public/places/*/*.webp')))

describe('photoImage', () => {
  it('points to the 960w WebP and offers the 480w one as a smaller candidate', () => {
    expect(photoImage('/places/bataclan/1.jpg')).toEqual({
      src: '/places/bataclan/1.webp',
      srcSet: '/places/bataclan/1-480.webp 480w, /places/bataclan/1.webp 960w',
    })
  })

  it('has both WebP files on disk for every photo of every place', () => {
    const files = Object.values(PHOTOS)
      .flat()
      .flatMap((photo) => {
        const { src, srcSet } = photoImage(photo.src)
        return [src, ...srcSet.split(', ').map((candidate) => candidate.split(' ')[0]!)]
      })
    const missing = files.filter((file) => !WEBP_FILES.has(`/public${file}`))
    expect(missing).toEqual([])
  })
})
