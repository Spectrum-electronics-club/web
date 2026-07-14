import { useState } from 'react'
import PageTransition from '@/components/molecules/PageTransition'
import Section from '@/components/molecules/Section'
import Container from '@/components/molecules/Container'
import SectionHeader from '@/components/molecules/SectionHeader'
import Input from '@/components/atoms/Input'
import Textarea from '@/components/atoms/Textarea'
import Select from '@/components/atoms/Select'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import api from '@/utils/axiosInstance'

const YEAR_OPTIONS = [
  { value: '1', label: 'Year 1' }, { value: '2', label: 'Year 2' },
  { value: '3', label: 'Year 3' }, { value: '4', label: 'Year 4' },
  { value: '5', label: 'Year 5' },
]

function validate(f) {
  const errors = {}
  if (!f.fullName.trim()) errors.fullName = 'Name is required.'
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!f.email.trim()) errors.email = 'Email is required.'
  else if (!emailRe.test(f.email)) errors.email = 'Enter a valid email address.'
  const phoneRe = /^\+?[\d\s\-]{10,15}$/
  if (!f.phone.trim()) errors.phone = 'Phone is required.'
  else if (!phoneRe.test(f.phone)) errors.phone = 'Enter a valid phone number.'
  if (!f.department.trim()) errors.department = 'Department is required.'
  if (!f.year) errors.year = 'Year of study is required.'
  if (f.motivation.trim().length < 50) errors.motivation = 'Motivation must be at least 50 characters.'
  return errors
}

export default function JoinClub() {
  const init = { fullName: '', email: '', phone: '', department: '', year: '', motivation: '', linkedinUrl: '' }
  const [fields, setFields] = useState(init)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [apiError, setApiError] = useState(null)

  const change = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    const errs = validate(fields)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    setApiError(null)
    try {
      await api.post('/recruitment', fields)
      setSuccess(true)
    } catch (err) {
      if (err.response?.status === 409) {
        setApiError('An application from this email is already pending review.')
      } else {
        setApiError(err.response?.data?.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <Section>
        <Container narrow>
          <SectionHeader label="Join Club" title="Apply to NGND" center
            subtitle="Fill in the form below and we'll review your application." />
          {success ? (
            <Card className="p-8 text-center">
              <p className="text-2xl mb-2">🎉</p>
              <h3 className="font-heading font-semibold mb-2">Application received!</h3>
              <p className="text-neutral-500 text-sm">We'll be in touch soon.</p>
            </Card>
          ) : (
            <Card className="p-8">
              <form onSubmit={submit} noValidate className="space-y-5">
                <Input label="Full Name" required value={fields.fullName} onChange={change('fullName')} error={errors.fullName} />
                <div className="grid sm:grid-cols-2 gap-5">
                  <Input label="Email" type="email" required value={fields.email} onChange={change('email')} error={errors.email} />
                  <Input label="Phone" type="tel" required value={fields.phone} onChange={change('phone')} error={errors.phone} />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Input label="Department" required value={fields.department} onChange={change('department')} error={errors.department} />
                  <Select label="Year of Study" required options={YEAR_OPTIONS} placeholder="Select year"
                    value={fields.year} onChange={change('year')} error={errors.year} />
                </div>
                <Textarea label="Why do you want to join NGND?" required rows={5}
                  hint="Minimum 50 characters"
                  value={fields.motivation} onChange={change('motivation')} error={errors.motivation} />
                <Input label="LinkedIn URL" type="url" value={fields.linkedinUrl} onChange={change('linkedinUrl')}
                  hint="Optional" error={errors.linkedinUrl} />
                {apiError && <p role="alert" className="text-error text-sm">{apiError}</p>}
                <Button type="submit" loading={loading} className="w-full">Submit Application</Button>
              </form>
            </Card>
          )}
        </Container>
      </Section>
    </PageTransition>
  )
}
