'use client'

import { useState, useEffect } from 'react'
import CourseRegistrationModal from './CourseRegistrationModal'

export default function CourseSchedule({ programType }) {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState(null)

  useEffect(() => {
    fetch('/api/courses')
      .then(r => r.json())
      .then(data => {
        const filtered = data.filter(c => c.programType === programType)
        setCourses(filtered)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [programType])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0', color: '#9ca3af', fontSize: '15px' }}>
        Loading course schedule...
      </div>
    )
  }

  if (courses.length === 0) return null

  return (
    <>
      <div style={{ marginBottom: '64px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '8px', color: '#111827' }}>Upcoming Course Schedule</h2>
        <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '28px' }}>
          Select a course below and register directly on this page.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {courses.map(course => {
            const spotsLeft = course.capacity - (course.enrolled || 0)
            const isFull = spotsLeft <= 0

            return (
              <div key={course.id} style={{
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '28px 32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '24px',
                flexWrap: 'wrap',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      backgroundColor: '#1e3a5f', color: '#fff',
                      fontSize: '11px', fontWeight: '700', padding: '3px 10px',
                      borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>
                      {course.courseType}
                    </span>
                    {isFull && (
                      <span style={{
                        backgroundColor: '#fef2f2', color: '#dc2626',
                        fontSize: '11px', fontWeight: '700', padding: '3px 10px',
                        borderRadius: '999px', border: '1px solid #fecaca',
                      }}>
                        Full
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 6px', color: '#111827' }}>
                    {course.name}
                  </h3>

                  {course.description && (
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 10px', lineHeight: '1.6' }}>
                      {course.description}
                    </p>
                  )}

                  {course.sessions?.length > 0 && course.sessions.some(s => s.date) && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {course.sessions.filter(s => s.date).map((session, i) => (
                        <span key={i} style={{
                          backgroundColor: '#e0f2fe', color: '#0369a1',
                          fontSize: '12px', fontWeight: '600', padding: '4px 10px',
                          borderRadius: '6px',
                        }}>
                          {session.date}{session.startTime ? ` · ${session.startTime}` : ''}{session.endTime ? `–${session.endTime}` : ''}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: '32px', fontWeight: '700', color: '#111827', margin: '0 0 4px' }}>
                    ${course.price}
                  </p>
                  <p style={{ fontSize: '13px', color: isFull ? '#dc2626' : '#6b7280', margin: '0 0 16px' }}>
                    {isFull ? 'No spots left' : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
                  </p>
                  <button
                    onClick={() => setSelectedCourse(course)}
                    disabled={isFull}
                    style={{
                      backgroundColor: isFull ? '#e5e7eb' : '#ecaa00',
                      color: isFull ? '#9ca3af' : '#000',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '10px 22px',
                      fontWeight: '700',
                      fontSize: '14px',
                      cursor: isFull ? 'default' : 'pointer',
                    }}
                  >
                    {isFull ? 'Full' : 'Register'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {selectedCourse && (
        <CourseRegistrationModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </>
  )
}
