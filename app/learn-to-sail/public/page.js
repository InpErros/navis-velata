import Link from 'next/link';
import PageHero from '../../components/PageHero';
import ShieldsSchedule from '../../components/ShieldsSchedule';

// ─── Update community program course info here ────────────────────────────────
const courses = [
  {
    title: 'Keelboat 1',
    price: 'TBD',
    tagline: 'Introduction to Classic Keelboat Sailing',
    perks: [
      'Learn personal preparation & safety',
      'Learn the language of sailing & parts of the boat',
      'Learn line (rope) handling & knots',
      'Learn how the wind & sails work together',
      'Learn how to make sail adjustments',
    ],
    note: '',
    color: { bg: '#f0fdf4', border: '#bbf7d0', tag: '#16a34a' },
  },
  {
    title: 'Keelboat 2',
    price: 'TBD',
    tagline: 'Classic Keelboat Rigging & Handling',
    perks: [
      'Learn rigging & down-rigging',
      'Learn undocking & docking',
      'Learn steering & speed control',
      'Learn tacking & jibing',
      'Learn points of sail and upwind & downwind sailing',
      'Learn anchoring for safety',
    ],
    note: '',
    color: { bg: '#f0f9ff', border: '#bae6fd', tag: '#0ea5e9' },
  },
  {
    title: 'Keelboat 3',
    price: 'TBD',
    tagline: 'Achieving Classic Keelboats Competency',
    perks: [
      'Learn about weather & currents',
      'Learn Right of Way on the water',
      'Learn the finer points of sailing & sail shape',
      'Learn de-powering the sails & reducing sail area',
      ' Learn navigation aids, rules & basic chart reading',
      'Learn overboard rescue, emergency management & VHF radio usage',
    ],
    note: '',
    color: { bg: '#fdf4ff', border: '#e9d5ff', tag: '#9333ea' },
  },
];

export default function PublicProgram() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px 80px' }}>
      <div className="page-card" style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        overflow: 'hidden',
        color: '#111827',
      }}>

        <PageHero title="Community Program" imageSrc='/shields2.avif'/>

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
            backgroundColor: '#16a34a', color: '#fff',
            fontSize: '12px', fontWeight: '600', padding: '4px 12px',
            borderRadius: '999px', display: 'inline-block', marginBottom: '16px',
          }}>
            Open to the Public
          </span>
          <h1 style={{ fontSize: '42px', fontWeight: '700', marginBottom: '16px' }}>Community Program</h1>
          <p style={{ fontSize: '18px', color: '#6b7280', lineHeight: '1.8', maxWidth: '650px', margin: '0 auto' }}>
            Our community sailing program is open to adults of all ages! Learn to sail about our classic fleet of Shields with instruction from our US Sailing certified coaches.
          </p>
        </div>

        {/* Boats used
        <div style={{
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '48px',
          display: 'flex',
          gap: '24px',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#111827' }}>
              Taught on Shields
            </h3>
            <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.7', margin: 0 }}>
              Community courses are conducted exclusively aboard our Shields keelboats —
              stable, classic one-design sailboats well suited to beginner instruction in
              open water conditions.
            </p>
          </div>
        </div> */}

        {/* Courses + inline session schedules */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '64px' }}>
          {courses.map((course, index) => (
            <div key={index}>
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
                      {course.title}
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
                  {course.note && (
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, fontStyle: 'italic' }}>{course.note}</p>
                  )}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: '36px', fontWeight: '700', color: '#111827', margin: '0 0 4px' }}>
                    {course.price}
                  </p>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>per course</p>
                </div>
              </div>
              <ShieldsSchedule courseType={course.title} />
            </div>
          ))}
        </div>


</div>{/* end padding */}
      </div>{/* end page-card */}
    </div>
  );
}
