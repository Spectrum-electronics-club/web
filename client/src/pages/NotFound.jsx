import { Link } from 'react-router-dom'
import PageTransition from '@/components/molecules/PageTransition'

export default function NotFound() {
  return (
    <PageTransition>
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }} className="bg-grid">
        <div className="orb orb-cyan" style={{ width: '300px', height: '300px', top: '30%', left: '50%', transform: 'translateX(-50%)', opacity: 0.15 }} />
        <p style={{ fontSize: '7rem', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 900, background: 'linear-gradient(135deg,#06b6d4,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: '0.5rem' }}>404</p>
        <h1 style={{ color: '#e2e8f0', fontSize: '1.5rem', marginBottom: '0.75rem' }}>Page not found</h1>
        <p style={{ color: '#64748b', marginBottom: '2rem', maxWidth: '360px' }}>The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn-glow">Go back home</Link>
      </div>
    </PageTransition>
  )
}
