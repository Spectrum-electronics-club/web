import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa'
import PageTransition from '@/components/molecules/PageTransition'
import api from '@/utils/axiosInstance'

const CATEGORY_ORDER = [
  'Faculty',
  'Leads',
  'Heads',
  'Deputy Heads',
  'Technical Team',
  'Presentation Team',
  'On-Ground Team',
  'Graphics Designing Team',
  'Audio Video Team'
]

const fade = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.4 } }

const FallbackAvatar = ({ text }) => {
  const display = text ? text.substring(0, 4) : 'User'
  return (
    <div style={{ 
      width: '80px', height: '80px', borderRadius: '50%', 
      background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: '1.25rem', fontWeight: 600,
      border: '1px solid rgba(99, 102, 241, 0.2)'
    }}>
      {display}
    </div>
  )
}

const SectionHeader = ({ category }) => {
  const hasBigTitle = category === 'Faculty'
  
  return (
    <div style={{ textAlign: 'center', marginBottom: '2.5rem', marginTop: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: hasBigTitle ? '1.5rem' : '0' }}>
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.4))', width: '20%', maxWidth: '100px' }} />
        <span style={{ color: '#38bdf8', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {category}
        </span>
        <div style={{ height: '1px', background: 'linear-gradient(270deg, transparent, rgba(56, 189, 248, 0.4))', width: '20%', maxWidth: '100px' }} />
      </div>
      
      {category === 'Faculty' && (
        <h2 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 700 }}>
          <span style={{ color: '#fff' }}>Faculty</span> <span style={{ color: '#60a5fa' }}>Mentors</span>
        </h2>
      )}
    </div>
  )
}

const MemberCard = ({ m, i }) => {
  const isJunior = m.tier === 'Junior Associate';
  
  return (
    <motion.div key={m._id} {...fade} transition={{ delay: i * 0.05 }} style={{ width: '240px' }}>
      <div style={{ 
        background: isJunior ? '#0a1929' : '#131127',
        border: isJunior ? '1px solid #00f3ff' : '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        height: '100%',
        boxShadow: isJunior ? '0 0 15px rgba(0, 243, 255, 0.4), inset 0 0 10px rgba(0, 243, 255, 0.1)' : '0 10px 30px -10px rgba(0,0,0,0.5)'
      }}>
      
      {m.photo && m.photo.trim() !== '' ? (
        <img
          src={m.photo}
          alt={m.fullName}
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
          style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
        />
      ) : (
        <FallbackAvatar text={m.fullName} />
      )}
      <div style={{ display: 'none' }}>
         <FallbackAvatar text={m.fullName} />
      </div>

      <div style={{ width: '100%' }}>
        <h3 style={{ 
          fontFamily: "'Space Grotesk',sans-serif", 
          fontWeight: 700, 
          color: '#ffffff', 
          margin: '0 0 0.4rem', 
          fontSize: '1.1rem' 
        }}>{m.fullName}</h3>
        <p style={{ 
          color: '#818cf8', 
          fontSize: '0.75rem', 
          margin: 0, 
          fontWeight: 700, 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em' 
        }}>{m.role}</p>
      </div>
      
      {/* Social Icons */}
      {(m.linkedinUrl || m.email || m.githubUrl) && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          {m.email && (
            <a href={`mailto:${m.email}`} style={{ 
              background: 'rgba(255,255,255,0.05)', padding: '0.4rem', borderRadius: '6px', color: '#94a3b8', transition: '0.2s' 
            }} onMouseEnter={e=>e.currentTarget.style.color='#fff'} onMouseLeave={e=>e.currentTarget.style.color='#94a3b8'}>
              <FaEnvelope size={14} />
            </a>
          )}
          {m.linkedinUrl && (
            <a href={m.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ 
              background: 'rgba(255,255,255,0.05)', padding: '0.4rem', borderRadius: '6px', color: '#94a3b8', transition: '0.2s' 
            }} onMouseEnter={e=>e.currentTarget.style.color='#fff'} onMouseLeave={e=>e.currentTarget.style.color='#94a3b8'}>
              <FaLinkedin size={14} />
            </a>
          )}
          {m.githubUrl && (
            <a href={m.githubUrl} target="_blank" rel="noopener noreferrer" style={{ 
              background: 'rgba(255,255,255,0.05)', padding: '0.4rem', borderRadius: '6px', color: '#94a3b8', transition: '0.2s' 
            }} onMouseEnter={e=>e.currentTarget.style.color='#fff'} onMouseLeave={e=>e.currentTarget.style.color='#94a3b8'}>
              <FaGithub size={14} />
            </a>
          )}
        </div>
      )}
    </div>
  </motion.div>
  )
}

export default function Team() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    api.get('/team')
      .then(r => setMembers(r.data.data || r.data))
      .catch(() => setError('Failed to load team members.'))
      .finally(() => setLoading(false))
  }, [])

  const groupedMembers = useMemo(() => {
    const groups = {}
    members.forEach(m => {
      let cat = m.category || 'Technical Team'
      if (cat === 'Faculty Members') cat = 'Faculty'
      
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(m)
    })
    
    // Sort each group by order
    Object.keys(groups).forEach(k => {
      groups[k].sort((a, b) => (a.order || 0) - (b.order || 0))
    })
    return groups
  }, [members])

  return (
    <PageTransition>
      <div style={{ background: '#070b11', minHeight: '100vh', paddingBottom: '6rem' }}>
        <section style={{ paddingTop: '5rem' }}>
          <div className="container-main">
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}>
                <p style={{ color: '#94a3b8' }}>Loading team...</p>
              </div>
            )}
            {error && <p style={{ color: '#ef4444', textAlign: 'center', padding: '3rem' }}>{error}</p>}
            
            {!loading && !error && CATEGORY_ORDER.map(cat => {
              const teamInCat = groupedMembers[cat]
              if (!teamInCat || teamInCat.length === 0) return null

              const isTeamCat = ['Technical Team', 'Presentation Team', 'On-Ground Team', 'Graphics Designing Team', 'Audio Video Team'].includes(cat)
              
              const seniors = teamInCat.filter(m => m.tier === 'Senior Associate')
              const juniors = teamInCat.filter(m => m.tier === 'Junior Associate')
              const others = teamInCat.filter(m => m.tier !== 'Senior Associate' && m.tier !== 'Junior Associate')

              return (
                <div key={cat} style={{ marginBottom: '2rem' }}>
                  <SectionHeader category={cat} />
                  
                  {isTeamCat ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                      {seniors.length > 0 && (
                        <div>
                          <h4 style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Senior Associates</h4>
                          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
                            {seniors.map((m, i) => <MemberCard key={m._id} m={m} i={i} />)}
                          </div>
                        </div>
                      )}
                      {juniors.length > 0 && (
                        <div>
                          <h4 style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Junior Associates</h4>
                          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
                            {juniors.map((m, i) => <MemberCard key={m._id} m={m} i={i} />)}
                          </div>
                        </div>
                      )}
                      {others.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
                          {others.map((m, i) => <MemberCard key={m._id} m={m} i={i} />)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
                      {teamInCat.map((m, i) => <MemberCard key={m._id} m={m} i={i} />)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
