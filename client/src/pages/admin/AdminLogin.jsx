import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

export default function AdminLogin() {
  const { currentUser, login } = useAuth()
  const navigate = useNavigate()
  const [fields, setFields] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)

  if (currentUser) return <Navigate to="/admin/dashboard" replace />

  const change = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!fields.email.trim()) errs.email = 'Email is required.'
    if (!fields.password) errs.password = 'Password is required.'
    return errs
  }

  const submit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    setApiError(null)
    try {
      await login(fields.email, fields.password)
      navigate('/admin/dashboard', { replace: true })
    } catch {
      setApiError('Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-4">
      <Card className="w-full max-w-sm p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-heading font-bold text-on-surface mb-1">Admin Login</h1>
          <p className="text-sm text-neutral-500">NGND Club Admin Panel</p>
        </div>
        <form onSubmit={submit} noValidate className="space-y-5">
          <Input label="Email" type="email" required value={fields.email} onChange={change('email')} error={errors.email} />
          <Input label="Password" type="password" required value={fields.password} onChange={change('password')} error={errors.password} />
          {apiError && <p role="alert" className="text-error text-sm text-center">{apiError}</p>}
          <Button type="submit" loading={loading} className="w-full">Sign In</Button>
        </form>
      </Card>
    </div>
  )
}
