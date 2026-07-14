import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '@/components/molecules/PageTransition'
import Section from '@/components/molecules/Section'
import Container from '@/components/molecules/Container'
import SectionHeader from '@/components/molecules/SectionHeader'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import { SkeletonCard } from '@/components/atoms/Skeleton'
import Button from '@/components/atoms/Button'
import api from '@/utils/axiosInstance'

function FeaturedProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/projects?featured=true')
      .then((r) => setProjects(r.data.data || r.data))
      .catch(() => setError('Failed to load projects.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  )
  if (error) return <p className="text-error text-sm">{error}</p>
  if (!projects.length) return <p className="text-neutral-500">No featured projects yet.</p>

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((p) => (
        <Link key={p._id} to={`/projects/${p._id}`}>
          <Card hover className="p-5 h-full flex flex-col gap-3">
            {p.images?.[0] && (
              <img
                src={p.images[0]}
                alt={p.title}
                loading="lazy"
                className="w-full h-40 object-cover rounded-lg"
              />
            )}
            <div className="flex items-center justify-between">
              <h3 className="text-base font-heading font-semibold text-on-surface line-clamp-1">{p.title}</h3>
              <Badge variant={p.status}>{p.status}</Badge>
            </div>
            <p className="text-sm text-neutral-500 line-clamp-2">{p.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {p.techStack?.slice(0, 4).map((t) => (
                <Badge key={t} variant="default">{t}</Badge>
              ))}
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}

function UpcomingEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/events?upcoming=true')
      .then((r) => setEvents(r.data.data || r.data))
      .catch(() => setError('Failed to load events.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  )
  if (error) return <p className="text-error text-sm">{error}</p>
  if (!events.length) return <p className="text-neutral-500">No upcoming events at the moment.</p>

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((ev) => (
        <Card key={ev._id} hover className="p-5 flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-500">
            {new Date(ev.schedule?.[0]?.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <h3 className="text-base font-heading font-semibold text-on-surface">{ev.title}</h3>
          <p className="text-sm text-neutral-500 line-clamp-2">{ev.description}</p>
        </Card>
      ))}
    </div>
  )
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5, ease: 'easeOut' },
}

export default function Home() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-primary-950 via-neutral-900 to-neutral-950 overflow-hidden">
        <div className="container-main relative z-10 py-24">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/20 text-primary-300 text-sm font-semibold mb-6">
              Welcome to NGND Club
            </span>
            <h1 className="text-white mb-6">
              Building the future through innovation &amp; research
            </h1>
            <p className="text-neutral-300 text-xl mb-8 leading-relaxed">
              A community of engineers, researchers, and creators working together
              to solve real-world problems and push the boundaries of technology.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/projects">
                <Button size="lg" variant="primary">Explore Projects</Button>
              </Link>
              <Link to="/join">
                <Button size="lg" variant="secondary" className="border-neutral-600 text-white hover:bg-neutral-800">
                  Join the Club
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        {/* Decorative blobs */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      </section>

      {/* What We Do */}
      <Section alt>
        <Container>
          <motion.div {...fadeUp}>
            <SectionHeader
              label="What We Do"
              title="Where curiosity meets creation"
              subtitle="We blend technical rigor with creative problem-solving across multiple engineering and research domains."
              center
            />
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {['Research & Development', 'Engineering Projects', 'Competitions', 'Workshops & Events', 'Publications', 'Mentorship'].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                <Card className="p-6 text-center h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-950 flex items-center justify-center mx-auto mb-4">
                    <div className="w-5 h-5 bg-primary-500 rounded" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-heading font-semibold text-on-surface">{item}</h3>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Featured Projects */}
      <Section>
        <Container>
          <motion.div {...fadeUp}>
            <SectionHeader
              label="Featured Work"
              title="Our latest projects"
              subtitle="A selection of our most impactful work — from research prototypes to deployed systems."
            />
          </motion.div>
          <FeaturedProjects />
          <div className="mt-10 flex justify-center">
            <Link to="/projects">
              <Button variant="secondary">View all projects</Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Upcoming Events */}
      <Section alt>
        <Container>
          <motion.div {...fadeUp}>
            <SectionHeader
              label="Events"
              title="What's coming up"
            />
          </motion.div>
          <UpcomingEvents />
          <div className="mt-10 flex justify-center">
            <Link to="/events">
              <Button variant="secondary">See all events</Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 py-20">
        <Container>
          <div className="text-center text-white">
            <motion.div {...fadeUp}>
              <h2 className="mb-4">Ready to be part of something bigger?</h2>
              <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
                Join NGND and collaborate with talented people on meaningful projects.
              </p>
              <Link to="/join">
                <Button size="lg" className="bg-white text-primary-700 hover:bg-primary-50">
                  Apply Now
                </Button>
              </Link>
            </motion.div>
          </div>
        </Container>
      </section>
    </PageTransition>
  )
}
