'use client'

import { useState, useEffect } from 'react'
import CourseRegistrationModal from './CourseRegistrationModal'

const COURSE_TYPE_ORDER = ['Sailing A', 'Sailing B', 'Sailing C', 'Level 1 Keelboat', 'Other']
const COURSE_DAY_COUNT = { 'Sailing A': 2, 'Sailing B': 2, 'Sailing C': 3, 'Level 1 Keelboat': 2, 'Other': 1 }

export default function CourseSchedule({ programType, courseType }) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(null) // { courseType, sessions }
  const [openSections, setOpenSections] = useState({})
  const [waitlistOpen, setWaitlistOpen] = useState(false)
  const [waitlistForm, setWaitlistForm] = useState({ name: '', email: '', discord: '' })
  const [waitlistStatus, setWaitlistStatus] = useState('idle') // idle | submitting | success | error
  const [waitlistError, setWaitlistError] = useState('')

  useEffect(() => {
    fetch('/api/courses')
      .then(r => r.json())
      .then(data => {
        const filtered = courseType ? data.filter(s => s.courseType === courseType) : data
        setSessions(filtered)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [programType, courseType])

  const toggleSection = (type) => {
    setOpenSections(prev => ({ ...prev, [type]: !prev[type] }))
  }

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault()
    setWaitlistStatus('submitting')
    setWaitlistError('')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseType, ...waitlistForm }),
      })
      const data = await res.json()
      if (!res.ok) {
        setWaitlistError(data.error || 'Something went wrong.')
        setWaitlistStatus('error')
      } else {
        setWaitlistStatus('success')
      }
    } catch {
      setWaitlistError('Network error. Please try again.')
      setWaitlistStatus('error')
    }
  }

  const inline = Boolean(courseType)

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '16px 0', color: '#9ca3af', fontSize: '14px' }}>
        Loading sessions...
      </div>
    )
  }

  // In inline mode with no sessions: show waitlist card
  if (sessions.length === 0 && inline) {
    return (
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '0 0 12px 12px', overflow: 'hidden', marginTop: '-1px' }}>
        <div style={{ backgroundColor: '#f9fafb', padding: '16px 28px', borderBottom: waitlistOpen ? '1px solid #e5e7eb' : 'none' }}>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 10px' }}>
            No sessions are scheduled yet.
          </p>
          {!waitlistOpen && waitlistStatus !== 'success' && (
            <button
              onClick={() => setWaitlistOpen(true)}
              style={{ backgroundColor: '#1e3a5f', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 18px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
            >
              Join Waitlist
            </button>
          )}
          {waitlistStatus === 'success' && (
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#16a34a', margin: 0 }}>
              ✓ You&apos;re on the waitlist! We&apos;ll email you when sessions are added.
            </p>
          )}
        </div>

        {waitlistOpen && waitlistStatus !== 'success' && (
          <div style={{ backgroundColor: '#fff', padding: '20px 28px' }}>
            {waitlistError && (
              <p style={{ fontSize: '13px', color: '#dc2626', marginBottom: '12px' }}>{waitlistError}</p>
            )}
            <form onSubmit={handleWaitlistSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={wlLabel}>Full Name</label>
                  <input type="text" required placeholder="Jane Smith" value={waitlistForm.name}
                    onChange={e => setWaitlistForm(f => ({ ...f, name: e.target.value }))} style={wlInput} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={wlLabel}>Email</label>
                  <input type="email" required placeholder="jane@csulb.edu" value={waitlistForm.email}
                    onChange={e => setWaitlistForm(f => ({ ...f, email: e.target.value }))} style={wlInput} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={wlLabel}>Discord</label>
                  <input type="text" required placeholder="sailorjane" value={waitlistForm.discord}
                    onChange={e => setWaitlistForm(f => ({ ...f, discord: e.target.value }))} style={wlInput} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button type="submit" disabled={waitlistStatus === 'submitting'}
                  style={{ backgroundColor: '#1e3a5f', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 18px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                  {waitlistStatus === 'submitting' ? 'Submitting...' : 'Submit'}
                </button>
                <button type="button" onClick={() => setWaitlistOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '13px', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    )
  }

  if (sessions.length === 0) return null

  const courseTypes = COURSE_TYPE_ORDER.filter(t => sessions.some(s => s.courseType === t))

  return (
    <>
      <div style={{ marginBottom: inline ? '0' : '64px' }}>
        {!inline && (
          <>
            <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '8px', color: '#111827' }}>Upcoming Course Schedule</h2>
            <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '28px' }}>
              Select a course below and register directly on this page.
            </p>
          </>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {courseTypes.map(type => {
            const typeSessions = sessions.filter(s => s.courseType === type)
            const isOpen = openSections[type]
            const dayCount = COURSE_DAY_COUNT[type] || 1
            const requiredDays = Array.from({ length: dayCount }, (_, i) => i + 1)

            // Can register if every required day has at least one open session with spots
            const canRegister = requiredDays.every(d =>
              typeSessions.some(s => s.dayNumber === d && s.isOpen && (s.enrolled || 0) < s.spots)
            )

            return (
              <div key={type} style={{ border: '1px solid #e5e7eb', borderRadius: inline ? '0 0 12px 12px' : '12px', overflow: 'hidden', marginTop: inline ? '-1px' : '0' }}>
                {/* Accordion header */}
                <button
                  onClick={() => toggleSection(type)}
                  style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: inline ? '14px 28px' : '20px 28px',
                    background: isOpen ? '#1e3a5f' : '#f9fafb',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    transition: 'background 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {!inline && (
                      <span style={{ fontSize: '18px', fontWeight: '700', color: isOpen ? '#fff' : '#111827' }}>
                        {type}
                      </span>
                    )}
                    <span style={{
                      fontSize: '12px', fontWeight: '600', padding: '2px 10px', borderRadius: '999px',
                      backgroundColor: isOpen ? 'rgba(255,255,255,0.15)' : '#e5e7eb',
                      color: isOpen ? '#fff' : '#6b7280',
                    }}>
                      {typeSessions.length} session{typeSessions.length !== 1 ? 's' : ''} available
                    </span>
                  </div>
                  <span style={{ fontSize: '18px', color: isOpen ? '#fff' : '#6b7280', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
                    ▾
                  </span>
                </button>

                {/* Accordion body */}
                {isOpen && (
                  <div style={{ borderTop: '1px solid #e5e7eb', backgroundColor: '#fff' }}>
                    <div style={{ padding: '24px 28px' }}>
                      {/* Sessions grouped by day */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
                        {requiredDays.map(dayNum => {
                          const daySessions = typeSessions.filter(s => s.dayNumber === dayNum)
                          return (
                            <div key={dayNum}>
                              <p style={{ fontSize: '13px', fontWeight: '700', color: '#374151', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Day {dayNum}
                              </p>
                              {daySessions.length === 0 ? (
                                <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>No sessions scheduled yet.</p>
                              ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  {daySessions.map(s => {
                                    const spotsLeft = s.spots - (s.enrolled || 0)
                                    const full = spotsLeft <= 0
                                    return (
                                      <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                        <span style={{
                                          backgroundColor: full ? '#f3f4f6' : '#e0f2fe',
                                          color: full ? '#9ca3af' : '#0369a1',
                                          fontSize: '13px', fontWeight: '600',
                                          padding: '4px 12px', borderRadius: '6px',
                                        }}>
                                          {s.date}{s.startTime ? ` · ${s.startTime}${s.endTime ? `–${s.endTime}` : ''}` : ''}
                                        </span>
                                        <span style={{
                                          fontSize: '12px', fontWeight: '600',
                                          color: full ? '#dc2626' : spotsLeft <= 3 ? '#d97706' : '#16a34a',
                                        }}>
                                          {full ? 'Full' : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
                                        </span>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>

                      {/* Register button */}
                      <button
                        onClick={() => setRegistering({ courseType: type, sessions: typeSessions })}
                        disabled={!canRegister}
                        style={{
                          backgroundColor: canRegister ? '#ecaa00' : '#e5e7eb',
                          color: canRegister ? '#000' : '#9ca3af',
                          border: 'none', borderRadius: '6px',
                          padding: '10px 24px', fontWeight: '700',
                          fontSize: '14px', cursor: canRegister ? 'pointer' : 'default',
                        }}
                      >
                        {canRegister ? `Register for ${type}` : 'Full'}
                      </button>

                      {/* Waitlist note */}
                      {inline && waitlistStatus !== 'success' && !waitlistOpen && (
                        <div
                          onClick={() => setWaitlistOpen(true)}
                          style={{ marginTop: '12px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                          <span style={{ fontSize: '13px', color: '#1d4ed8' }}>None of these dates work for you?</span>
                          <span style={{ fontSize: '13px', fontWeight: '700', color: '#1d4ed8', textDecoration: 'underline' }}>Join the waitlist</span>
                        </div>
                      )}
                      {inline && waitlistStatus === 'success' && (
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#16a34a', margin: '12px 0 0' }}>
                          ✓ You&apos;re on the waitlist! We&apos;ll email you when new sessions are added.
                        </p>
                      )}
                      {inline && waitlistOpen && waitlistStatus !== 'success' && (
                        <div style={{ marginTop: '12px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
                          {waitlistError && <p style={{ fontSize: '13px', color: '#dc2626', marginBottom: '10px' }}>{waitlistError}</p>}
                          <form onSubmit={handleWaitlistSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                              {[
                                { key: 'name', label: 'Full Name', placeholder: 'Jane Smith', type: 'text' },
                                { key: 'email', label: 'Email', placeholder: 'jane@csulb.edu', type: 'email' },
                                { key: 'discord', label: 'Discord', placeholder: 'sailorjane', type: 'text' },
                              ].map(({ key, label, placeholder, type: t }) => (
                                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>{label}</label>
                                  <input type={t} required placeholder={placeholder} value={waitlistForm[key]}
                                    onChange={e => setWaitlistForm(f => ({ ...f, [key]: e.target.value }))}
                                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }} />
                                </div>
                              ))}
                            </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                              <button type="submit" disabled={waitlistStatus === 'submitting'}
                                style={{ backgroundColor: '#1e3a5f', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 18px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                                {waitlistStatus === 'submitting' ? 'Submitting...' : 'Submit'}
                              </button>
                              <button type="button" onClick={() => setWaitlistOpen(false)}
                                style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '13px', cursor: 'pointer' }}>
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {registering && (
        <CourseRegistrationModal
          courseType={registering.courseType}
          sessions={registering.sessions}
          onClose={() => setRegistering(null)}
        />
      )}
    </>
  )
}

const wlLabel = { fontSize: '12px', fontWeight: '600', color: '#6b7280' }
const wlInput = { padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }
