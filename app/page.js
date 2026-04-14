import Image from 'next/image'
import ExternalLink from './components/ExternalLinkModal'
import { DONATE_URL } from '@/app/lib/links'

// ─── Collage photos ───────────────────────────────────────────────────────────
// Drop images into /public and update the src values below.
// Leave src as null to keep the placeholder.
const collagePhotos = [
  { src: 'collage1.avif', alt: 'Students learning the shields' },
  { src: 'collage2.avif', alt: 'Club members at the dock' },
  { src: 'collage3.avif', alt: 'Racing on the bay' },
]

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
          src="/hero-main.jpg"
          alt="CSULB Sailing Association"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center bottom', zIndex: -1 }}
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
            <a href={DONATE_URL} data-external style={secondaryBtn}>Donate</a>
          </div>
        </div>
      </div>

      {/* About snapshot */}
      <div style={{ maxWidth: '800px', margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px', color: '#ffffff' }}>Who We Are</h2>
        <p style={{ fontSize: '18px', color: '#cce8f0', lineHeight: '1.8', marginBottom: '32px' }}>
          The CSULB Sailing Association is a student-run sailing club at California State University Long Beach.
          We welcome Long Beach students of all skill levels to join the club and get out on the water with us.
          Our student board organizes events throughout the school semester for club members to get active in sailing and fall in love with the sport.
        </p>
        <a href="/about" style={primaryBtn}>Learn More About Us</a>
      </div>

      {/* Photo collage divider */}
      <div className="collage" style={{ display: 'flex', height: '580px', gap: '4px', overflow: 'hidden' }}>
        {collagePhotos.map((photo, i) => (
          <div key={i} style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: '#1e3a5f' }}>
            {photo.src ? (
              <img src={photo.src} alt={photo.alt}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.2)', fontSize: '13px', fontStyle: 'italic',
              }}>
                [ photo {i + 1} ]
              </div>
            )}
          </div>
        ))}
      </div>

      {/* What you can do */}
      <div style={{ backgroundColor: 'rgba(0,0,0,0.25)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px', color: '#ffffff' }}>What You Can Do</h2>
            <p style={{ fontSize: '18px', color: '#cce8f0' }}>
              There&apos;s always something happening on the water.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
            {[
              { icon: '⛵', text: 'Zip around Alamitos Bay on a Laser.' },
              { icon: '🛥️', text: 'Sail out into the harbor aboard a Shields.' },
              { icon: '🌊', text: 'Take a Quest around the bay.' },
              { icon: '🏆', text: 'Compete against your fellow club members for the Weasel Cup.' },
              { icon: '🗺️', text: 'Join us in San Diego for our annual trip to Mission Bay.' },
              { icon: '🎉', text: 'Socialize with other club members at our various events!' },
            ].map(({ icon, text }, i) => (
              <div key={i} style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '12px',
              }}>
                <span style={{ fontSize: '32px', lineHeight: 1 }}>{icon}</span>
                <p style={{ fontSize: '15px', color: '#e2f4f8', margin: 0, lineHeight: '1.6' }}>{text}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <a href="/events" style={primaryBtn}>See All Events</a>
          </div>
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