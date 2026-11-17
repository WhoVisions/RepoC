import type { GalleryItem } from '../../../shared/lib/api-types'
import './GalleryGrid.css'

type GalleryGridProps = {
  items: GalleryItem[]
}

export function GalleryGrid({ items }: GalleryGridProps) {
  if (items.length === 0) {
    return <p role="status">No gallery items yet. Check back soon.</p>
  }

  return (
    <ul className="gallery-grid">
      {items.map((item) => (
        <li key={item.id} className="gallery-grid__item">
          <figure>
            <div className="gallery-grid__image" aria-hidden="true" />
            <figcaption>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="gallery-grid__badge">{item.category}</span>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}
