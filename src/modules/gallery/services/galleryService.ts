import type { GalleryItem } from '../../../shared/lib/api-types'

type GalleryResponse = {
  items: GalleryItem[]
}

export async function fetchGallery(): Promise<GalleryItem[]> {
  const response = await fetch('/api/gallery')

  if (!response.ok) {
    throw new Error(`Failed to load gallery: ${response.statusText}`)
  }

  const payload = (await response.json()) as GalleryResponse
  return payload.items ?? []
}
