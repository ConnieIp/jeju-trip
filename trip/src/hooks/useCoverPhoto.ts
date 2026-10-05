import { useEffect, useState } from 'react'

export function useCoverPhoto(
  photos: string[] | undefined,
  fallback: string = 'placeholder.jpg'
): { src: string; ready: boolean } {
  const firstPhoto = photos?.[0] || fallback
  const key = photos?.join(',') ?? ''

  const [src, setSrc] = useState(firstPhoto)
  const [ready, setReady] = useState(photos == null || photos.length <= 1)

  useEffect(() => {
    const candidates = photos?.slice(0, 4) ?? []

    if (candidates.length <= 1) {
      setSrc(firstPhoto)
      setReady(true)
      return
    }

    setReady(false)

    const dims: Record<string, number> = {}
    let done = 0

    const finish = () => {
      const best = Object.entries(dims).sort(([, a], [, b]) => b - a)[0]
      setSrc(best ? best[0] : firstPhoto)
      setReady(true)
    }

    candidates.forEach((photo) => {
      const img = new Image()
      img.onload = () => {
        dims[photo] = img.naturalWidth
        if (++done === candidates.length) finish()
      }
      img.onerror = () => {
        if (++done === candidates.length) finish()
      }
      img.src = photo
    })
  }, [key])

  return { src, ready }
}
