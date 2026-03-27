'use client'

import { useState, useEffect } from 'react'
import ShieldsRegistrationModal from './ShieldsRegistrationModal'

export default function ShieldsSchedule() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [waitlistOpen, setWaitlistOpen] = useState(false)
  const [waitlistForm, setWaitlistForm] = useState({ name: '', email: '', discord: '' })
  const [waitlistStatus, setWaitlistStatus] = useState('idle')
  const [waitlistError, setWaitlistError] = useState('')

  useEffect(() => {
    fetch('/api/shields')
      .then(r => r.json())
      .then(data => { setSessions(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault()
    setWaitlistStatus('submitting')
    setWaitlistError('')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseType: 'Shields', ...waitlistForm }),
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
    return <div style={{ textAlign: 'center', padding: '32px 0', color: '#9ca3af', fontSize: '15px' }}>Loading sessions...</div>
  }

  if (sessions.length === 0) {
    return (
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ backgroundColor: '#f9fafb', padding: '24px 28px', borderBottom: waitlistOpen ? '1px solid #e5e7eb' : 'none' }}>
          <p style={{ fontSize: '15px', color: '#6b7280', margin: '0 0 12px' }}>
            No sessions are currently scheduled.
          </p>
          {!waitlistOpen && waitlistStatus !== 'success' && (
            <button
              onClick={() => setWaitlistOpen(true)}
              style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px 20px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
            >
              Join Waitlist
            </button>
          )}
          {waitlistStatus === 'success' && (
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#16a34a', margin: 0 }}>
              ✓ You&apos;re on the waitlist! We&apos;ll email you when sessions open up.
            </p>
          )}
        </div>
        {waitlistOpen && waitlistStatus !== 'success' && (
          <div style={{ backgroundColor: '#fff', padding: '24px 28px' }}>
            {waitlistError && <p style={{ fontSize: '13px', color: '#dc2626', marginBottom: '12px' }}>{waitlistError}</p>}
            <form onSubmit={handleWaitlistSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                {[
                  { key: 'name', label: 'Full Name', placeholder: 'Jane Smith', type: 'text' },
                  { key: 'email', label: 'Email', placeholder: 'jane@example.com', type: 'email' },
                  { key: 'discord', label: 'Discord', placeholder: 'sailorjane', type: 'text' },
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
                  style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', padding: '9px 20px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {sessions.map(session => {
          const spotsLeft = session.spots - (session.enrolled || 0)
          const full = spotsLeft <= 0
          return (
            <div key={session.id} style={{
              border: '1px solid #e5e7eb', borderRadius: '12px',
              padding: '28px 32px', backgroundColor: '#f9fafb',
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: '#111827' }}>{session.name}</h3>
                  {full && (
                    <span style={{ backgroundColor: '#fef2f2', color: '#dc2626', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '999px', border: '1px solid #fecaca' }}>
                      Full
                    </span>
                  )}
                </div>
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
                <p style={{ fontSize: '13px', margin: '0 0 12px', fontWeight: '600', color: full ? '#dc2626' : spotsLeft <= 3 ? '#d97706' : '#16a34a' }}>
                  {full ? 'No spots left' : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
                </p>
                <button
                  onClick={() => setSelected(session)}
                  disabled={full}
                  style={{
                    backgroundColor: full ? '#e5e7eb' : '#16a34a',
                    color: full ? '#9ca3af' : '#fff',
                    border: 'none', borderRadius: '6px',
                    padding: '10px 22px', fontWeight: '700',
                    fontSize: '14px', cursor: full ? 'default' : 'pointer',
                  }}
                >
                  {full ? 'Full' : 'Register'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {selected && (
        <ShieldsRegistrationModal
          session={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
