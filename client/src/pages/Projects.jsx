import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import PageTransition from '@/components/molecules/PageTransition'
import api from '@/utils/axiosInstance'

const STATUS = ['all', 'ongoing', 'completed', 'archived']
const fade = { initial:{opacity:0,y:24}, whileInView:{opacity:1,y:0}, viewport:{once:true}, transition:{duration:0.4} }

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [search, setSearch]     = useState('')
  const [status, setStatus]     = useState('all')

  useEffect(() => {
    api.get('/projects')
      .then(r => setProjects(r.data.data || r.data))
      .catch(() => setError('Failed to load projects.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => projects.filter(p => {
    const ms = status === 'all' || p.status === status
    const q  = search.toLowerCase()
    const mq = !q || p.title.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
    return ms && mq
  }), [projects, search, status])

  return (
    <PageTransition>
      <div style={{ background: '#070b11', minHeight: '100vh' }}>
        {/* Header */}
        <section style={{ position: 'relative', padding: '7rem 0 3rem', overflow: 'hidden' }} className="bg-grid">
          <div className="orb orb-cyan" style={{ width: '350px', height: '350px', top: '-50px', right: '10%', opacity: 0.2 }} />
          <div className="container-main" style={{ position: 'relative', zIndex: 1 }}>
            <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
              <div className="section-label">Our Work</div>
              <h1 style={{ fontSize:'clamp(2rem,5vw,3rem)', color:'#f1f5f9', marginBottom:'1rem' }}>
                All <span className="gradient-text">Projects</span>
              </h1>
            </motion.div>
          </div>
        </section>

        <section style={{ padding:'2rem 0 6rem' }}>
          <div className="container-main">
            {/* Filters */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'1rem', marginBottom:'2.5rem', alignItems:'center' }}>
              <input className="input-dark" placeholder="Search projects…" value={search} onChange={e=>setSearch(e.target.value)}
                style={{ maxWidth:'280px', flex:'1' }} aria-label="Search projects" />
              <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                {STATUS.map(s => (
                  <button key={s} onClick={()=>setStatus(s)} style={{
                    padding:'0.4rem 1rem', borderRadius:'999px', fontSize:'0.8rem', fontWeight:600,
                    cursor:'pointer', border:'1px solid', transition:'all 0.2s', textTransform:'capitalize',
                    background: status===s ? 'rgba(0,212,255,0.15)' : 'transparent',
                    borderColor: status===s ? 'rgba(0,212,255,0.5)' : 'rgba(0,212,255,0.15)',
                    color: status===s ? '#22d3ee' : '#64748b',
                  }}>{s}</button>
                ))}
              </div>
            </div>

            {loading && (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.5rem' }}>
                {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height:'240px', borderRadius:'16px' }} />)}
              </div>
            )}
            {error && <p style={{ color:'#ef4444', textAlign:'center', padding:'3rem' }}>{error}</p>}
            {!loading && !error && filtered.length === 0 && (
              <div style={{ textAlign:'center', padding:'5rem 0' }}>
                <p style={{ fontSize:'3rem' }}>🔍</p>
                <p style={{ color:'#64748b' }}>No projects match your search.</p>
              </div>
            )}
            {!loading && !error && filtered.length > 0 && (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.5rem' }}>
                {filtered.map((p, i) => (
                  <motion.div key={p._id} {...fade} transition={{ delay: i*0.04 }}>
                    <Link to={`/projects/${p._id}`} style={{ textDecoration:'none', display:'block', height:'100%' }}>
                      <div className="card-glass" style={{ padding:'1.5rem', height:'100%', display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                        {p.images?.[0] && <img src={p.images[0]} alt={p.title} loading="lazy" style={{ width:'100%', height:'160px', objectFit:'cover', borderRadius:'10px', marginBottom:'0.25rem' }} />}
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'0.5rem' }}>
                          <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, color:'#e2e8f0', fontSize:'0.95rem', margin:0, flex:1 }}>{p.title}</h3>
                          <span className={p.status==='ongoing'?'badge-green':p.status==='archived'?'badge-purple':'badge-cyan'}>{p.status}</span>
                        </div>
                        <p style={{ color:'#64748b', fontSize:'0.85rem', lineHeight:1.6, margin:0, flex:1,
                          display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.description}</p>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:'0.35rem', marginTop:'auto' }}>
                          {p.techStack?.slice(0,4).map(t => <span key={t} className="badge-cyan">{t}</span>)}
                        </div>
                        <div style={{ display:'flex', gap:'0.75rem', paddingTop:'0.5rem', borderTop:'1px solid rgba(0,212,255,0.08)' }}>
                          {p.githubUrl && <span style={{ color:'#64748b', fontSize:'0.75rem', display:'flex', alignItems:'center', gap:'0.3rem' }}><FaGithub size={12} /> GitHub</span>}
                          {p.demoUrl   && <span style={{ color:'#64748b', fontSize:'0.75rem', display:'flex', alignItems:'center', gap:'0.3rem' }}><FaExternalLinkAlt size={11} /> Demo</span>}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
