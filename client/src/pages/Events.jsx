import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PageTransition from '@/components/molecules/PageTransition'
import api from '@/utils/axiosInstance'

const fade = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.4 } }

function Countdown({ targetDate }) {
  const [t, setT] = useState({})
  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate) - Date.now()
      if (diff <= 0) return setT({ expired: true })
      setT({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) })
    }
    calc(); const id = setInterval(calc, 1000); return () => clearInterval(id)
  }, [targetDate])

  if (t.expired) return <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Event started</span>
  return (
    <div style={{ display: 'flex', gap: '0.4rem' }}>
      {[['d', 'Days'], ['h', 'Hrs'], ['m', 'Min'], ['s', 'Sec']].map(([k, l]) => (
        <div key={k} style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '8px', padding: '0.4rem 0.6rem', textAlign: 'center', minWidth: '46px' }}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: '1.1rem', background: 'linear-gradient(135deg,#22d3ee,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t[k] ?? 0}</div>
          <div style={{ fontSize: '0.6rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l}</div>
        </div>
      ))}
    </div>
  )
}

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [speaker, setSpeaker] = useState(null)

  useEffect(() => {
    api.get('/events')
      .then(r => setEvents(r.data.data || r.data))
      .catch(() => setError('Failed to load events.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageTransition>
      <div style={{ background: '#070b11', minHeight: '100vh' }}>

        {/* Header */}
        <section style={{ position: 'relative', padding: '7rem 0 3rem', overflow: 'hidden' }} className="bg-grid">
          <div className="orb orb-cyan" style={{ width: '350px', height: '350px', top: '-50px', right: '8%', opacity: 0.2 }} />
          <div className="container-main" style={{ position: 'relative', zIndex: 1 }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="section-label">Events & Competitions</div>
              <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', color: '#f1f5f9', marginBottom: '0.75rem' }}>
                What's <span className="gradient-text">Happening...</span>
              </h1>
              <p style={{ color: '#94a3b8', maxWidth: '480px', lineHeight: 1.75 }}>
                Workshops, hackathons, and competitions — stay up to date with everything Spectrum.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Events list */}
        <section style={{ padding: '2rem 0 6rem' }}>
          <div className="container-main">
            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '140px', borderRadius: '16px' }} />)}
              </div>
            )}
            {error && <p style={{ color: '#ef4444', textAlign: 'center', padding: '3rem' }}>{error}</p>}
            {!loading && !error && events.length === 0 && (
              <div style={{ textAlign: 'center', padding: '5rem 0', color: '#64748b' }}>No events found.</div>
            )}
            {!loading && !error && events.map((ev, i) => (
              <motion.div key={ev._id} {...fade} transition={{ delay: i * 0.05 }} style={{ marginBottom: '1.25rem' }}>
                <div className="card-glass" style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between' }}>
                    {/* Left */}
                    <div style={{ flex: '1', minWidth: '240px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginBottom: '0.6rem' }}>
                        {ev.isUpcoming && <span className="badge-green">Upcoming</span>}
                        {ev.schedule?.[0]?.date && (
                          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>📅 {ev.schedule[0].date}</span>
                        )}
                      </div>
                      <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.15rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.5rem' }}>{ev.title}</h2>
                      <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '0.75rem' }}>{ev.description}</p>

                      {/* Schedule */}
                      {ev.schedule?.length > 0 && (
                        <div style={{ marginBottom: '0.75rem' }}>
                          <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#374151', marginBottom: '0.4rem' }}>Schedule</p>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                            {ev.schedule.map((s, j) => (
                              <li key={j} style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', gap: '0.75rem' }}>
                                <span style={{ color: '#374151', minWidth: '100px', flexShrink: 0 }}>{s.date} {s.time}</span>
                                <span>{s.activity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Speakers */}
                      {ev.speakers?.length > 0 && (
                        <div style={{ marginBottom: '0.75rem' }}>
                          <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#374151', marginBottom: '0.4rem' }}>Speakers</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {ev.speakers.map((sp, j) => (
                              <button key={j} onClick={() => setSpeaker(sp)} style={{
                                background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)',
                                borderRadius: '999px', padding: '0.25rem 0.75rem', fontSize: '0.8rem',
                                color: '#22d3ee', cursor: 'pointer', transition: 'all 0.2s',
                              }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.12)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,212,255,0.06)'}
                              >
                                {sp.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {ev.registrationUrl && (
                        <a href={ev.registrationUrl} target="_blank" rel="noopener noreferrer" className="btn-glow" style={{ fontSize: '0.85rem', padding: '0.45rem 1.1rem' }}>
                          Register Now
                        </a>
                      )}
                    </div>

                    {/* Countdown */}
                    {ev.isUpcoming && ev.schedule?.[0]?.date && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'flex-start' }}>
                        <p style={{ fontSize: '0.7rem', color: '#374151', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Starts in</p>
                        <Countdown targetDate={ev.schedule[0].date} />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Speaker modal */}
        {speaker && (
          <div role="dialog" aria-modal="true" onClick={() => setSpeaker(null)}
            style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div onClick={e => e.stopPropagation()} className="card-glass" style={{ maxWidth: '420px', width: '100%', padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                {speaker.photo && <img src={speaker.photo} alt={speaker.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(0,212,255,0.3)', flexShrink: 0 }} />}
                <div>
                  <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: '#e2e8f0', marginBottom: '0.25rem' }}>{speaker.name}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.65 }}>{speaker.bio}</p>
                </div>
              </div>
              <button onClick={() => setSpeaker(null)} className="btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>Close</button>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
