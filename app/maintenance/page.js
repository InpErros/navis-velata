import Image from 'next/image'

export const metadata = {
  title: 'Site Unavailable',
}

export default function Maintenance() {
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
        width={80}
        height={80}
        style={{ marginBottom: '32px', opacity: 0.9 }}
      />
      <h1 style={{ fontSize: '36px', fontWeight: '700', margin: '0 0 16px', fontFamily: "'Farro', sans-serif" }}>
        Be Right Back
      </h1>
      <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: '480px', lineHeight: '1.7', margin: 0 }}>
        The CSULB Sailing Association website is temporarily unavailable.
        Check back soon!
      </p>
    </div>
  )
}
