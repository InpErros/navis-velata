import PageHero from '../components/PageHero'
import { DISCORD_URL, INSTAGRAM_URL, FACEBOOK_URL, MAPS_URL, MAPS_EMBED_URL } from '@/app/lib/links'

export default function Contact() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '64px 24px' }}>
      <div className="page-card" style={{ backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', color: '#111827' }}>

        <PageHero title="Contact Us" imageSrc='/hero-contact.avif'/>

        <div className="page-content">

        {/* Social cards */}
        <div className="grid-2col" style={{ marginBottom: '48px', gridTemplateColumns: 'repeat(3, 1fr)' }}>

          {/* Discord */}
          <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#f5f3ff',
              border: '1px solid #ddd6fe',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center',
              height: '100%',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#5865F2">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.033.055a19.909 19.909 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 8px', color: '#111827' }}>Discord</h2>
              <p style={{ fontSize: '15px', color: '#6b7280', margin: '0 0 24px', lineHeight: '1.7' }}>
                Chat with members, get announcements, and ask questions.
              </p>
              <span style={{ backgroundColor: '#5865F2', color: '#ffffff', padding: '10px 24px', borderRadius: '6px', fontSize: '15px', fontWeight: '600' }}>
                Join our Discord
              </span>
            </div>
          </a>

          {/* Instagram */}
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center',
              height: '100%',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="#E1306C" stroke="none"/>
                </svg>
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 8px', color: '#111827' }}>Instagram</h2>
              <p style={{ fontSize: '15px', color: '#6b7280', margin: '0 0 24px', lineHeight: '1.7' }}>
                Follow us for photos, event updates, and life on the water.
              </p>
              <span style={{ backgroundColor: '#E1306C', color: '#ffffff', padding: '10px 24px', borderRadius: '6px', fontSize: '15px', fontWeight: '600' }}>
                Follow us
              </span>
            </div>
          </a>

          {/* Facebook */}
          <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center',
              height: '100%',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 8px', color: '#111827' }}>Facebook</h2>
              <p style={{ fontSize: '15px', color: '#6b7280', margin: '0 0 24px', lineHeight: '1.7' }}>
                Follow our page if instagram isn't your thing.
              </p>
              <span style={{ backgroundColor: '#1877F2', color: '#ffffff', padding: '10px 24px', borderRadius: '6px', fontSize: '15px', fontWeight: '600' }}>
                Follow us
              </span>
            </div>
          </a>

        </div>

        {/* Location */}
        <div style={{
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '40px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#006E90" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0, color: '#111827' }}>Where to Find Us</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
              <p style={{ fontSize: '16px', color: '#374151', margin: 0, fontWeight: '600' }}>
                Leeway Sailing & Aquatics Center
              </p>
              <p style={{ fontSize: '16px', color: '#6b7280', margin: '0 0 24px' }}>
                5437 E Ocean Blvd, Long Beach, CA 90803
              </p>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-external
                style={{
                  backgroundColor: '#ecaa00',
                  color: '#000000',
                  padding: '10px 24px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: '700',
                  display: 'inline-block',
                }}>
                Get Directions
              </a>
            </div>

            <div style={{
              height: '220px',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '1px solid #e5e7eb',
            }}>
              <iframe
                src={MAPS_EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 'none', display: 'block' }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
        </div>{/* end padding */}
      </div>{/* end page-card */}
    </div>
  )
}