import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '@/components/molecules/PageTransition'
import api from '@/utils/axiosInstance'



const DOMAINS = [
  { emoji: '🤖', title: 'Robotics', desc: 'Combat robots, autonomous bots, line followers, and humanoid research.', color: '#06b6d4' },
  { emoji: '🌐', title: 'IoT & Embedded', desc: 'Smart devices, sensor networks, ESP32/Arduino and cloud-connected systems.', color: '#8b5cf6' },
  { emoji: '🛸', title: 'Drones & UAVs', desc: 'FPV racing drones, autonomous UAVs, aerial photography, and flight controllers.', color: '#f59e0b' },
  { emoji: '⚡', title: 'Circuits & PCB', desc: 'Analog/digital circuit design, PCB layout, power electronics, and prototyping.', color: '#10b981' },
  { emoji: '🧠', title: 'AI & Machine Learning', desc: 'Edge AI, computer vision on embedded hardware, gesture recognition, and neural networks.', color: '#f43f5e' },
  { emoji: '🔬', title: 'Research', desc: 'Technical writing, research papers, documentation, and knowledge sharing.', color: '#a78bfa' },
]

// ── Featured projects fetcher ──────────────────────────────────────────────
function FeaturedProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/projects?featured=true')
      .then(r => setProjects(r.data.data || r.data))
      .catch(() => setError('Failed to load projects.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: '1.5rem' }}>
      {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: '220px' }} />)}
    </div>
  )
  if (error || !projects.length) return (
    <p style={{ color: '#64748b', textAlign: 'center', padding: '3rem 0' }}>
      {error || 'No featured projects yet.'}
    </p>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: '1.5rem' }}>
      {projects.map(p => (
        <Link key={p._id} to={`/projects/${p._id}`} style={{ textDecoration: 'none' }}>
          <div className="card-glass" style={{ padding: '1.5rem', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <span className="badge-cyan">{p.techStack?.[0] || 'Project'}</span>
              <span className={p.status === 'ongoing' ? 'badge-green' : 'badge-purple'}>{p.status}</span>
            </div>
            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.5rem' }}>{p.title}</h3>
            <p style={{
              color: '#64748b', fontSize: '0.85rem', lineHeight: 1.6,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
            }}>
              {p.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}

// ── Upcoming events fetcher ────────────────────────────────────────────────
function UpcomingEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/events?upcoming=true')
      .then(r => setEvents(r.data.data || r.data))
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '100px' }} />)}
    </div>
  )
  if (!events.length) return <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem 0' }}>No upcoming events.</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {events.map(ev => (
        <div key={ev._id} className="card-glass" style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
          <div style={{
            flexShrink: 0, width: '48px', height: '48px', borderRadius: '10px',
            background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem'
          }}>
            🎪
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
              {ev.isUpcoming && <span className="badge-green">Upcoming</span>}
              {ev.schedule?.[0]?.date && (
                <span style={{ color: '#64748b', fontSize: '0.75rem' }}>📅 {ev.schedule[0].date}</span>
              )}
            </div>
            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.95rem', fontWeight: 700, color: '#e2e8f0', margin: '0 0 0.25rem' }}>{ev.title}</h3>
            <p style={{
              color: '#64748b', fontSize: '0.8rem', margin: 0,
              display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden'
            }}>
              {ev.description}
            </p>
          </div>
          {ev.registrationUrl && (
            <a href={ev.registrationUrl} target="_blank" rel="noopener noreferrer"
              className="btn-glow" style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem', flexShrink: 0 }}>
              Register
            </a>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <PageTransition>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div className="container-main" style={{ position: 'relative', zIndex: 1, paddingTop: '6rem', paddingBottom: '6rem' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ maxWidth: '820px' }}>



            <h1 style={{ fontSize: 'clamp(2.2rem, 10vw, 4.5rem)', lineHeight: 1.08, marginBottom: '1.5rem', color: '#f1f5f9' }}>
              Building the{' '}
              <span className="gradient-text">Innovators</span>
              <br />of Tomorrow
            </h1>

            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: '#94a3b8', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: '560px' }}>
              Students working on electronics, embedded systems, robotics, and
              real-world engineering projects. From circuit design to autonomous
              drones — we build things that work.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '4rem' }}>
              <Link to="/events" className="btn-glow" style={{ fontSize: '1rem', padding: '0.75rem 1.75rem' }}>
                Explore Events →
              </Link>
              <Link to="/about" className="btn-outline" style={{ fontSize: '1rem', padding: '0.75rem 1.75rem' }}>
                About Us
              </Link>
            </div>


          </motion.div>
        </div>
      </section>

      {/* ── ABOUT STRIP ───────────────────────────────────────────────────── */}
      <section style={{ background: '#0a0e17', padding: '5rem 0', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="container-main grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <p style={{ color: '#06b6d4', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>About Spectrum</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#f1f5f9', marginBottom: '1rem' }}>
              More Than a Club —<br /><span className="gradient-text">A Builder's Ecosystem</span>
            </h2>
            <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: '1rem' }}>
              Spectrum is a student-led electronics and engineering club. We build robots,
              design circuits, develop embedded systems, and compete on national stages.
            </p>
            <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: '1.75rem' }}>
              Our culture is rooted in curiosity, hands-on innovation, and a drive to push the
              boundaries of what students can build.
            </p>
            <Link to="/about" className="btn-outline">Learn More →</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[{ n: '2024', l: 'Year Founded' }, { n: '50+', l: 'Members' }, { n: '10+', l: 'Projects' }, { n: '5+', l: 'Events Organised' }].map(s => (
              <div key={s.l} className="card-glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div className="stat-number" style={{ fontSize: '2rem' }}>{s.n}</div>
                <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0.25rem 0 0', fontWeight: 600 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOMAINS ───────────────────────────────────────────────────────── */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container-main">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ color: '#06b6d4', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>Our Domains</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#f1f5f9' }}>What We <span className="gradient-text">Work On</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {DOMAINS.map((d) => (
              <div key={d.title} className="card-glass" style={{ padding: '1.75rem', height: '100%' }}>
                <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.05rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.6rem' }}>{d.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.65, margin: 0 }}>{d.desc}</p>
                <div style={{ width: '2.5rem', height: '2px', background: d.color, marginTop: '1rem', opacity: 0.6 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ─────────────────────────────────────────────── */}
      <section style={{ background: '#0a0e17', padding: '5rem 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="container-main">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <p style={{ color: '#06b6d4', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>Featured Projects</p>
              <h2 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.25rem)', color: '#f1f5f9', margin: 0 }}>Our Latest Work</h2>
            </div>
            <Link to="/projects" className="btn-outline" style={{ fontSize: '0.875rem' }}>All Projects →</Link>
          </div>
          <FeaturedProjects />
        </div>
      </section>

      {/* ── UPCOMING EVENTS ───────────────────────────────────────────────── */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container-main">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <p style={{ color: '#06b6d4', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>Events</p>
              <h2 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.25rem)', color: '#f1f5f9', margin: 0 }}>Upcoming Events</h2>
            </div>
            <Link to="/events" className="btn-outline" style={{ fontSize: '0.875rem' }}>View All Events →</Link>
          </div>
          <UpcomingEvents />
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', padding: '6rem 0', overflow: 'hidden', background: '#050810' }}>
        <div className="container-main" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(2rem,5vw,3.25rem)', color: '#f1f5f9', marginBottom: '1rem' }}>
            Ready to Build<br /><span className="gradient-text">Something Amazing?</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '520px', margin: '0 auto 2.5rem', lineHeight: 1.75 }}>
            Join Spectrum and get access to our lab, workshops, competitions, and a community
            of engineers who love building things.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/join" className="btn-glow" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
              Apply Now
            </Link>
            <Link to="/contact" className="btn-outline" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
