import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '@/components/molecules/PageTransition'
import api from '@/utils/axiosInstance'

// ── Animated stat counter ──────────────────────────────────────────────────
function Counter({ end, suffix = '' }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!end) return
    let start = 0
    const step = Math.ceil(end / 40)
    const timer = setInterval(() => {
      start = Math.min(start + step, end)
      setVal(start)
      if (start >= end) clearInterval(timer)
    }, 30)
    return () => clearInterval(timer)
  }, [end])
  return <span>{val}{suffix}</span>
}

const STATS = [
  { label: 'Active Members', value: 50, suffix: '+' },
  { label: 'Events Yearly', value: 5, suffix: '+' },
  { label: 'Projects Built', value: 30, suffix: '+' },

]

const DOMAINS = [
  { emoji: '🤖', title: 'Robotics', desc: 'Combat robots, autonomous bots, line followers, and humanoid research.', color: '#06b6d4' },
  { emoji: '🌐', title: 'IoT & Embedded', desc: 'Smart devices, sensor networks, ESP32/Arduino and cloud-connected systems.', color: '#8b5cf6' },
  { emoji: '🛸', title: 'Drones & UAVs', desc: 'FPV racing drones, autonomous UAVs, aerial photography, and flight controllers.', color: '#f59e0b' },
  { emoji: '⚡', title: 'Circuits & PCB', desc: 'Analog/digital circuit design, PCB layout, power electronics, and prototyping.', color: '#10b981' },
  { emoji: '🧠', title: 'AI & Machine Learning', desc: 'Edge AI, computer vision on embedded hardware, gesture recognition, and neural networks.', color: '#f43f5e' },
  { emoji: '🔬', title: 'Research', desc: 'Technical writing, research papers, documentation, and knowledge sharing.', color: '#a78bfa' },
]

