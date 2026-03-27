'use client'

import { useState } from 'react'

export default function ShieldsRegistrationModal({ session, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', discord: '' })
  const [receipt, setReceipt] = useState(null)
  const [receiptError, setReceiptError] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const allowed = ['image/jpeg', 'image/png', 'application/pdf']
    if (!allowed.includes(file.type)) {
      setReceiptError('File must be a JPG, PNG, or PDF.')
      setReceipt(null)
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setReceiptError('File must be under 10 MB.')
      setReceipt(null)
      return
    }
    setReceiptError('')
    setReceipt(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!receipt) {
      setReceiptError('Please attach your payment receipt.')
      return
    }
    setStatus('submitting')
    const fd = new FormData()
    fd.append('sessionId', session.id)
    fd.append('name', form.name)
    fd.append('email', form.email)
    fd.append('discord', form.discord)
    fd.append('receipt', receipt)

    try {
      const res = await fetch('/api/shields/register', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
        setStatus('error')
      } else {
        if (data.emailError) console.warn('Email failed:', data.emailError)
        setStatus('success')
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.')
      setStatus('error')
    }
  }

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px', zIndex: 1000,
      }}
    >
      <div style={{
        backgroundColor: '#fff', borderRadius: '16px', padding: '40px',
        width: '100%', maxWidth: '500px', position: 'relative',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '20px', lineHeight: 1 }}
          aria-label="Close"
        >
          ✕
        </button>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px', color: '#111827' }}>You&apos;re registered!</h2>
            <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.7', marginBottom: '16px' }}>
              We received your registration for <strong>{session.name}</strong>.
            </p>
            <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', textAlign: 'left' }}>
              <p style={{ fontSize: '14px', color: '#0369a1', margin: '0 0 4px', fontWeight: '600' }}>
                Day 1: {session.day1Date}{session.day1StartTime ? ` · ${session.day1StartTime}${session.day1EndTime ? `–${session.day1EndTime}` : ''}` : ''}
              </p>
              <p style={{ fontSize: '14px', color: '#0369a1', margin: 0, fontWeight: '600' }}>
                Day 2: {session.day2Date}{session.day2StartTime ? ` · ${session.day2StartTime}${session.day2EndTime ? `–${session.day2EndTime}` : ''}` : ''}
              </p>
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '32px' }}>
              An officer will follow up with you on Discord to confirm your spot.
            </p>
            <button onClick={onClose} style={primaryBtn}>Close</button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '24px' }}>
              <span style={{
                backgroundColor: '#16a34a', color: '#fff',
                fontSize: '11px', fontWeight: '700', padding: '3px 10px',
                borderRadius: '999px', display: 'inline-block', marginBottom: '10px',
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                Shields Course
              </span>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: '0 0 8px' }}>{session.name}</h2>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                <p style={{ margin: '0 0 2px' }}>Day 1: {session.day1Date}{session.day1StartTime ? ` · ${session.day1StartTime}${session.day1EndTime ? `–${session.day1EndTime}` : ''}` : ''}</p>
                <p style={{ margin: 0 }}>Day 2: {session.day2Date}{session.day2StartTime ? ` · ${session.day2StartTime}${session.day2EndTime ? `–${session.day2EndTime}` : ''}` : ''}</p>
              </div>
            </div>

            {/* Payment note */}
            <div style={{ backgroundColor: '#fefce8', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', fontSize: '13px', color: '#92400e', lineHeight: '1.6' }}>
              <strong>Before registering:</strong> Complete your payment via CashNet, then upload your receipt below.
              <div style={{ marginTop: '10px' }}>
                <a
                  href="https://commerce.cashnet.com/csulbclubsports?itemcode=LBCS-SAILASN"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-block', backgroundColor: '#ecaa00', color: '#000', padding: '8px 16px', borderRadius: '6px', fontWeight: '700', fontSize: '13px', textDecoration: 'none' }}
                >
                  Pay on CashNet →
                </a>
              </div>
            </div>

            {status === 'error' && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px', color: '#dc2626' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={fieldWrap}>
                <label style={fieldLabel}>Full Name</label>
                <input type="text" required placeholder="Jane Smith"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  style={inputStyle} />
              </div>
              <div style={fieldWrap}>
                <label style={fieldLabel}>Email</label>
                <input type="email" required placeholder="jane@csulb.edu"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  style={inputStyle} />
              </div>
              <div style={fieldWrap}>
                <label style={fieldLabel}>Discord Username</label>
                <input type="text" required placeholder="e.g. sailorjane"
                  value={form.discord} onChange={e => setForm({ ...form, discord: e.target.value })}
                  style={inputStyle} />
              </div>
              <div style={fieldWrap}>
                <label style={fieldLabel}>Payment Receipt (JPG, PNG, or PDF)</label>
                <input type="file" accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                  style={{ fontSize: '14px', color: '#374151' }} />
                {receiptError && <p style={{ color: '#dc2626', fontSize: '13px', margin: '4px 0 0' }}>{receiptError}</p>}
                {receipt && !receiptError && <p style={{ color: '#16a34a', fontSize: '13px', margin: '4px 0 0' }}>{receipt.name}</p>}
              </div>
              <button type="submit" disabled={status === 'submitting'} style={{ ...primaryBtn, width: '100%', marginTop: '8px' }}>
                {status === 'submitting' ? 'Submitting...' : 'Submit Registration'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

const fieldWrap = { display: 'flex', flexDirection: 'column', gap: '6px' }
const fieldLabel = { fontSize: '13px', fontWeight: '600', color: '#6b7280' }
const inputStyle = { padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '15px' }
const primaryBtn = { backgroundColor: '#ecaa00', color: '#000', padding: '12px 24px', borderRadius: '6px', fontWeight: '700', fontSize: '15px', border: 'none', cursor: 'pointer' }
