'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function Maintenance() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/maintenance-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        window.location.href = '/'
      } else {
        const data = await res.json()
        setError(data.error || 'Incorrect password.')
      }
    } catch {
      setError('Something went wrong. Try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#006E90',
      color: '#ffffff',
      padding: '24px',
      textAlign: 'center',
    }}>
      <Image
        src="/logo2026.png"
        alt="CSULB Sailing Association"
        width={200}
        height={303}
        style={{ marginBottom: '32px', opacity: 0.9 }}
      />
      <h1 style={{ fontSize: '36px', fontWeight: '700', margin: '0 0 16px', fontFamily: "'Farro', sans-serif" }}>
        Site Unavailable
      </h1>
      <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: '480px', lineHeight: '1.7', margin: '0 0 40px' }}>
        The CSULB Sailing Association website is temporarily unavailable.
        Check back soon!
      </p>

      {/* Password access */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%', maxWidth: '280px' }}>
        <input
          type="password"
          placeholder="Staff access password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.3)',
            backgroundColor: 'rgba(255,255,255,0.1)',
            color: '#ffffff',
            fontSize: '15px',
            outline: 'none',
            textAlign: 'center',
          }}
        />
        {error && <p style={{ fontSize: '13px', color: '#fca5a5', margin: 0 }}>{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '8px',
            padding: '10px 24px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: loading || !password ? 'default' : 'pointer',
            opacity: loading || !password ? 0.5 : 1,
            width: '100%',
          }}
        >
          {loading ? 'Checking...' : 'Access Site'}
        </button>
      </form>
    </div>
  )
}
