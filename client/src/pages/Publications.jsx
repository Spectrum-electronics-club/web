import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FaFilePdf, FaExternalLinkAlt } from 'react-icons/fa'
import PageTransition from '@/components/molecules/PageTransition'
import api from '@/utils/axiosInstance'

const fade = { initial:{opacity:0,y:24}, whileInView:{opacity:1,y:0}, viewport:{once:true}, transition:{duration:0.4} }

export default function Publications() {
  const [pubs, setPubs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [tag, setTag]         = useState('all')

  useEffect(() => {
    api.get('/publications')
      .then(r => setPubs(r.data.data || r.data))
      .catch(() => setError('Failed to load publications.'))
      .finally(() => setLoading(false))
  }, [])

  const allTags  = useMemo(() => ['all', ...new Set(pubs.flatMap(p => p.tags || []))], [pubs])
  const filtered = useMemo(() => {
    const sorted = [...pubs].sort((a,b) => new Date(b.publishedDate) - new Date(a.publishedDate))
    return tag === 'all' ? sorted : sorted.filter(p => p.tags?.includes(tag))
  }, [pubs, tag])

  return (
    <PageTransition>
      <div style={{ background:'#070b11', minHeight:'100vh' }}>
        <section style={{ position:'relative', padding:'7rem 0 3rem', overflow:'hidden' }} className="bg-grid">
          <div className="orb orb-cyan" style={{ width:'300px', height:'300px', top:'-40px', left:'5%', opacity:0.2 }} />
          <div className="container-main" style={{ position:'relative', zIndex:1 }}>
            <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
              <div className="section-label">Research & Writings</div>
              <h1 style={{ fontSize:'clamp(2rem,5vw,3rem)', color:'#f1f5f9', marginBottom:'0.75rem' }}>
                <span className="gradient-text">Publications</span>
              </h1>
              <p style={{ color:'#94a3b8', maxWidth:'480px', lineHeight:1.75 }}>
                Technical papers, research articles, and knowledge contributions from NGND members.
              </p>
            </motion.div>
          </div>
        </section>

        <section style={{ padding:'2rem 0 6rem' }}>
          <div className="container-main">
            {allTags.length > 1 && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginBottom:'2.5rem' }}>
                {allTags.map(t => (
                  <button key={t} onClick={() => setTag(t)} style={{
                    padding:'0.4rem 1rem', borderRadius:'999px', fontSize:'0.8rem', fontWeight:600,
                    cursor:'pointer', border:'1px solid', transition:'all 0.2s',
                    background: tag===t ? 'rgba(0,212,255,0.15)' : 'transparent',
                    borderColor: tag===t ? 'rgba(0,212,255,0.5)' : 'rgba(0,212,255,0.15)',
                    color: tag===t ? '#22d3ee' : '#64748b',
                  }}>{t}</button>
                ))}
              </div>
            )}

            {loading && (
              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height:'120px', borderRadius:'16px' }} />)}
              </div>
            )}
            {error && <p style={{ color:'#ef4444', textAlign:'center', padding:'3rem' }}>{error}</p>}
            {!loading && !error && filtered.length === 0 && (
              <p style={{ color:'#64748b', textAlign:'center', padding:'4rem 0' }}>No publications found.</p>
            )}
            {!loading && !error && filtered.map((pub, i) => (
              <motion.div key={pub._id} {...fade} transition={{ delay: i*0.05 }} style={{ marginBottom:'1rem' }}>
                <div className="card-glass" style={{ padding:'1.5rem' }}>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginBottom:'0.5rem' }}>
                    {pub.tags?.map(t => <span key={t} className="badge-cyan">{t}</span>)}
                    {pub.publishedDate && (
                      <span style={{ color:'#374151', fontSize:'0.75rem', marginLeft:'auto' }}>
                        {new Date(pub.publishedDate).toLocaleDateString('en-US', { year:'numeric', month:'short' })}
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, color:'#e2e8f0', fontSize:'1rem', marginBottom:'0.4rem' }}>{pub.title}</h3>
                  {pub.authors?.length > 0 && (
                    <p style={{ color:'#64748b', fontSize:'0.8rem', marginBottom:'0.6rem' }}>{pub.authors.join(', ')}</p>
                  )}
                  {pub.abstract && (
                    <p style={{ color:'#94a3b8', fontSize:'0.85rem', lineHeight:1.65, marginBottom:'0.75rem',
                      display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                      {pub.abstract}
                    </p>
                  )}
                  <div style={{ display:'flex', gap:'1rem' }}>
                    {pub.pdfUrl && (
                      <a href={pub.pdfUrl} target="_blank" rel="noopener noreferrer"
                        style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', fontSize:'0.8rem', color:'#ef4444', textDecoration:'none', fontWeight:600 }}
                        onMouseEnter={e=>e.currentTarget.style.opacity='0.75'} onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
                        <FaFilePdf size={13}/> PDF
                      </a>
                    )}
                    {pub.externalUrl && (
                      <a href={pub.externalUrl} target="_blank" rel="noopener noreferrer"
                        style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', fontSize:'0.8rem', color:'#22d3ee', textDecoration:'none', fontWeight:600 }}
                        onMouseEnter={e=>e.currentTarget.style.opacity='0.75'} onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
                        <FaExternalLinkAlt size={11}/> View
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
