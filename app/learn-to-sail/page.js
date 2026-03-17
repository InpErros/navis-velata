export default function LearnToSail() {
    const courses = [
      {
        level: 'Sailing A',
        price: '$80',
        tagline: 'Basics of Sailing',
        perks: [
          'Participate in club activities',
          'Sail with a more advanced member',
        ],
        note: 'Recommended starting point for all new members.',
        color: { bg: '#f0f9ff', border: '#bae6fd', tag: '#0ea5e9' },
      },
      {
        level: 'Sailing B',
        price: '$80',
        tagline: 'Captain a Boat',
        perks: [
          'Participate in club activities',
          'Sail and steer a boat with any student under safety supervision',
        ],
        note: 'For members ready to take the helm.',
        color: { bg: '#f0fdf4', border: '#bbf7d0', tag: '#16a34a' },
      },
      {
        level: 'Sailing C',
        price: '$50',
        tagline: 'Sail on Your Own',
        perks: [
          'Participate in club activities',
          'Sail and steer any of our small boats without supervision',
          'Personal access to the boatyard',
          'Take out boats anytime — no supervision required',
        ],
        note: 'If you have prior experience, reach out for permission to skip to Sailing C.',
        color: { bg: '#fdf4ff', border: '#e9d5ff', tag: '#9333ea' },
      },
    ]
  
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
          <h1 style={{ fontSize: '42px', fontWeight: '700', marginBottom: '16px' }}>Learn to Sail</h1>
          <p style={{ fontSize: '18px', color: '#6b7280', lineHeight: '1.8', maxWidth: '650px', margin: '0 auto' }}>
            We teach complete beginners the basics of sailing using US Sailing standards.
            Whether you've never set foot on a boat or you're looking to sharpen your skills,
            we have a course for you.
          </p>
        </div>
  
        {/* Membership fee banner */}
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
            <p style={{ fontSize: '15px', color: '#9ca3af', margin: 0 }}>
              Required to participate in any club activities or courses.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '36px', fontWeight: '700', margin: 0 }}>$30</p>
            <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>per semester</p>
          </div>
        </div>
  
        {/* Courses */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '64px' }}>
          {courses.map((course, index) => (
            <div key={index} style={{
              backgroundColor: course.color.bg,
              border: `1px solid ${course.color.border}`,
              borderRadius: '12px',
              padding: '32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '24px',
              flexWrap: 'wrap',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{
                    backgroundColor: course.color.tag,
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: '600',
                    padding: '4px 10px',
                    borderRadius: '999px',
                  }}>
                    {course.level}
                  </span>
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 12px', color: '#111827' }}>
                  {course.tagline}
                </h2>
                <ul style={{ margin: '0 0 16px', paddingLeft: '20px' }}>
                  {course.perks.map((perk, i) => (
                    <li key={i} style={{ fontSize: '15px', color: '#374151', lineHeight: '1.8' }}>{perk}</li>
                  ))}
                </ul>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, fontStyle: 'italic' }}>
                  {course.note}
                </p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ fontSize: '36px', fontWeight: '700', color: '#111827', margin: '0 0 4px' }}>
                  {course.price}
                </p>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>per course</p>
              </div>
            </div>
          ))}
        </div>
  
        {/* CTA */}
        <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '12px',
          padding: '48px 24px',
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>Ready to get started?</h2>
          <p style={{ fontSize: '17px', color: '#6b7280', marginBottom: '32px', lineHeight: '1.8' }}>
            Check the schedule and register for your first course today.
          </p>
          <a href="https://your-registration-link.com" target="_blank" rel="noopener noreferrer" style={{
            backgroundColor: '#0ea5e9',
            color: '#ffffff',
            padding: '14px 32px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '600',
            display: 'inline-block',
            maxWidth: '100%',
            whiteSpace: 'normal',
          }}>
            Check Schedule & Register
          </a>
        </div>
        </div>
      </div>
    )
  }