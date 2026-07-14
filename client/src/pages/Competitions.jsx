import { useEffect, useState } from 'react'
import PageTransition from '@/components/molecules/PageTransition'
import Section from '@/components/molecules/Section'
import Container from '@/components/molecules/Container'
import SectionHeader from '@/components/molecules/SectionHeader'
import Card from '@/components/atoms/Card'
import { SkeletonCard } from '@/components/atoms/Skeleton'
import api from '@/utils/axiosInstance'

export default function Competitions() {
  const [comps, setComps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/competitions')
      .then((r) => setComps(r.data.data || r.data))
      .catch(() => setError('Failed to load competitions.'))
      .finally(() => setLoading(false))
  }, [])

  const upcoming = comps.filter((c) => c.isUpcoming)
  const past     = comps.filter((c) => !c.isUpcoming)

  return (
    <PageTransition>
      <Section>
        <Container>
          <SectionHeader label="Competitions" title="Our competitive journey" />

          {loading && (
            <div className="grid sm:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {error && <p className="text-error">{error}</p>}

          {!loading && !error && comps.length === 0 && (
            <p className="text-neutral-500 text-center py-16">No competitions listed yet.</p>
          )}

          {upcoming.length > 0 && (
            <>
              <h2 className="text-xl font-heading mb-4 text-green-600">Upcoming</h2>
              <div className="grid sm:grid-cols-2 gap-6 mb-10">
                {upcoming.map((c) => <CompCard key={c._id} comp={c} />)}
              </div>
            </>
          )}

          {past.length > 0 && (
            <>
              <h2 className="text-xl font-heading mb-4 text-neutral-500">Past</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {past.map((c) => <CompCard key={c._id} comp={c} />)}
              </div>
            </>
          )}
        </Container>
      </Section>
    </PageTransition>
  )
}

function CompCard({ comp }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-heading font-semibold text-on-surface">{comp.name}</h3>
        {comp.result && (
          <span className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
            {comp.result}
          </span>
        )}
      </div>
      <p className="text-sm text-neutral-500 mb-3">{comp.description}</p>
      {comp.date && <p className="text-xs text-neutral-400">{comp.date}</p>}
      {comp.links?.map((l, i) => (
        <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:underline block mt-1">
          {l.label}
        </a>
      ))}
    </Card>
  )
}
