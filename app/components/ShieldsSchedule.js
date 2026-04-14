'use client'

import { useState, useEffect } from 'react'
import ShieldsRegistrationModal from './ShieldsRegistrationModal'

export default function ShieldsSchedule({ courseType }) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [waitlistOpen, setWaitlistOpen] = useState(false)
  const [waitlistForm, setWaitlistForm] = useState({ name: '', email: '' })
  const [waitlistStatus, setWaitlistStatus] = useState('idle')
  const [waitlistError, setWaitlistError] = useState('')

  const fetchSessions = () => {
    fetch('/api/shields')
      .then(r => r.json())
      .then(data => {
        const filtered = courseType ? data.filter(s => s.courseType === courseType) : data
        setSessions(filtered)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchSessions()
  }, [courseType])

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault()
    setWaitlistStatus('submitting')
    setWaitlistError('')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseType: courseType || 'Shields', ...waitlistForm }),
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '16px 0', color: '#9ca3af', fontSize: '14px' }}>
        Loading sessions...
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '0 0 12px 12px', overflow: 'hidden', marginTop: '-1px' }}>
        <div style={{ backgroundColor: '#f9fafb', padding: '16px 28px', borderBottom: waitlistOpen ? '1px solid #e5e7eb' : 'none' }}>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 10px' }}>
            No sessions are scheduled yet.
          </p>
          {!waitlistOpen && waitlistStatus !== 'success' && (
            <button
              onClick={() => setWaitlistOpen(true)}
              style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 18px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
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
            {waitlistError && <p style={{ fontSize: '13px', color: '#dc2626', marginBottom: '12px' }}>{waitlistError}</p>}
            <form onSubmit={handleWaitlistSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { key: 'name', label: 'Full Name', placeholder: 'Jane Smith', type: 'text' },
                  { key: 'email', label: 'Email', placeholder: 'jane@example.com', type: 'email' },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>{label}</label>
                    <input type={type} required placeholder={placeholder} value={waitlistForm[key]}
                      onChange={e => setWaitlistForm(f => ({ ...f, [key]: e.target.value }))}
                      style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button type="submit" disabled={waitlistStatus === 'submitting'}
                  style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 18px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
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

  return (
    <>
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '0 0 12px 12px', overflow: 'hidden', marginTop: '-1px' }}>
        {/* Accordion header */}
        <button
          onClick={() => setIsOpen(prev => !prev)}
          style={{
            width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 28px',
            background: isOpen ? '#16a34a' : '#f9fafb',
            border: 'none', cursor: 'pointer', textAlign: 'left',
            transition: 'background 0.15s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontSize: '12px', fontWeight: '600', padding: '2px 10px', borderRadius: '999px',
              backgroundColor: isOpen ? 'rgba(255,255,255,0.2)' : '#e5e7eb',
              color: isOpen ? '#fff' : '#6b7280',
            }}>
              {sessions.length} session{sessions.length !== 1 ? 's' : ''} available
            </span>
          </div>
          <span style={{ fontSize: '18px', color: isOpen ? '#fff' : '#6b7280', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
            ▾
          </span>
        </button>

        {/* Accordion body */}
        {isOpen && (
          <div style={{ borderTop: '1px solid #e5e7eb', backgroundColor: '#fff' }}>
            <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sessions.map(session => {
                const spotsLeft = session.spots - (session.enrolled || 0)
                const full = spotsLeft <= 0
                return (
                  <div key={session.id} style={{
                    border: '1px solid #e5e7eb', borderRadius: '10px',
                    padding: '20px 24px', backgroundColor: '#f9fafb',
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap',
                  }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 10px', color: '#111827' }}>
                        {session.name}
                        {full && (
                          <span style={{ marginLeft: '8px', backgroundColor: '#fef2f2', color: '#dc2626', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '999px', border: '1px solid #fecaca' }}>
                            Full
                          </span>
                        )}
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: '#374151', minWidth: '40px' }}>Day 1</span>
                          <span style={{ backgroundColor: '#dcfce7', color: '#15803d', fontSize: '13px', fontWeight: '600', padding: '3px 10px', borderRadius: '6px' }}>
                            {session.day1Date}{session.day1StartTime ? ` · ${session.day1StartTime}${session.day1EndTime ? `–${session.day1EndTime}` : ''}` : ''}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: '#374151', minWidth: '40px' }}>Day 2</span>
                          <span style={{ backgroundColor: '#dcfce7', color: '#15803d', fontSize: '13px', fontWeight: '600', padding: '3px 10px', borderRadius: '6px' }}>
                            {session.day2Date}{session.day2StartTime ? ` · ${session.day2StartTime}${session.day2EndTime ? `–${session.day2EndTime}` : ''}` : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ fontSize: '13px', margin: '0 0 10px', fontWeight: '600', color: full ? '#dc2626' : spotsLeft <= 3 ? '#d97706' : '#16a34a' }}>
                        {full ? 'No spots left' : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
                      </p>
                      <button
                        onClick={() => setSelected(session)}
                        disabled={full}
                        style={{
                          backgroundColor: full ? '#e5e7eb' : '#ecaa00',
                          color: full ? '#9ca3af' : '#000',
                          border: 'none', borderRadius: '6px',
                          padding: '8px 20px', fontWeight: '700',
                          fontSize: '13px', cursor: full ? 'default' : 'pointer',
                        }}
                      >
                        {full ? 'Full' : 'RSVP'}
                      </button>
                    </div>
                  </div>
                )
              })}

              {/* Waitlist note */}
              {waitlistStatus !== 'success' && !waitlistOpen && (
                <div
                  onClick={() => setWaitlistOpen(true)}
                  style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span style={{ fontSize: '13px', color: '#1d4ed8' }}>None of these dates work for you?</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#1d4ed8', textDecoration: 'underline' }}>Join the waitlist</span>
                </div>
              )}
              {waitlistStatus === 'success' && (
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#16a34a', margin: 0 }}>
                  ✓ You&apos;re on the waitlist! We&apos;ll email you when new sessions are added.
                </p>
              )}
              {waitlistOpen && waitlistStatus !== 'success' && (
                <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
                  {waitlistError && <p style={{ fontSize: '13px', color: '#dc2626', marginBottom: '10px' }}>{waitlistError}</p>}
                  <form onSubmit={handleWaitlistSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {[
                        { key: 'name', label: 'Full Name', placeholder: 'Jane Smith', type: 'text' },
                        { key: 'email', label: 'Email', placeholder: 'jane@example.com', type: 'email' },
                            ].map(({ key, label, placeholder, type }) => (
                        <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>{label}</label>
                          <input type={type} required placeholder={placeholder} value={waitlistForm[key]}
                            onChange={e => setWaitlistForm(f => ({ ...f, [key]: e.target.value }))}
                            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }} />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <button type="submit" disabled={waitlistStatus === 'submitting'}
                        style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 18px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
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

      {selected && (
        <ShieldsRegistrationModal
          session={selected}
          onClose={() => setSelected(null)}
          onSuccess={() => fetchSessions()}
        />
      )}
    </>
  )
}
