// invariant: scripts/optimize-images.sh writes `<name>.webp` (960w) and `<name>-480.webp` next to every `<name>.jpg` listed in the data
export const PHOTO_SIZES = '(min-width: 480px) 440px, calc(100vw - 2.5rem)'

export function photoImage(src: string): { src: string; srcSet: string } {
  const base = src.replace(/\.jpg$/, '')
  return { src: `${base}.webp`, srcSet: `${base}-480.webp 480w, ${base}.webp 960w` }
}
