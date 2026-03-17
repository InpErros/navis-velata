export default function Contact() {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px 80px' }}>
        <div className="page-card"
          style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '48px',
          color: '#111827',
        }}>
  
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '700', marginBottom: '16px' }}>Contact Us</h1>
          <p style={{ fontSize: '18px', color: '#6b7280', lineHeight: '1.8', maxWidth: '600px', margin: '0 auto' }}>
            The best way to get in touch with us is through our Discord or Instagram.
            We'd love to hear from you!
          </p>
        </div>
  
        {/* Social cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', marginBottom: '64px' }}>
  
          {/* Discord */}
          <a href="https://discord.gg/DYuD3Zs4JE" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#f5f3ff',
              border: '1px solid #ddd6fe',
              borderRadius: '12px',
              padding: '40px 32px',
              textAlign: 'center',
              cursor: 'pointer',
            }}>
              <p style={{ fontSize: '36px', margin: '0 0 16px' }}>💬</p>
              <h2 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 8px', color: '#111827' }}>Discord</h2>
              <p style={{ fontSize: '15px', color: '#6b7280', margin: '0 0 20px', lineHeight: '1.7' }}>
                Join our Discord server to chat with members, get announcements, and ask questions.
              </p>
              <span style={{
                backgroundColor: '#7c3aed',
                color: '#ffffff',
                padding: '10px 24px',
                borderRadius: '6px',
                fontSize: '15px',
                fontWeight: '600',
              }}>
                Join our Discord
              </span>
            </div>
          </a>
  
          {/* Instagram */}
          <a href="https://www.instagram.com/sailcsulb/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: '12px',
              padding: '40px 32px',
              textAlign: 'center',
              cursor: 'pointer',
            }}>
              <p style={{ fontSize: '36px', margin: '0 0 16px' }}>📸</p>
              <h2 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 8px', color: '#111827' }}>Instagram</h2>
              <p style={{ fontSize: '15px', color: '#6b7280', margin: '0 0 20px', lineHeight: '1.7' }}>
                Follow us on Instagram for photos, event updates, and a glimpse of life on the water.
              </p>
              <span style={{
                backgroundColor: '#e11d48',
                color: '#ffffff',
                padding: '10px 24px',
                borderRadius: '6px',
                fontSize: '15px',
                fontWeight: '600',
              }}>
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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '32px',
          flexWrap: 'wrap',
        }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 16px', color: '#111827' }}>Where to Find Us</h2>
            <p style={{ fontSize: '16px', color: '#374151', margin: '0 0 4px', fontWeight: '600' }}>
              Leeway Sailing & Aquatics Center
            </p>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: '0 0 24px' }}>
              5437 E Ocean Blvd, Long Beach, CA 90803
            </p>
            <a
              href="https://maps.google.com/?q=5437+E+Ocean+Blvd,+Long+Beach,+CA+90803"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#0ea5e9',
                color: '#ffffff',
                padding: '10px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: '600',
              }}>
              Get Directions
            </a>
          </div>
          <div style={{
            width: '100%',
            maxWidth: '400px',
            height: '220px',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
          }}>
            <iframe
            src="https://www.google.com/maps?q=5437+E+Ocean+Blvd,+Long+Beach,+CA+90803&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            />
          </div>
        </div>
        </div>
      </div>
    )
  }