import { useEffect, useState } from 'react'
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa'
import PageTransition from '@/components/molecules/PageTransition'
import Section from '@/components/molecules/Section'
import Container from '@/components/molecules/Container'
import SectionHeader from '@/components/molecules/SectionHeader'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import { SkeletonCard } from '@/components/atoms/Skeleton'
import api from '@/utils/axiosInstance'

export default function Team() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/team')
      .then((r) => setMembers(r.data.data || r.data))
      .catch(() => setError('Failed to load team members.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageTransition>
      <Section>
        <Container>
          <SectionHeader label="Team" title="The people behind NGND" center />

          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {error && <p className="text-error text-center">{error}</p>}

          {!loading && !error && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {members.map((m) => (
                <Card key={m._id} className="p-5 text-center flex flex-col items-center gap-3">
                  <img
                    src={m.photo || '/images/avatar-placeholder.svg'}
                    alt={m.fullName}
                    loading="lazy"
                    onError={(e) => { e.target.src = '/images/avatar-placeholder.svg' }}
                    className="w-20 h-20 rounded-full object-cover border-2 border-primary-200 dark:border-primary-800"
                  />
                  <div>
                    <h3 className="text-sm font-heading font-semibold text-on-surface">{m.fullName}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">{m.role}</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {m.skills?.slice(0, 3).map((s) => (
                      <Badge key={s} variant="primary">{s}</Badge>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-1">
                    {m.linkedinUrl && (
                      <a href={m.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label={`${m.fullName} LinkedIn`} className="text-neutral-400 hover:text-primary-500 transition-colors">
                        <FaLinkedin size={16} />
                      </a>
                    )}
                    {m.githubUrl && (
                      <a href={m.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`${m.fullName} GitHub`} className="text-neutral-400 hover:text-on-surface transition-colors">
                        <FaGithub size={16} />
                      </a>
                    )}
                    {m.email && (
                      <a href={`mailto:${m.email}`} aria-label={`Email ${m.fullName}`} className="text-neutral-400 hover:text-accent-500 transition-colors">
                        <FaEnvelope size={16} />
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
