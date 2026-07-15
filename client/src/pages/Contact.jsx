import { useState } from 'react'
import { motion } from 'framer-motion'
import PageTransition from '@/components/molecules/PageTransition'
import api from '@/utils/axiosInstance'

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(f) {
  const e = {}
  if (!f.fullName.trim()) e.fullName = 'Name is required.'
  if (!f.email.trim())    e.email    = 'Email is required.'
  else if (!emailRe.test(f.email)) e.email = 'Enter a valid email.'
  if (!f.subject.trim()) e.subject  = 'Subject is required.'
  if (!f.message.trim()) e.message  = 'Message is required.'
  return e
}

const fieldStyle = { display:'flex', flexDirection:'column', gap:'0.35rem' }
const labelStyle = { color:'#94a3b8', fontSize:'0.85rem', fontWeight:600 }
const errStyle   = { color:'#ef4444', fontSize:'0.75rem', marginTop:'0.15rem' }

export default function Contact() {
  const [fields, setFields]   = useState({ fullName:'', email:'', subject:'', message:'' })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [apiError, setApiError] = useState(null)

  const ch = k => e => setFields(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    const errs = validate(fields)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({}); setLoading(true); setApiError(null)
    try {
      await api.post('/contact', fields)
      setSuccess(true)
    } catch (err) {
      setApiError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <PageTransition>
      <div style={{ background:'#070b11', minHeight:'100vh' }}>
        <section style={{ position:'relative', padding:'7rem 0 3rem', overflow:'hidden' }} className="bg-grid">
          <div className="orb orb-cyan" style={{ width:'350px', height:'350px', top:'-60px', left:'10%', opacity:0.2 }} />
          <div className="container-main" style={{ position:'relative', zIndex:1, textAlign:'center' }}>
            <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
              <div className="section-label" style={{ margin:'0 auto 1rem' }}>Get In Touch</div>
              <h1 style={{ fontSize:'clamp(2rem,5vw,3rem)', color:'#f1f5f9' }}>
                Contact <span className="gradient-text">Us</span>
              </h1>
            </motion.div>
          </div>
        </section>

        <section style={{ padding:'2rem 0 6rem' }}>
          <div className="container-main" style={{ maxWidth:'640px' }}>
            {success ? (
              <div className="card-glass" style={{ padding:'3rem', textAlign:'center' }}>
                <p style={{ fontSize:'3rem', marginBottom:'0.5rem' }}>✅</p>
                <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", color:'#e2e8f0', fontWeight:700, marginBottom:'0.5rem' }}>Message sent!</h3>
                <p style={{ color:'#64748b' }}>We will get back to you as soon as possible.</p>
              </div>
            ) : (
              <div className="card-glass" style={{ padding:'2rem' }}>
                <form onSubmit={submit} noValidate style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Full Name *</label>
                    <input className={`input-dark${errors.fullName?' error':''}`} value={fields.fullName} onChange={ch('fullName')} placeholder="Your name" />
                    {errors.fullName && <span style={errStyle}>{errors.fullName}</span>}
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Email *</label>
                    <input className={`input-dark${errors.email?' error':''}`} type="email" value={fields.email} onChange={ch('email')} placeholder="you@example.com" />
                    {errors.email && <span style={errStyle}>{errors.email}</span>}
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Subject *</label>
                    <input className={`input-dark${errors.subject?' error':''}`} value={fields.subject} onChange={ch('subject')} placeholder="What is this about?" />
                    {errors.subject && <span style={errStyle}>{errors.subject}</span>}
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Message *</label>
                    <textarea className={`input-dark${errors.message?' error':''}`} value={fields.message} onChange={ch('message')} rows={5} placeholder="Your message…" style={{ resize:'vertical' }} />
                    {errors.message && <span style={errStyle}>{errors.message}</span>}
                  </div>
                  {apiError && <p role="alert" style={{ color:'#ef4444', fontSize:'0.875rem' }}>{apiError}</p>}
                  <button type="submit" className="btn-glow" disabled={loading} style={{ width:'100%', justifyContent:'center', fontSize:'1rem', padding:'0.8rem' }}>
                    {loading ? 'Sending…' : 'Send Message ✉️'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
