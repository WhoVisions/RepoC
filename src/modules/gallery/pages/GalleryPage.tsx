import { useQuery } from '@tanstack/react-query'
import { fetchGallery } from '../services/galleryService'
import { GalleryGrid } from '../components/GalleryGrid'

export function GalleryPage() {
  const {
    data: items = [],
    isLoading,
    isError,
    error
  } = useQuery({ queryKey: ['gallery'], queryFn: fetchGallery })

  if (isLoading) {
    return <p role="status">Loading gallery...</p>
  }

  if (isError) {
    return (
      <p role="alert">{error instanceof Error ? error.message : 'Failed to load gallery'}</p>
    )
  }

  return (
    <section aria-labelledby="gallery-title">
      <header>
        <h2 id="gallery-title">Featured gallery</h2>
        <p>Browse recent projects curated by the RepoC Studio team.</p>
      </header>
      <GalleryGrid items={items} />
    </section>
  )
}
