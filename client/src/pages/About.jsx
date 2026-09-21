import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PageTransition from '@/components/molecules/PageTransition'
import api from '@/utils/axiosInstance'

const VALUES = [
  { icon: '🔬', title: 'Curiosity', desc: 'We ask why. Then we build the answer.' },
  { icon: '🤝', title: 'Collaboration', desc: 'Diverse minds building one vision together.' },
  { icon: '⚡', title: 'Innovation', desc: 'We push limits and create what did not exist before.' },
  { icon: '🏆', title: 'Excellence', desc: 'Good enough is never enough. We iterate until it is great.' },
]

export default function About() {
  const [settings, setSettings] = useState({
    aboutDescription: 'Spectrum is a student-led electronics and engineering club dedicated to turning curiosity into creation — bridging the gap between classroom theory and real-world innovation.',
    aboutStory: 'Founded in 2024, Spectrum started as a small group of engineering students passionate about making things. Today we are a growing community across multiple technical domains, with projects deployed in the real world.',
    aboutMission: 'To foster a culture of innovation and collaboration where members can grow their technical skills, conduct meaningful research, and make impactful contributions to their field and society.',
    aboutVision: 'A club where every member becomes a builder, researcher, and leader. We envision Spectrum alumni driving technological change at the highest levels of industry and academia.'
  })

  useEffect(() => {
    api.get('/settings').then(res => {
      if (res.data?.data) {
        setSettings(prev => ({
          ...prev,
          aboutDescription: res.data.data.aboutDescription || prev.aboutDescription,
          aboutStory: res.data.data.aboutStory || prev.aboutStory,
          aboutMission: res.data.data.aboutMission || prev.aboutMission,
          aboutVision: res.data.data.aboutVision || prev.aboutVision
        }))
      }
    }).catch(console.error)
  }, [])

  return (
    <PageTransition>
      <div style={{ background: '#070b11', minHeight: '100vh' }}>

        {/* Hero */}
        <section style={{ position: 'relative', padding: '7rem 0 4rem', overflow: 'hidden' }}>
          <div className="container-main" style={{ position: 'relative', zIndex: 1 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <p style={{ color: '#06b6d4', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>About Spectrum</p>
              <h1 style={{ fontSize: 'clamp(2.2rem,5vw,3.5rem)', color: '#f1f5f9', marginBottom: '1.25rem' }}>
                Who <span className="gradient-text">We Are</span>
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '640px' }}>
                {settings.aboutDescription}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story + Mission */}
        <section style={{ padding: '4rem 0' }}>
          <div className="container-main" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '2rem' }}>
            {[
              { icon: '📖', title: 'Our Story', text: settings.aboutStory },
              { icon: '🎯', title: 'Our Mission', text: settings.aboutMission },
              { icon: '🔭', title: 'Our Vision', text: settings.aboutVision },
            ].map((item) => (
              <div key={item.title} className="card-glass" style={{ padding: '2rem', height: '100%' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{item.icon}</div>
                <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.15rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.75rem' }}>{item.title}</h3>
                <p style={{ color: '#64748b', lineHeight: 1.75, margin: 0, fontSize: '0.9rem' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Core Values */}
        <section style={{ background: '#0a0e17', padding: '5rem 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="container-main">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <p style={{ color: '#06b6d4', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>Core Values</p>
              <h2 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.25rem)', color: '#f1f5f9' }}>
                What drives <span className="gradient-text">everything we do</span>
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.5rem' }}>
              {VALUES.map((v) => (
                <div key={v.title} className="card-glass" style={{ padding: '1.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{v.icon}</div>
                  <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: '#e2e8f0', marginBottom: '0.5rem' }}>{v.title}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
