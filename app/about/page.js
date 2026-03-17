export default function About() {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '64px 24px' }}>
  
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '700', marginBottom: '16px' }}>About Us</h1>
          <p style={{ fontSize: '18px', color: '#6b7280', lineHeight: '1.8', maxWidth: '700px', margin: '0 auto' }}>
            The CSULB Sailing Association is one of the oldest recreational clubs on campus.
            The club maintains its own fleet of boats in order to make sailing accessible and
            affordable for the university community.
          </p>
        </div>
  
        {/* Mission */}
        <div style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>Our Mission</h2>
          <p style={{ fontSize: '17px', color: '#6b7280', lineHeight: '1.8', marginBottom: '16px' }}>
            We offer sailing instruction to CSULB students and sponsor many types of sailing-related
            events through the club. Our efforts focus on improving the overall skills of our students
            and promoting sailing as a life-long sport.
          </p>
          <p style={{ fontSize: '17px', color: '#6b7280', lineHeight: '1.8' }}>
            We welcome members with all levels of sailing experience, including those who have never
            sailed before.
          </p>
        </div>
  
        {/* Fleet */}
        <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '40px', marginBottom: '64px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>Our Fleet</h2>
          <p style={{ fontSize: '17px', color: '#6b7280', lineHeight: '1.8', marginBottom: '24px' }}>
            We teach complete beginners the basics of sailing using US Sailing standards, making use
            of our fleet of over 30 boats across a variety of classes.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {['RS Quest', 'Laser', 'Hobie Catamaran', 'Shields'].map(boat => (
              <div key={boat} style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px 20px',
                fontSize: '15px',
                fontWeight: '600',
                color: '#374151',
              }}>
                {boat}
              </div>
            ))}
          </div>
        </div>
  
        {/* Student Board */}
        <div style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Student Board</h2>
          <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '32px' }}>
            The student board rotates yearly and is elected by club members.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {[
              { role: 'Commodore / President', name: 'Name TBD' },
              { role: 'Vice President', name: 'Name TBD' },
              { role: 'Secretary', name: 'Name TBD' },
              { role: 'Treasurer', name: 'Name TBD' },
              { role: 'Event Chair', name: 'Name TBD' },
            ].map((member, index) => (
              <div key={index} style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: '#e5e7eb',
                  flexShrink: 0,
                }}/>
                <div>
                  <p style={{ fontWeight: '700', fontSize: '16px', margin: '0 0 4px', color: '#111827' }}>
                    {member.name}
                  </p>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Coaches */}
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Coaches</h2>
          <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '32px' }}>
            Our volunteer coaches bring years of sailing experience to help every member improve on the water.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {[
              { role: 'Head Coach', name: 'Name TBD' },
              { role: 'Small Boat Sailing Coach', name: 'Name TBD' },
              { role: 'Small Boat Sailing Coach', name: 'Name TBD' },
              { role: 'Small Boat Sailing Coach', name: 'Name TBD' },
              { role: 'Small Boat Sailing Coach', name: 'Name TBD' },
              { role: 'Shields / Keelboat Coach', name: 'Name TBD' },
              { role: 'Boatwright', name: 'Name TBD' },
            ].map((coach, index) => (
              <div key={index} style={{
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '10px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: '#bae6fd',
                  flexShrink: 0,
                }}/>
                <div>
                  <p style={{ fontWeight: '700', fontSize: '16px', margin: '0 0 4px', color: '#111827' }}>
                    {coach.name}
                  </p>
                  <p style={{ fontSize: '14px', color: '#0ea5e9', margin: 0 }}>{coach.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
  
      </div>
    )
  }