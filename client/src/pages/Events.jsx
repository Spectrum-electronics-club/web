import { useEffect, useState } from 'react'
import PageTransition from '@/components/molecules/PageTransition'
import Section from '@/components/molecules/Section'
import Container from '@/components/molecules/Container'
import SectionHeader from '@/components/molecules/SectionHeader'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Modal from '@/components/atoms/Modal'
import { SkeletonCard } from '@/components/atoms/Skeleton'
import api from '@/utils/axiosInstance'

function Countdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({})

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate) - Date.now()
      if (diff <= 0) return setTimeLeft({ expired: true })
      setTimeLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  if (timeLeft.expired) return <span className="text-xs text-neutral-400">Event started</span>

  return (
    <div className="flex gap-2 text-center">
      {['days', 'hours', 'minutes', 'seconds'].map((unit) => (
        <div key={unit} className="bg-primary-50 dark:bg-primary-950 rounded-lg px-2 py-1 min-w-[44px]">
          <div className="text-lg font-heading font-bold text-primary-600">{timeLeft[unit] ?? 0}</div>
          <div className="text-[10px] uppercase text-neutral-500">{unit}</div>
        </div>
      ))}
    </div>
  )
}

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSpeaker, setSelectedSpeaker] = useState(null)

  useEffect(() => {
    api.get('/events')
      .then((r) => setEvents(r.data.data || r.data))
      .catch(() => setError('Failed to load events.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageTransition>
      <Section>
        <Container>
          <SectionHeader label="Events" title="What's happening" />

          {loading && (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {error && <p className="text-error">{error}</p>}

          {!loading && !error && events.length === 0 && (
            <p className="text-neutral-500 text-center py-16">No events found.</p>
          )}

          {!loading && !error && (
            <div className="space-y-8">
              {events.map((ev) => (
                <Card key={ev._id} className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {ev.isUpcoming && (
                          <span className="px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold">
                            Upcoming
                          </span>
                        )}
                        <h3 className="text-lg font-heading font-semibold">{ev.title}</h3>
                      </div>
                      <p className="text-neutral-500 text-sm mb-4">{ev.description}</p>

                      {/* Schedule */}
                      {ev.schedule?.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2">Schedule</h4>
                          <ul className="space-y-1">
                            {ev.schedule.map((s, i) => (
                              <li key={i} className="text-sm flex gap-3">
                                <span className="text-neutral-400 shrink-0">{s.date} {s.time}</span>
                                <span>{s.activity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Speakers */}
                      {ev.speakers?.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2">Speakers</h4>
                          <div className="flex flex-wrap gap-2">
                            {ev.speakers.map((sp, i) => (
                              <button
                                key={i}
                                onClick={() => setSelectedSpeaker(sp)}
                                className="text-sm text-primary-600 hover:underline"
                              >
                                {sp.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {ev.registrationUrl && (
                        <a href={ev.registrationUrl} target="_blank" rel="noopener noreferrer">
                          <Button size="sm">Register</Button>
                        </a>
                      )}
                    </div>

                    {ev.isUpcoming && ev.schedule?.[0]?.date && (
                      <div className="shrink-0">
                        <Countdown targetDate={ev.schedule[0].date} />
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </Section>

      <Modal
        open={!!selectedSpeaker}
        onClose={() => setSelectedSpeaker(null)}
        title="Speaker"
      >
        {selectedSpeaker && (
          <div className="flex gap-4">
            {selectedSpeaker.photo && (
              <img src={selectedSpeaker.photo} alt={selectedSpeaker.name} className="w-16 h-16 rounded-full object-cover shrink-0" />
            )}
            <div>
              <h3 className="font-heading font-semibold text-on-surface mb-1">{selectedSpeaker.name}</h3>
              <p className="text-sm text-neutral-500">{selectedSpeaker.bio}</p>
            </div>
          </div>
        )}
      </Modal>
    </PageTransition>
  )
}
