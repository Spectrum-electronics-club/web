import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { IoArrowBack } from 'react-icons/io5'
import PageTransition from '@/components/molecules/PageTransition'
import api from '@/utils/axiosInstance'

export default function ProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [imgIdx, setImgIdx]   = useState(0)

  useEffect(() => {
    api.get(`/projects/${id}`)
      .then(r => setProject(r.data.data || r.data))
      .catch(() => setError('Project not found.'))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <PageTransition>
      <div style={{ background:'#070b11', minHeight:'100vh' }}>
        <div className="container-main" style={{ paddingTop:'5rem', paddingBottom:'6rem' }}>
          <Link to="/projects" style={{
            display:'inline-flex', alignItems:'center', gap:'0.5rem',
            color:'#64748b', textDecoration:'none', fontSize:'0.875rem',
            marginBottom:'2.5rem', transition:'color 0.2s',
          }}
            onMouseEnter={e=>e.currentTarget.style.color='#22d3ee'}
            onMouseLeave={e=>e.currentTarget.style.color='#64748b'}>
            <IoArrowBack size={16} /> Back to Projects
          </Link>

          {loading && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem', maxWidth:'720px' }}>
              <div className="skeleton" style={{ height:'48px', width:'60%', borderRadius:'8px' }} />
              <div className="skeleton" style={{ height:'360px', borderRadius:'16px' }} />
              <div className="skeleton" style={{ height:'16px', width:'100%' }} />
              <div className="skeleton" style={{ height:'16px', width:'80%' }} />
            </div>
          )}
          {error && <p style={{ color:'#ef4444', padding:'3rem 0' }}>{error}</p>}

          {project && (
            <motion.article initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
              style={{ maxWidth:'800px' }}>

              {/* Title row */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:'1rem', alignItems:'flex-start', marginBottom:'1.5rem' }}>
                <h1 style={{ flex:1, fontSize:'clamp(1.8rem,4vw,2.5rem)', color:'#f1f5f9', margin:0 }}>{project.title}</h1>
                <span className={project.status==='ongoing'?'badge-green':project.status==='archived'?'badge-purple':'badge-cyan'}
                  style={{ fontSize:'0.85rem', padding:'0.3rem 0.85rem', alignSelf:'flex-start' }}>
                  {project.status}
                </span>
              </div>

              {/* Image viewer */}
              {project.images?.length > 0 && (
                <div style={{ marginBottom:'2rem' }}>
                  <img src={project.images[imgIdx]} alt={project.title}
                    style={{ width:'100%', maxHeight:'420px', objectFit:'cover', borderRadius:'16px',
                      border:'1px solid rgba(0,212,255,0.15)' }} />
                  {project.images.length > 1 && (
                    <div style={{ display:'flex', gap:'0.5rem', marginTop:'0.75rem', flexWrap:'wrap' }}>
                      {project.images.map((img, i) => (
                        <button key={i} onClick={() => setImgIdx(i)} style={{
                          border: i===imgIdx ? '2px solid #22d3ee' : '2px solid rgba(0,212,255,0.1)',
                          borderRadius:'8px', padding:0, cursor:'pointer', background:'none', overflow:'hidden',
                        }}>
                          <img src={img} alt="" style={{ width:'64px', height:'48px', objectFit:'cover', display:'block' }} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <p style={{ color:'#94a3b8', lineHeight:1.85, fontSize:'1rem', marginBottom:'2rem' }}>{project.description}</p>

              {/* Tech stack */}
              {project.techStack?.length > 0 && (
                <div style={{ marginBottom:'1.75rem' }}>
                  <p style={{ fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', color:'#374151', marginBottom:'0.75rem' }}>Tech Stack</p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
                    {project.techStack.map(t => <span key={t} className="badge-cyan" style={{ fontSize:'0.85rem', padding:'0.3rem 0.85rem' }}>{t}</span>)}
                  </div>
                </div>
              )}

              {/* Links */}
              <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-outline"
                    style={{ fontSize:'0.9rem', textDecoration:'none' }}>
                    <FaGithub size={15} /> GitHub
                  </a>
                )}
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="btn-glow"
                    style={{ fontSize:'0.9rem', textDecoration:'none' }}>
                    <FaExternalLinkAlt size={13} /> Live Demo
                  </a>
                )}
              </div>
            </motion.article>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
