import Image from 'next/image'
import ExternalLink from './components/ExternalLinkModal'

export default function Home() {
  return (
    <div>

      {/* Hero */}
      <div style={{
        position: 'relative',
        height: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}>
        <Image
          src="/hero.jpg"
          alt="CSULB Sailing Association"
          fill
          style={{ objectFit: 'cover', zIndex: -1 }}
          priority
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          zIndex: 0,
        }}/>
        <div style={{ position: 'relative', zIndex: 1, color: '#fff', padding: '0 24px' }}>
          <h1 style={{ fontSize: '52px', fontWeight: '700', margin: '0 0 16px' }}>
            CSULB Sailing Association
          </h1>
          <p style={{ fontSize: '22px', marginBottom: '36px', opacity: 0.9 }}>
            We go where the wind takes us
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <a href="/learn-to-sail" style={primaryBtn}>Learn to Sail</a>
            <a href="https://commerce.cashnet.com/csulbclubsports?itemcode=LBCS-SAILASN" data-external>Donate</a>
          </div>
        </div>
      </div>

      {/* About snapshot */}
      <div style={{ maxWidth: '800px', margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px', color: '#ffffff' }}>Who We Are</h2>
        <p style={{ fontSize: '18px', color: '#cce8f0', lineHeight: '1.8', marginBottom: '32px' }}>
          The CSULB Sailing Association is a student-run sailing club at California State University Long Beach.
          We welcome sailors of all skill levels — from complete beginners to seasoned racers.
          Whether you want to learn the basics or compete at the collegiate level, there's a place for you on the water.
        </p>
        <a href="/about" style={primaryBtn}>Learn More About Us</a>
      </div>

      {/* Events preview */}
      <div style={{ backgroundColor: 'rgba(0,0,0,0.25)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px', color: '#ffffff' }}>Upcoming Events</h2>
          <p style={{ fontSize: '18px', color: '#cce8f0', marginBottom: '32px' }}>
            From casual sails to competitive regattas, there's always something happening on the water.
          </p>
          <a href="/events" style={primaryBtn}>See All Events</a>
        </div>
      </div>

    </div>
  )
}

const primaryBtn = {
  backgroundColor: '#0ea5e9',
  color: '#ffffff',
  padding: '12px 28px',
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: '600',
}

const secondaryBtn = {
  backgroundColor: 'transparent',
  color: '#ffffff',
  padding: '12px 28px',
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: '600',
  border: '2px solid #ffffff',
}