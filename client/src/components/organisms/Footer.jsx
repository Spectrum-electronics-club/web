import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaGithub, FaLinkedin, FaInstagram, FaYoutube, FaEnvelope } from 'react-icons/fa'
import api from '@/utils/axiosInstance'

const navGroups = {
  'Quick Links': [
    { to: '/',             label: 'Home' },
    { to: '/events',       label: 'Events & Competitions' },
    { to: '/projects',     label: 'Projects' },
    { to: '/team',         label: 'Team' },
    { to: '/gallery',      label: 'Photo Gallery' },
    { to: '/about',        label: 'About Us' },
  ],
  'Get Involved': [

    { to: '/contact',      label: 'Contact Us' },
    { to: '/publications', label: 'Publications' },
    { to: '/competitions', label: 'Competitions' },
  ],
}

// No longer hardcoded socials. We build them dynamically in the component.

export default function Footer() {
  const [logo1, setLogo1] = useState('')
  const [logo2, setLogo2] = useState('')
  const [contactEmail, setContactEmail] = useState('ngnd@club.edu')
  const [contactLocation, setContactLocation] = useState('Engineering Department, Lab-7')
  const [contactSocial, setContactSocial] = useState('@ngnd_club')
  
  const [socialInstagram, setSocialInstagram] = useState('')
  const [socialLinkedin, setSocialLinkedin] = useState('')
  const [socialYoutube, setSocialYoutube] = useState('')
  const [socialGithub, setSocialGithub] = useState('')

  useEffect(() => {
    api.get('/settings').then(res => {
      const data = res.data?.data
      if (data) {
        setLogo1(data.logo1Url || '')
        setLogo2(data.logo2Url || '')
        if (data.contactEmail) setContactEmail(data.contactEmail)
        if (data.contactLocation) setContactLocation(data.contactLocation)
        if (data.contactSocial) setContactSocial(data.contactSocial)
        
        if (data.socialInstagram) setSocialInstagram(data.socialInstagram)
        if (data.socialLinkedin) setSocialLinkedin(data.socialLinkedin)
        if (data.socialYoutube) setSocialYoutube(data.socialYoutube)
        if (data.socialGithub) setSocialGithub(data.socialGithub)
      }
    }).catch(err => console.error('Failed to load logos', err))
  }, [])

  return (
    <footer style={{
      background: '#030712',
      borderTop: '1px solid rgba(0,212,255,0.1)',
      paddingTop: '4rem',
      paddingBottom: '2rem',
    }}>
      <div className="container-main">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 2 / span 2' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {/* Logo 1 */}
                {logo1 ? (
                  <img src={logo1} alt="Logo 1" style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'contain' }} />
                ) : (
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: 'rgba(0,212,255,0.1)', border: '1px dashed rgba(0,212,255,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#22d3ee', fontSize: '0.65rem', fontWeight: 700
                  }}>L1</div>
                )}
                
                {/* Logo 2 */}
                {logo2 ? (
                  <img src={logo2} alt="Logo 2" style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'contain' }} />
                ) : (
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: 'rgba(139,92,246,0.1)', border: '1px dashed rgba(139,92,246,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#a78bfa', fontSize: '0.65rem', fontWeight: 700
                  }}>L2</div>
                )}
              </div>
              <span style={{
                fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: '1.4rem', letterSpacing: '0.05em',
                background: 'linear-gradient(135deg,#fff,#06b6d4)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>SPECTRUM</span>
            </Link>
            <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: '22rem', marginBottom: '1.25rem' }}>
              A student-led engineering and research club dedicated to bridging the gap
              between theory and real-world innovation.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { Icon: FaInstagram, href: socialInstagram || '#', label: 'Instagram' },
                { Icon: FaLinkedin,  href: socialLinkedin || '#', label: 'LinkedIn' },
                { Icon: FaYoutube,   href: socialYoutube || '#', label: 'YouTube' },
                { Icon: FaGithub,    href: socialGithub || '#', label: 'GitHub' },
                { Icon: FaEnvelope,  href: contactEmail ? `mailto:${contactEmail}` : '#', label: 'Email' },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                  style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)',
                    color: '#64748b', transition: 'all 0.2s', textDecoration: 'none',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color='#22d3ee'; e.currentTarget.style.borderColor='rgba(0,212,255,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color='#64748b'; e.currentTarget.style.borderColor='rgba(0,212,255,0.12)'; }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav groups */}
          {Object.entries(navGroups).map(([group, links]) => (
            <div key={group}>
              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#22d3ee', marginBottom: '1rem' }}>
                {group}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} style={{ color: '#64748b', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color='#e2e8f0'}
                      onMouseLeave={e => e.currentTarget.style.color='#64748b'}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#22d3ee', marginBottom: '1rem' }}>
              Contact
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { icon: '📧', text: contactEmail },
                { icon: '📍', text: contactLocation },
                { icon: '📱', text: contactSocial },
              ].map(({ icon, text }) => (
                <p key={text} style={{ color: '#64748b', fontSize: '0.8rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start', margin: 0 }}>
                  <span>{icon}</span> {text}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(0,212,255,0.08)',
          paddingTop: '1.5rem',
          display: 'flex', flexWrap: 'wrap', gap: '0.75rem',
          justifyContent: 'space-between', alignItems: 'center',
        }}>
          <p style={{ color: '#374151', fontSize: '0.8rem', margin: 0 }}>
            © {new Date().getFullYear()} SPECTRUM Club. All rights reserved.
          </p>
          <p style={{ color: '#374151', fontSize: '0.8rem', margin: 0 }}>
            Made with ❤️ by Team SPECTRUM
          </p>
        </div>
      </div>
    </footer>
  )
}
