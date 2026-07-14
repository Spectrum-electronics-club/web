import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageTransition from '@/components/molecules/PageTransition'
import Section from '@/components/molecules/Section'
import Container from '@/components/molecules/Container'
import SectionHeader from '@/components/molecules/SectionHeader'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Input from '@/components/atoms/Input'
import { SkeletonCard } from '@/components/atoms/Skeleton'
import api from '@/utils/axiosInstance'

const STATUS_OPTIONS = ['all', 'ongoing', 'completed', 'archived']

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  useEffect(() => {
    api.get('/projects')
      .then((r) => setProjects(r.data.data || r.data))
      .catch(() => setError('Failed to load projects.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchStatus = status === 'all' || p.status === status
      const q = search.toLowerCase()
      const matchSearch = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
  }, [projects, search, status])

  return (
    <PageTransition>
      <Section>
        <Container>
          <SectionHeader label="Projects" title="Our work" />

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sm:max-w-xs"
              aria-label="Search projects"
            />
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors capitalize ${
                    status === s
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:border-primary-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {error && <p className="text-error">{error}</p>}

          {!loading && !error && filtered.length === 0 && (
            <p className="text-neutral-500 py-16 text-center">No projects match your search.</p>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <Link key={p._id} to={`/projects/${p._id}`}>
                  <Card hover className="p-5 h-full flex flex-col gap-3">
                    {p.images?.[0] && (
                      <img src={p.images[0]} alt={p.title} loading="lazy" className="w-full h-40 object-cover rounded-lg" />
                    )}
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-heading font-semibold text-on-surface line-clamp-1">{p.title}</h3>
                      <Badge variant={p.status}>{p.status}</Badge>
                    </div>
                    <p className="text-sm text-neutral-500 line-clamp-2">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {p.techStack?.slice(0, 4).map((t) => <Badge key={t} variant="default">{t}</Badge>)}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </PageTransition>
  )
}
