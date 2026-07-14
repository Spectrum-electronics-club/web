import { useEffect, useState } from 'react'
import { IoClose, IoChevronBack, IoChevronForward } from 'react-icons/io5'
import PageTransition from '@/components/molecules/PageTransition'
import Section from '@/components/molecules/Section'
import Container from '@/components/molecules/Container'
import SectionHeader from '@/components/molecules/SectionHeader'
import { SkeletonCard } from '@/components/atoms/Skeleton'
import api from '@/utils/axiosInstance'

export default function Gallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lightbox, setLightbox] = useState(null) // index
  const [albumFilter, setAlbumFilter] = useState('all')

  useEffect(() => {
    api.get('/gallery')
      .then((r) => setImages(r.data.data || r.data))
      .catch(() => setError('Failed to load gallery.'))
      .finally(() => setLoading(false))
  }, [])

  const albums = ['all', ...new Set(images.map((i) => i.album).filter(Boolean))]
  const filtered = albumFilter === 'all' ? images : images.filter((i) => i.album === albumFilter)

  const prev = () => setLightbox((i) => (i > 0 ? i - 1 : filtered.length - 1))
  const next = () => setLightbox((i) => (i < filtered.length - 1 ? i + 1 : 0))

  return (
    <PageTransition>
      <Section>
        <Container>
          <SectionHeader label="Gallery" title="Moments & memories" center />

          {/* Album filter */}
          {albums.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {albums.map((a) => (
                <button
                  key={a}
                  onClick={() => setAlbumFilter(a)}
                  className={`px-3 py-1.5 text-sm rounded-full border capitalize transition-colors ${
                    albumFilter === a
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:border-primary-400'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="skeleton h-48 rounded-lg" />
              ))}
            </div>
          )}

          {error && <p className="text-error text-center">{error}</p>}

          {!loading && !error && filtered.length === 0 && (
            <p className="text-neutral-500 text-center py-16">No images found.</p>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((img, i) => (
                <button
                  key={img._id}
                  onClick={() => setLightbox(i)}
                  className="overflow-hidden rounded-lg focus-visible:ring-2 focus-visible:ring-primary-500"
                  aria-label={img.caption || 'View image'}
                >
                  <img
                    src={img.imageUrl}
                    alt={img.caption || ''}
                    loading="lazy"
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </button>
              ))}
            </div>
          )}
        </Container>
      </Section>

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            aria-label="Close lightbox"
            className="absolute top-4 right-4 text-white p-2"
          >
            <IoClose size={28} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); prev() }} aria-label="Previous image" className="absolute left-4 text-white p-2">
            <IoChevronBack size={28} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); next() }} aria-label="Next image" className="absolute right-16 text-white p-2">
            <IoChevronForward size={28} />
          </button>
          <div onClick={(e) => e.stopPropagation()} className="max-w-4xl w-full">
            <img
              src={filtered[lightbox].imageUrl}
              alt={filtered[lightbox].caption || ''}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
            {filtered[lightbox].caption && (
              <p className="text-neutral-300 text-center mt-3 text-sm">{filtered[lightbox].caption}</p>
            )}
          </div>
        </div>
      )}
    </PageTransition>
  )
}
