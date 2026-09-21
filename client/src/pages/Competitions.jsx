import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PageTransition from '@/components/molecules/PageTransition'
import api from '@/utils/axiosInstance'

function CompCard({ comp }) {
  return (
    <div className="card-glass" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
        <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: '#e2e8f0', fontSize: '1rem', margin: 0 }}>{comp.name}</h3>
        {comp.result && (
          <span style={{ flexShrink: 0, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '999px', padding: '0.2rem 0.65rem', fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24' }}>
            🏆 {comp.result}
          </span>
        )}
      </div>
      {comp.date && <p style={{ color: '#374151', fontSize: '0.78rem', marginBottom: '0.4rem' }}>📅 {comp.date}</p>}
      {comp.description && <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '0.6rem' }}>{comp.description}</p>}
      {comp.links?.map((l, j) => (
        <a key={j} href={l.url} target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#22d3ee', textDecoration: 'none', marginRight: '0.75rem' }}>
          {l.label} →
        </a>
      ))}
    </div>
  )
}

export default function Competitions() {
  const [comps, setComps]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    api.get('/competitions')
      .then(r => setComps(r.data.data || r.data))
      .catch(() => setError('Failed to load competitions.'))
      .finally(() => setLoading(false))
  }, [])

  const upcoming = comps.filter(c => c.isUpcoming)
  const past     = comps.filter(c => !c.isUpcoming)

  return (
    <PageTransition>
      <div style={{ background: '#070b11', minHeight: '100vh' }}>
        <section style={{ position: 'relative', padding: '7rem 0 3rem', overflow: 'hidden' }}>
          <div className="container-main" style={{ position: 'relative', zIndex: 1 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <p style={{ color: '#06b6d4', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>Competitions</p>
              <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', color: '#f1f5f9', marginBottom: '0.75rem' }}>
                Our Competitive <span className="gradient-text">Journey</span>
              </h1>
              <p style={{ color: '#94a3b8', maxWidth: '480px', lineHeight: 1.75 }}>
                From local hackathons to national championships — Spectrum competes and wins.
              </p>
            </motion.div>
          </div>
        </section>

        <section style={{ padding: '2rem 0 6rem' }}>
          <div className="container-main">
            {loading && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.25rem' }}>
                {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: '140px', borderRadius: '12px' }} />)}
              </div>
            )}
            {error && <p style={{ color: '#ef4444', textAlign: 'center', padding: '3rem' }}>{error}</p>}
            {!loading && !error && comps.length === 0 && (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '4rem 0' }}>No competitions listed yet.</p>
            )}

            {upcoming.length > 0 && (
              <div style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <span className="badge-green" style={{ fontSize: '0.8rem', padding: '0.3rem 0.85rem' }}>Upcoming</span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(16,185,129,0.15)' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.25rem' }}>
                  {upcoming.map((c) => <CompCard key={c._id} comp={c} />)}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <span className="badge-purple" style={{ fontSize: '0.8rem', padding: '0.3rem 0.85rem' }}>Past</span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(139,92,246,0.15)' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.25rem' }}>
                  {past.map((c) => <CompCard key={c._id} comp={c} />)}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
