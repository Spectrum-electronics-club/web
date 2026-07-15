import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { IoClose, IoChevronBack, IoChevronForward } from 'react-icons/io5'
import PageTransition from '@/components/molecules/PageTransition'
import api from '@/utils/axiosInstance'

export default function Gallery() {
  const [images, setImages]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [album, setAlbum]     = useState('all')
  const [lb, setLb]           = useState(null) // lightbox index

  useEffect(() => {
    api.get('/gallery')
      .then(r => setImages(r.data.data || r.data))
      .catch(() => setError('Failed to load gallery.'))
      .finally(() => setLoading(false))
  }, [])

  const albums   = ['all', ...new Set(images.map(i => i.album).filter(Boolean))]
  const filtered = album === 'all' ? images : images.filter(i => i.album === album)

  // Keyboard nav for lightbox
  useEffect(() => {
    if (lb === null) return
    const onKey = e => {
      if (e.key === 'Escape')      setLb(null)
      if (e.key === 'ArrowLeft')   setLb(i => (i > 0 ? i - 1 : filtered.length - 1))
      if (e.key === 'ArrowRight')  setLb(i => (i < filtered.length - 1 ? i + 1 : 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lb, filtered.length])

  return (
    <PageTransition>
      <div style={{ background:'#070b11', minHeight:'100vh' }}>

        {/* Header */}
        <section style={{ position:'relative', padding:'7rem 0 3rem', overflow:'hidden' }} className="bg-grid">
          <div className="orb orb-purple" style={{ width:'350px', height:'350px', top:'-50px', right:'10%', opacity:0.2 }} />
          <div className="container-main" style={{ position:'relative', zIndex:1, textAlign:'center' }}>
            <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
              <div className="section-label" style={{ margin:'0 auto 1rem' }}>Photo Gallery</div>
              <h1 style={{ fontSize:'clamp(2rem,5vw,3rem)', color:'#f1f5f9', marginBottom:'0.75rem' }}>
                Moments & <span className="gradient-text">Memories</span>
              </h1>
              <p style={{ color:'#94a3b8', maxWidth:'400px', margin:'0 auto', lineHeight:1.75 }}>
                Visual highlights from our events, workshops, and competitions.
              </p>
            </motion.div>
          </div>
        </section>

        <section style={{ padding:'2rem 0 6rem' }}>
          <div className="container-main">

            {/* Album filter */}
            {albums.length > 1 && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginBottom:'2rem', justifyContent:'center' }}>
                {albums.map(a => (
                  <button key={a} onClick={() => setAlbum(a)} style={{
                    padding:'0.4rem 1rem', borderRadius:'999px', fontSize:'0.8rem', fontWeight:600,
                    cursor:'pointer', border:'1px solid', transition:'all 0.2s', textTransform:'capitalize',
                    background: album===a ? 'rgba(0,212,255,0.15)' : 'transparent',
                    borderColor: album===a ? 'rgba(0,212,255,0.5)' : 'rgba(0,212,255,0.15)',
                    color: album===a ? '#22d3ee' : '#64748b',
                  }}>{a}</button>
                ))}
              </div>
            )}

            {loading && (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'1rem' }}>
                {[1,2,3,4,5,6,8,9,10,11,12].map(i => <div key={i} className="skeleton" style={{ height:'200px', borderRadius:'12px' }} />)}
              </div>
            )}
            {error && <p style={{ color:'#ef4444', textAlign:'center', padding:'3rem' }}>{error}</p>}
            {!loading && !error && filtered.length === 0 && (
              <p style={{ color:'#64748b', textAlign:'center', padding:'4rem 0' }}>No images found.</p>
            )}

            {!loading && !error && filtered.length > 0 && (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'1rem' }}>
                {filtered.map((img, i) => (
                  <motion.button key={img._id} initial={{ opacity:0, scale:0.96 }} whileInView={{ opacity:1, scale:1 }}
                    viewport={{ once:true }} transition={{ duration:0.3, delay: i * 0.03 }}
                    onClick={() => setLb(i)}
                    aria-label={img.caption || 'View image'}
                    style={{ border:'none', padding:0, cursor:'pointer', borderRadius:'12px', overflow:'hidden',
                      background:'transparent', display:'block', position:'relative' }}>
                    <img src={img.imageUrl} alt={img.caption || ''} loading="lazy"
                      style={{ width:'100%', height:'200px', objectFit:'cover', display:'block',
                        transition:'transform 0.35s', borderRadius:'12px',
                        border:'1px solid rgba(0,212,255,0.1)' }}
                      onMouseEnter={e => e.target.style.transform='scale(1.05)'}
                      onMouseLeave={e => e.target.style.transform='scale(1)'}
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Lightbox */}
        {lb !== null && filtered[lb] && (
          <div role="dialog" aria-modal="true" aria-label="Image viewer"
            onClick={() => setLb(null)}
            style={{ position:'fixed', inset:0, zIndex:60, background:'rgba(0,0,0,0.92)', backdropFilter:'blur(10px)',
              display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>

            <button onClick={() => setLb(null)} aria-label="Close"
              style={{ position:'absolute', top:'1.25rem', right:'1.25rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'50%', width:'40px', height:'40px', display:'flex', alignItems:'center', justifyContent:'center', color:'#e2e8f0', cursor:'pointer' }}>
              <IoClose size={20} />
            </button>
            <button onClick={e => { e.stopPropagation(); setLb(i => (i > 0 ? i-1 : filtered.length-1)) }} aria-label="Previous"
              style={{ position:'absolute', left:'1rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'50%', width:'44px', height:'44px', display:'flex', alignItems:'center', justifyContent:'center', color:'#e2e8f0', cursor:'pointer' }}>
              <IoChevronBack size={22} />
            </button>
            <button onClick={e => { e.stopPropagation(); setLb(i => (i < filtered.length-1 ? i+1 : 0)) }} aria-label="Next"
              style={{ position:'absolute', right:'1rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'50%', width:'44px', height:'44px', display:'flex', alignItems:'center', justifyContent:'center', color:'#e2e8f0', cursor:'pointer' }}>
              <IoChevronForward size={22} />
            </button>

            <div onClick={e => e.stopPropagation()} style={{ maxWidth:'900px', width:'100%', textAlign:'center' }}>
              <img src={filtered[lb].imageUrl} alt={filtered[lb].caption || ''}
                style={{ maxWidth:'100%', maxHeight:'80vh', objectFit:'contain', borderRadius:'12px', border:'1px solid rgba(0,212,255,0.15)' }} />
              {filtered[lb].caption && (
                <p style={{ color:'#94a3b8', marginTop:'1rem', fontSize:'0.875rem' }}>{filtered[lb].caption}</p>
              )}
              <p style={{ color:'#374151', fontSize:'0.75rem', marginTop:'0.5rem' }}>{lb+1} / {filtered.length}</p>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
