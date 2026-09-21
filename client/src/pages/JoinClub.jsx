import { useState } from 'react'
import { motion } from 'framer-motion'
import PageTransition from '@/components/molecules/PageTransition'
import api from '@/utils/axiosInstance'

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRe = /^\+?[\d\s\-]{10,15}$/

function validate(f) {
  const e = {}
  if (!f.fullName.trim()) e.fullName = 'Name is required.'
  if (!f.email.trim()) e.email = 'Email is required.'
  else if (!emailRe.test(f.email)) e.email = 'Enter a valid email.'
  if (!f.phone.trim()) e.phone = 'Phone is required.'
  else if (!phoneRe.test(f.phone)) e.phone = 'Enter a valid phone number.'
  if (!f.department.trim()) e.department = 'Department is required.'
  if (!f.year) e.year = 'Year is required.'
  if (f.motivation.trim().length < 50) e.motivation = 'At least 50 characters required.'
  return e
}

const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '0.35rem' }
const labelStyle = { color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }
const errStyle   = { color: '#ef4444', fontSize: '0.75rem' }

export default function JoinClub() {
  const init = { fullName: '', email: '', phone: '', department: '', year: '', motivation: '', linkedinUrl: '' }
  const [fields, setFields]   = useState(init)
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
      await api.post('/recruitment', fields)
      setSuccess(true)
    } catch (err) {
      if (err.response?.status === 409) setApiError('An application from this email is already pending.')
      else setApiError(err.response?.data?.message || 'Something went wrong.')
    } finally { setLoading(false) }
  }

  return (
    <PageTransition>
      <div style={{ background: '#070b11', minHeight: '100vh' }}>
        <section style={{ position: 'relative', padding: '7rem 0 3rem', overflow: 'hidden' }}>
          <div className="container-main" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <p style={{ color: '#06b6d4', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>Join the Club</p>
              <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', color: '#f1f5f9', marginBottom: '1rem' }}>
                Apply to <span className="gradient-text">Spectrum</span>
              </h1>
              <p style={{ color: '#94a3b8', maxWidth: '460px', margin: '0 auto', lineHeight: 1.75 }}>
                Fill in the form and we will review your application and get back to you.
              </p>
            </motion.div>
          </div>
        </section>

        <section style={{ padding: '2rem 0 6rem' }}>
          <div className="container-main" style={{ maxWidth: '680px' }}>
            {success ? (
              <div className="card-glass" style={{ padding: '3rem', textAlign: 'center' }}>
                <p style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</p>
                <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", color: '#e2e8f0', fontWeight: 700, marginBottom: '0.5rem' }}>Application received!</h3>
                <p style={{ color: '#64748b' }}>We will be in touch soon. Welcome to Spectrum!</p>
              </div>
            ) : (
              <div className="card-glass" style={{ padding: '2rem' }}>
                <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={fieldStyle}><label htmlFor="join-name" style={labelStyle}>Full Name *</label>
                    <input id="join-name" className={`input-dark${errors.fullName?' error':''}`} value={fields.fullName} onChange={ch('fullName')} placeholder="Your full name" />
                    {errors.fullName && <span style={errStyle}>{errors.fullName}</span>}</div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={fieldStyle}><label htmlFor="join-email" style={labelStyle}>Email *</label>
                      <input id="join-email" className={`input-dark${errors.email?' error':''}`} type="email" value={fields.email} onChange={ch('email')} placeholder="you@example.com" />
                      {errors.email && <span style={errStyle}>{errors.email}</span>}</div>
                    <div style={fieldStyle}><label htmlFor="join-phone" style={labelStyle}>Phone *</label>
                      <input id="join-phone" className={`input-dark${errors.phone?' error':''}`} type="tel" value={fields.phone} onChange={ch('phone')} placeholder="+91 XXXXX XXXXX" />
                      {errors.phone && <span style={errStyle}>{errors.phone}</span>}</div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={fieldStyle}><label htmlFor="join-dept" style={labelStyle}>Department *</label>
                      <input id="join-dept" className={`input-dark${errors.department?' error':''}`} value={fields.department} onChange={ch('department')} placeholder="e.g. Electronics" />
                      {errors.department && <span style={errStyle}>{errors.department}</span>}</div>
                    <div style={fieldStyle}><label htmlFor="join-year" style={labelStyle}>Year of Study *</label>
                      <select id="join-year" className={`input-dark${errors.year?' error':''}`} value={fields.year} onChange={ch('year')}>
                        <option value="">Select year</option>
                        {[1,2,3,4,5].map(y => <option key={y} value={y}>Year {y}</option>)}
                      </select>
                      {errors.year && <span style={errStyle}>{errors.year}</span>}</div>
                  </div>

                  <div style={fieldStyle}><label htmlFor="join-motivation" style={labelStyle}>Why do you want to join Spectrum? * <span style={{ color: '#4b5563', fontWeight: 400 }}>(min 50 chars)</span></label>
                    <textarea id="join-motivation" className={`input-dark${errors.motivation?' error':''}`} value={fields.motivation} onChange={ch('motivation')} rows={5} placeholder="Tell us about yourself…" style={{ resize: 'vertical' }} />
                    {errors.motivation && <span style={errStyle}>{errors.motivation}</span>}</div>

                  <div style={fieldStyle}><label htmlFor="join-linkedin" style={labelStyle}>LinkedIn URL <span style={{ color: '#4b5563', fontWeight: 400 }}>(optional)</span></label>
                    <input id="join-linkedin" className="input-dark" type="url" value={fields.linkedinUrl} onChange={ch('linkedinUrl')} placeholder="https://linkedin.com/in/…" /></div>

                  {apiError && <p role="alert" style={{ color: '#ef4444', fontSize: '0.875rem' }}>{apiError}</p>}
                  <button type="submit" className="btn-glow" disabled={loading} style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '0.8rem' }}>
                    {loading ? 'Submitting…' : 'Submit Application'}
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
