import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const fl = { display:'flex', flexDirection:'column', gap:'0.35rem' }
const lb = { color:'#94a3b8', fontSize:'0.85rem', fontWeight:600 }
const er = { color:'#ef4444', fontSize:'0.75rem' }

export default function AdminLogin() {
  const { currentUser, login } = useAuth()
  const navigate = useNavigate()
  const [fields, setFields]   = useState({ email:'', password:'' })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)

  if (currentUser) return <Navigate to="/admin/dashboard" replace />

  const ch = k => e => setFields(f => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!fields.email.trim()) e.email = 'Email is required.'
    if (!fields.password)     e.password = 'Password is required.'
    return e
  }

  const submit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({}); setLoading(true); setApiError(null)
    try {
      await login(fields.email, fields.password)
      navigate('/admin/dashboard', { replace:true })
    } catch {
      setApiError('Invalid credentials.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#070b11', padding:'1rem' }} className="bg-grid">
      <div className="orb orb-cyan" style={{ width:'300px', height:'300px', top:'30%', left:'50%', transform:'translateX(-50%)', opacity:0.15 }} />
      <div className="card-glass" style={{ width:'100%', maxWidth:'400px', padding:'2.5rem', position:'relative', zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{
            width:'52px', height:'52px', borderRadius:'14px', margin:'0 auto 1rem',
            background:'linear-gradient(135deg,#0891b2,#7c3aed)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:'1.3rem', color:'white',
          }}>N</div>
          <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, color:'#e2e8f0', fontSize:'1.4rem', margin:'0 0 0.35rem' }}>Admin Login</h1>
          <p style={{ color:'#64748b', fontSize:'0.875rem', margin:0 }}>Spectrum Club Admin Panel</p>
        </div>
        <form onSubmit={submit} noValidate style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          <div style={fl}>
            <label style={lb}>Email</label>
            <input className={`input-dark${errors.email?' error':''}`} type="email" value={fields.email} onChange={ch('email')} placeholder="admin@ngnd.club" autoComplete="email" />
            {errors.email && <span style={er}>{errors.email}</span>}
          </div>
          <div style={fl}>
            <label style={lb}>Password</label>
            <input className={`input-dark${errors.password?' error':''}`} type="password" value={fields.password} onChange={ch('password')} placeholder="••••••••" autoComplete="current-password" />
            {errors.password && <span style={er}>{errors.password}</span>}
          </div>
          {apiError && <p role="alert" style={{ color:'#ef4444', fontSize:'0.85rem', textAlign:'center', margin:0 }}>{apiError}</p>}
          <button type="submit" className="btn-glow" disabled={loading} style={{ width:'100%', justifyContent:'center', fontSize:'1rem', padding:'0.75rem' }}>
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>
      </div>
    </div>
  )
}
