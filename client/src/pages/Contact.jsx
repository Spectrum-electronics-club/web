import { useState } from 'react'
import PageTransition from '@/components/molecules/PageTransition'
import Section from '@/components/molecules/Section'
import Container from '@/components/molecules/Container'
import SectionHeader from '@/components/molecules/SectionHeader'
import Input from '@/components/atoms/Input'
import Textarea from '@/components/atoms/Textarea'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import api from '@/utils/axiosInstance'

function validate(fields) {
  const errors = {}
  if (!fields.fullName.trim()) errors.fullName = 'Name is required.'
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!fields.email.trim()) errors.email = 'Email is required.'
  else if (!emailRe.test(fields.email)) errors.email = 'Enter a valid email address.'
  if (!fields.subject.trim()) errors.subject = 'Subject is required.'
  if (!fields.message.trim()) errors.message = 'Message is required.'
  return errors
}

export default function Contact() {
  const [fields, setFields] = useState({ fullName: '', email: '', subject: '', message: '' })
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
      await api.post('/contact', fields)
      setSuccess(true)
    } catch (err) {
      setApiError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <Section>
        <Container narrow>
          <SectionHeader label="Contact" title="Get in touch" center />
          {success ? (
            <Card className="p-8 text-center">
              <p className="text-2xl mb-2">✅</p>
              <h3 className="font-heading font-semibold mb-2">Message sent!</h3>
              <p className="text-neutral-500 text-sm">We'll get back to you as soon as possible.</p>
            </Card>
          ) : (
            <Card className="p-8">
              <form onSubmit={submit} noValidate className="space-y-5">
                <Input label="Full Name" required value={fields.fullName} onChange={change('fullName')} error={errors.fullName} />
                <Input label="Email" type="email" required value={fields.email} onChange={change('email')} error={errors.email} />
                <Input label="Subject" required value={fields.subject} onChange={change('subject')} error={errors.subject} />
                <Textarea label="Message" required rows={5} value={fields.message} onChange={change('message')} error={errors.message} />
                {apiError && <p role="alert" className="text-error text-sm">{apiError}</p>}
                <Button type="submit" loading={loading} className="w-full">Send Message</Button>
              </form>
            </Card>
          )}
        </Container>
      </Section>
    </PageTransition>
  )
}
