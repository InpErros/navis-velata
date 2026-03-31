import { Redis } from '@upstash/redis'
import PageHero from '../components/PageHero'
import { CALENDAR_EMBED_URL, CASHNET_URL } from '@/app/lib/links'

export const dynamic = 'force-dynamic'

async function getEvents() {
  const redis = Redis.fromEnv()
  const events = await redis.get('events')
  return events || []
}

export default async function Events() {
  const events = await getEvents()

  
    const typeColors = {
      'Casual Sail':   { bg: '#f0fdf4', border: '#bbf7d0', tag: '#16a34a' },
      'Maintenance':   { bg: '#fafafa', border: '#e5e7eb', tag: '#6b7280' },
      'Themed Event':  { bg: '#fdf4ff', border: '#e9d5ff', tag: '#9333ea' },
      'Social':        { bg: '#fff1f2', border: '#fecdd3', tag: '#e11d48' },
    }
  
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px 80px' }}>
        <div className="page-card"
          style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          overflow: 'hidden',
          color: '#111827',
        }}>

        <PageHero title="Events" iamgeSrc='/events-hero.avif'/>

        <div className="page-content">

        {/* Club Membership */}
        <div style={{
          backgroundColor: '#64100F',
          color: '#ffffff',
          borderRadius: '12px',
          padding: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '48px',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 8px' }}>Club Membership</h2>
            <p style={{ fontSize: '15px', color: '#fca5a5', margin: '0 0 4px' }}>
              Required to participate in any club activities.
            </p>
            <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
              Pay via{' '}
              <a href={CASHNET_URL} target="_blank" rel="noopener noreferrer" style={{ color: '#ecaa00', fontWeight: '700', textDecoration: 'none' }}>
                CashNet
              </a>
              
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '36px', fontWeight: '700', margin: 0 }}>$30</p>
            <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>per semester</p>
          </div>
        </div>

        {/* Events list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {events.map((event, index) => {
            const colors = typeColors[event.type] || typeColors['Social']
            return (
              <div key={index} className="event-card" style={{
                backgroundColor: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: '12px',
                padding: '24px',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <span style={{
                      backgroundColor: colors.tag,
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: '600',
                      padding: '4px 10px',
                      borderRadius: '999px',
                    }}>
                      {event.type}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 8px', color: '#111827' }}>
                    {event.title}
                  </h2>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px' }}>
                    {event.date} · {event.time}
                  </p>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 16px' }}>
                    {event.location}
                  </p>
                  <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.7', margin: 0 }}>
                    {event.description}
                  </p>
                </div>
                <a href={event.registrationLink || '#'}
                data-external
                target="_blank"
                rel="noopener noreferrer"
                className="event-card-register"
                style={{
                  backgroundColor: event.registrationLink ? '#ecaa00' : '#d1d5db',
                  color: event.registrationLink ? '#000000' : '#9ca3af',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '700',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  pointerEvents: event.registrationLink ? 'auto' : 'none',
                }}
              >
                {event.registrationLink ? 'Register' : 'Coming Soon'}
              </a>
              </div>
              
            )
          })}
        
        </div>

        {/* Google Calendar */}
        <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Club Calendar</h2>
        <div style={{
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '64px',
          border: '1px solid #e5e7eb',
        }}>
          <iframe
            src={CALENDAR_EMBED_URL}
            style={{ border: 'none', width: '100%', height: '600px', display: 'block' }}
          />
        </div>
        </div>{/* end padding */}
        </div>{/* end page-card */}
      </div>
    )
  }