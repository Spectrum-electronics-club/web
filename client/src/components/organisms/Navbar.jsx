import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import api from '@/utils/axiosInstance'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Events & Competitions' },
  { to: '/projects', label: 'Projects' },
  { to: '/team', label: 'Team' },
  { to: '/gallery', label: 'Photo Gallery' },
  { to: '/about', label: 'About Us' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [logo1, setLogo1] = useState(localStorage.getItem('spectrum_logo1') || '')
  const [logo2, setLogo2] = useState(localStorage.getItem('spectrum_logo2') || '')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)

    api.get('/settings').then(res => {
      const l1 = res.data?.data?.logo1Url || ''
      const l2 = res.data?.data?.logo2Url || ''
      setLogo1(l1)
      setLogo2(l2)
      if (l1) localStorage.setItem('spectrum_logo1', l1)
      if (l2) localStorage.setItem('spectrum_logo2', l2)
    }).catch(err => console.error('Failed to load logos', err))

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        transition: 'all 0.3s',
        background: scrolled
          ? 'rgba(7,11,17,0.95)'
          : 'rgba(7,11,17,0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled
          ? '1px solid rgba(0,212,255,0.15)'
          : '1px solid transparent',
      }}
    >
      <nav className="container-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {/* Logo 1 */}
            {logo1 && (
              <img src={logo1} alt="Logo 1" style={{ height: '44px', width: 'auto', maxWidth: '160px', borderRadius: '8px', objectFit: 'contain' }} />
            )}

            {/* Logo 2 */}
            {logo2 && (
              <img src={logo2} alt="Logo 2" style={{ height: '44px', width: 'auto', maxWidth: '160px', borderRadius: '8px', objectFit: 'contain' }} />
            )}
          </div>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800, fontSize: '1.25rem', letterSpacing: '0.05em',
            background: 'linear-gradient(135deg,#fff,#06b6d4)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>SPECTRUM</span>
        </Link>

        {/* Desktop nav */}
        <ul style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', listStyle: 'none', margin: 0, padding: 0 }}
          className="hidden-mobile">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                style={({ isActive }) => ({
                  padding: '0.45rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  color: isActive ? '#22d3ee' : '#94a3b8',
                  background: isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
                })}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="menu-btn"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#94a3b8', padding: '0.4rem',
            }}
          >
            {menuOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'rgba(7,11,17,0.98)',
          borderTop: '1px solid rgba(0,212,255,0.12)',
          padding: '1rem 0',
        }}>
          <ul className="container-main" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMenuOpen(false)}
                  style={({ isActive }) => ({
                    display: 'block', padding: '0.65rem 0.75rem',
                    borderRadius: '10px', fontSize: '0.95rem', fontWeight: 500,
                    textDecoration: 'none',
                    color: isActive ? '#22d3ee' : '#94a3b8',
                    background: isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
                  })}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}

          </ul>
        </div>
      )}

      <style>{`
        @media (min-width: 900px) { .menu-btn { display: none; } }
        @media (max-width: 899px) { .hidden-mobile { display: none !important; } }
      `}</style>
    </header>
  )
}
