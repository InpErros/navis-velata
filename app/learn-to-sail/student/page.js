import Link from 'next/link';
// import RegistrationModal from '../../components/RegistrationModal';
import PageHero from '../../components/PageHero';
import CourseSchedule from '../../components/CourseSchedule';

const courses = [
  {
    level: 'Sailing A',
    price: '$80',
    tagline: 'Our beginner course, recommened for all new members!',
    perks: [
      'Learn to rig the boat',
      'Learn the parts of the boat',
      'Learn capsize procedure',
      'Learn tacking and jibing.',
      'Learn the basic wind compass',
    ],
    note: '',
    color: { bg: '#f0f9ff', border: '#bae6fd', tag: '#0ea5e9' },
  },
  {
    level: 'Sailing B',
    price: '$80',
    tagline: 'A part two of the beginner course!',
    perks: [
      'Learn to use the jib',
      'Learn basic right of way',
      'Learn man overboard procedures',
      'Learn upwind/downwind sailing',
      'Get more time on the water',
    ],
    note: '',
    color: { bg: '#f0fdf4', border: '#bbf7d0', tag: '#16a34a' },
  },
  {
    level: 'Sailing C',
    price: '$50',
    tagline: 'The last course required to become a club certified skipper.',
    perks: [
      'Learn the detailed sail compass',
      'Practice everything you have learned',
      'Take an on the water test',
      'Tour the harbour',
      'Earn your club skipper certification',
    ],
    note: '',
    color: { bg: '#fdf4ff', border: '#e9d5ff', tag: '#9333ea' },
  },
];

export default function StudentProgram() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px 80px' }}>
      <div className="page-card" style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        overflow: 'hidden',
        color: '#111827',
      }}>

        <PageHero title="Student Program" />

        <div className="page-content">

        {/* Back link */}
        <Link href="/learn-to-sail" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: '#6b7280', fontSize: '14px', textDecoration: 'none',
          marginBottom: '40px',
        }}>
          ← All programs
        </Link>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span style={{
            backgroundColor: '#0ea5e9', color: '#fff',
            fontSize: '12px', fontWeight: '600', padding: '4px 12px',
            borderRadius: '999px', display: 'inline-block', marginBottom: '16px',
          }}>
            CSULB Students
          </span>
          <h1 style={{ fontSize: '42px', fontWeight: '700', marginBottom: '16px' }}>Student Sailing Program</h1>
          <p style={{ fontSize: '18px', color: '#6b7280', lineHeight: '1.8', maxWidth: '650px', margin: '0 auto' }}>
            Taught by US Sailing certified instructors, our courses teach students the basics of small boat sailing.
            Take as many levels as you wish.
          </p>
        </div>

        

        {/* Courses + inline session schedules */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '64px' }}>
          {courses.map((course, index) => (
            <div key={index}>
              {/* Course bubble */}
              <div style={{
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

              {/* Sessions accordion for this course type */}
              <CourseSchedule programType="student" courseType={course.level} />
            </div>
          ))}
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
              Required to participate in any club activities.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '36px', fontWeight: '700', margin: 0 }}>$30</p>
            <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>per semester</p>
          </div>
        </div>

        {/* CTA */}
        {/* <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '12px',
          padding: '48px 24px',
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>Ready to get started?</h2>
          <p style={{ fontSize: '17px', color: '#6b7280', marginBottom: '32px', lineHeight: '1.8' }}>
            Check our course schedule and register today!
          </p>
          <RegistrationModal />
        </div> */}
        </div>{/* end padding */}
      </div>{/* end page-card */}
    </div>
  );
}
