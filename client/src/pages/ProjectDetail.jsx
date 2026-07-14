import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import PageTransition from '@/components/molecules/PageTransition'
import Section from '@/components/molecules/Section'
import Container from '@/components/molecules/Container'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import Skeleton from '@/components/atoms/Skeleton'
import api from '@/utils/axiosInstance'

export default function ProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get(`/projects/${id}`)
      .then((r) => setProject(r.data.data || r.data))
      .catch(() => setError('Failed to load project.'))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <PageTransition>
      <Section>
        <Container narrow>
          <Link to="/projects" className="text-sm text-primary-600 hover:underline mb-6 block">
            ← Back to Projects
          </Link>

          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-56 w-full rounded-xl" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          )}

          {error && <p className="text-error">{error}</p>}

          {project && (
            <article>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <h1>{project.title}</h1>
                <Badge variant={project.status}>{project.status}</Badge>
              </div>

              {project.images?.length > 0 && (
                <div className="mb-6 overflow-hidden rounded-xl">
                  <img src={project.images[0]} alt={project.title} className="w-full max-h-96 object-cover" />
                </div>
              )}

              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
                {project.description}
              </p>

              <div className="mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-500 mb-3">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack?.map((t) => <Badge key={t} variant="primary">{t}</Badge>)}
                </div>
              </div>

              <div className="flex gap-3">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" size="sm"><FaGithub /> GitHub</Button>
                  </a>
                )}
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="accent" size="sm"><FaExternalLinkAlt /> Live Demo</Button>
                  </a>
                )}
              </div>
            </article>
          )}
        </Container>
      </Section>
    </PageTransition>
  )
}
