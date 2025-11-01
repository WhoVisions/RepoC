import type { Handler } from '@netlify/functions'
import type { GalleryItem } from '../src/shared/lib/api-types'

const galleryItems: GalleryItem[] = [
  {
    id: 'art-001',
    title: 'Sunset Vista',
    category: 'landscape',
    imageUrl: '/images/gallery/sunset-vista.jpg',
    description: 'Golden-hour view over coastal cliffs.'
  },
  {
    id: 'art-002',
    title: 'City Reflections',
    category: 'urban',
    imageUrl: '/images/gallery/city-reflections.jpg',
    description: 'Night skyline reflecting over the river.'
  }
]

export const handler: Handler = async () => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=60, s-maxage=600'
    },
    body: JSON.stringify({ items: galleryItems })
  }
}