const fade = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.5 } }

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
            flexShrink: 0, width: '48px', height: '48px', borderRadius: '12px',
            background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)',
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
      <section style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}
        className="bg-grid">
        {/* Glow orbs */}
        <div className="orb orb-cyan" style={{ width: '500px', height: '500px', top: '-100px', left: '-100px' }} />
        <div className="orb orb-purple" style={{ width: '400px', height: '400px', bottom: '-80px', right: '5%' }} />

        <div className="container-main" style={{ position: 'relative', zIndex: 1, paddingTop: '6rem', paddingBottom: '6rem' }}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            style={{ maxWidth: '820px' }}>

            <div className="section-label" style={{ marginBottom: '1.5rem' }}>
              ⚡ Engineering Club · Est. 2019
            </div>

            <h1 style={{ fontSize: 'clamp(2.2rem, 10vw, 5rem)', lineHeight: 1.08, marginBottom: '1.5rem', color: '#f1f5f9' }}>
              Building the{' '}
              <span className="gradient-text">Innovators</span>
              <br />of Tomorrow
            </h1>

            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#94a3b8', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: '560px' }}>
              A vibrant community of curious minds, creative thinkers, and future
              innovators shaping the world through Electronics and Robotics.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '4rem' }}>
              <Link to="/events" className="btn-glow" style={{ fontSize: '1rem', padding: '0.75rem 1.75rem' }}>
                Explore Events →
              </Link>
              <Link to="/about" className="btn-outline" style={{ fontSize: '1rem', padding: '0.75rem 1.75rem' }}>
                Learn More About Us
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-[520px]">
              {STATS.map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div className="stat-number"><Counter end={s.value} suffix={s.suffix} /></div>
                  <p style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0.25rem 0 0' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── ABOUT STRIP ───────────────────────────────────────────────────── */}
      <section style={{ background: '#0a0e17', padding: '5rem 0', borderTop: '1px solid rgba(0,212,255,0.08)', borderBottom: '1px solid rgba(0,212,255,0.08)' }}>
        <div className="container-main grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div {...fade}>
            <div className="section-label">About NGND</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#f1f5f9', marginBottom: '1rem' }}>
              More Than a Club <br /><span className="gradient-text-cyan">A Builder's Ecosystem</span>
            </h2>
            <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: '1rem' }}>
              Spectrum is a student-led Engineering and Research Club dedicated to bridging the gap between
              classroom theory and real-world innovation. We build robots, design circuits, develop AI systems,
              and compete on national stages.
            </p>
            <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: '1.75rem' }}>
              Our culture is rooted in curiosity, hands-on innovation, and a relentless drive to push the
              boundaries of technology.
            </p>
            <Link to="/about" className="btn-outline">Learn More About Us →</Link>
          </motion.div>
          <motion.div {...fade} className="grid grid-cols-2 gap-4">
            {[{ n: '2024', l: 'Year Founded' }, { n: '100+', l: 'Total Members' }, { n: '30+', l: 'Projects' }, { n: '15+', l: 'Hosted Events' }].map(s => (
              <div key={s.l} className="card-glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div className="stat-number" style={{ fontSize: '2rem' }}>{s.n}</div>
                <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0.25rem 0 0', fontWeight: 600 }}>{s.l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── DOMAINS ───────────────────────────────────────────────────────── */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container-main">
          <motion.div {...fade} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="section-label" style={{ margin: '0 auto 1.25rem' }}>Our Domains</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#f1f5f9' }}>Spectrum Operates Across<br /><span className="gradient-text">Multiple Technical Domains</span></h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {DOMAINS.map((d, i) => (
              <motion.div key={d.title} {...fade} transition={{ duration: 0.4, delay: i * 0.07 }}>
                <div className="card-glass" style={{ padding: '1.75rem', height: '100%' }}>
                  <div className="domain-icon" style={{ background: `${d.color}18`, border: `1px solid ${d.color}30` }}>
                    {d.emoji}
                  </div>
                  <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.05rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.6rem' }}>{d.title}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.65, margin: 0 }}>{d.desc}</p>
                  <div style={{ width: '2.5rem', height: '2px', background: `linear-gradient(90deg,${d.color},transparent)`, marginTop: '1rem' }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ─────────────────────────────────────────────── */}
      <section style={{ background: '#0a0e17', padding: '5rem 0', borderTop: '1px solid rgba(0,212,255,0.08)' }}>
        <div className="container-main">
          <motion.div {...fade} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <div className="section-label">Featured Projects</div>
              <h2 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.25rem)', color: '#f1f5f9', margin: 0 }}>Our Latest Work</h2>
            </div>
            <Link to="/projects" className="btn-outline" style={{ fontSize: '0.875rem' }}>All Projects →</Link>
          </motion.div>
          <FeaturedProjects />
        </div>
      </section>

      {/* ── UPCOMING EVENTS ───────────────────────────────────────────────── */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container-main">
          <motion.div {...fade} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <div className="section-label">Events</div>
              <h2 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.25rem)', color: '#f1f5f9', margin: 0 }}>Upcoming Events</h2>
            </div>
            <Link to="/events" className="btn-outline" style={{ fontSize: '0.875rem' }}>View All Events →</Link>
          </motion.div>
          <UpcomingEvents />
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section style={{ background: '#0a0e17', padding: '5rem 0', borderTop: '1px solid rgba(0,212,255,0.08)' }}>
        <div className="container-main">
          <motion.div {...fade} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="section-label" style={{ margin: '0 auto 1.25rem' }}>Testimonials</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#f1f5f9' }}>What Our Members <span className="gradient-text">Say</span></h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[
              { quote: "NGND gave me the resources and mentorship to build my first combat robot. It's an incredible community.", name: "Alex Kumar", role: "Robotics Lead" },
              { quote: "The hands-on experience here is something you just don't get in a classroom. Best part of my college life.", name: "Sara Jenkins", role: "Hardware Engineer" },
              { quote: "From hackathons to research papers, the support from seniors and alumni is unmatched.", name: "Michael Chen", role: "AI Researcher" }
            ].map((t, i) => (
              <motion.div key={i} {...fade} transition={{ duration: 0.4, delay: i * 0.1 }}>
                <div className="card-glass" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <p style={{ color: '#e2e8f0', fontSize: '1rem', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '1.5rem' }}>"{t.quote}"</p>
                  <div>
                    <div style={{ fontWeight: 700, color: '#22d3ee', fontFamily: "'Space Grotesk',sans-serif" }}>{t.name}</div>
                    <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPONSORS ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container-main">
          <motion.div {...fade} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Trusted by Industry Leaders & Partners</p>
          </motion.div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3rem', opacity: 0.6 }}>
            {['TechCorp', 'InnoVentures', 'RoboDynamics', 'NextGen AI', 'GlobalCircuits'].map((sponsor, i) => (
              <motion.div key={sponsor} {...fade} transition={{ duration: 0.4, delay: i * 0.05 }} style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", color: '#94a3b8' }}>
                {sponsor}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', padding: '6rem 0', overflow: 'hidden', background: '#050810' }}>
        <div className="orb orb-cyan" style={{ width: '400px', height: '400px', top: '50%', left: '10%', transform: 'translateY(-50%)', opacity: 0.2 }} />
        <div className="orb orb-purple" style={{ width: '350px', height: '350px', top: '50%', right: '10%', transform: 'translateY(-50%)', opacity: 0.2 }} />
        <div className="container-main" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div {...fade}>
            <div className="section-label" style={{ margin: '0 auto 1.5rem' }}>Join the Club</div>
            <h2 style={{ fontSize: 'clamp(2rem,5vw,3.25rem)', color: '#f1f5f9', marginBottom: '1rem' }}>
              Ready to Build<br /><span className="gradient-text">Something Amazing?</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '520px', margin: '0 auto 2.5rem', lineHeight: 1.75 }}>
              Join NGND and get access to our lab, workshops, competitions, and a community
              of 200+ engineers who love building things.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/about" className="btn-glow" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
