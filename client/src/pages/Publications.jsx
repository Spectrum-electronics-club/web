import { useEffect, useMemo, useState } from 'react'
import { FaFilePdf, FaExternalLinkAlt } from 'react-icons/fa'
import PageTransition from '@/components/molecules/PageTransition'
import Section from '@/components/molecules/Section'
import Container from '@/components/molecules/Container'
import SectionHeader from '@/components/molecules/SectionHeader'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import { SkeletonCard } from '@/components/atoms/Skeleton'
import api from '@/utils/axiosInstance'

export default function Publications() {
  const [pubs, setPubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTag, setActiveTag] = useState('all')

  useEffect(() => {
    api.get('/publications')
      .then((r) => setPubs(r.data.data || r.data))
      .catch(() => setError('Failed to load publications.'))
      .finally(() => setLoading(false))
  }, [])

  const allTags = useMemo(() => {
    const tags = new Set()
    pubs.forEach((p) => p.tags?.forEach((t) => tags.add(t)))
    return ['all', ...Array.from(tags)]
  }, [pubs])

  const filtered = useMemo(() => {
    const sorted = [...pubs].sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
    return activeTag === 'all' ? sorted : sorted.filter((p) => p.tags?.includes(activeTag))
  }, [pubs, activeTag])

  return (
    <PageTransition>
      <Section>
        <Container>
          <SectionHeader label="Publications" title="Research & writings" />

          {allTags.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {allTags.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTag(t)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    activeTag === t
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:border-primary-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {error && <p className="text-error">{error}</p>}

          {!loading && !error && filtered.length === 0 && (
            <p className="text-neutral-500 py-16 text-center">No publications found.</p>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="space-y-4">
              {filtered.map((pub) => (
                <Card key={pub._id} className="p-6">
                  <h3 className="font-heading font-semibold text-on-surface mb-1">{pub.title}</h3>
                  <p className="text-sm text-neutral-500 mb-2">
                    {pub.authors?.join(', ')} · {pub.publishedDate ? new Date(pub.publishedDate).getFullYear() : ''}
                  </p>
                  {pub.abstract && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-3">
                      {pub.abstract.slice(0, 300)}{pub.abstract.length > 300 ? '…' : ''}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {pub.tags?.map((t) => <Badge key={t} variant="default">{t}</Badge>)}
                  </div>
                  <div className="flex gap-3">
                    {pub.pdfUrl && (
                      <a href={pub.pdfUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-error hover:underline">
                        <FaFilePdf /> PDF
                      </a>
                    )}
                    {pub.externalUrl && (
                      <a href={pub.externalUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:underline">
                        <FaExternalLinkAlt /> View
                      </a>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </PageTransition>
  )
}
