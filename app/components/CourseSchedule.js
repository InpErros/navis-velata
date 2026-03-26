'use client'

import { useState, useEffect } from 'react'
import CourseRegistrationModal from './CourseRegistrationModal'

const COURSE_TYPE_ORDER = ['Sailing A', 'Sailing B', 'Sailing C', 'Level 1 Keelboat', 'Other']

export default function CourseSchedule({ programType, courseType }) {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [openSections, setOpenSections] = useState({})

  useEffect(() => {
    fetch('/api/courses')
      .then(r => r.json())
      .then(data => {
        let filtered = data.filter(c => c.programType === programType)
        if (courseType) filtered = filtered.filter(c => c.courseType === courseType)
        setCourses(filtered)

        // Default: open first section that has courses
        const types = COURSE_TYPE_ORDER.filter(t => filtered.some(c => c.courseType === t))
        if (types.length > 0) {
          setOpenSections({ [types[0]]: true })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [programType, courseType])

  const toggleSection = (type) => {
    setOpenSections(prev => ({ ...prev, [type]: !prev[type] }))
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '16px 0', color: '#9ca3af', fontSize: '14px' }}>
        Loading sessions...
      </div>
    )
  }

  if (courses.length === 0) return null

  const courseTypes = COURSE_TYPE_ORDER.filter(t => courses.some(c => c.courseType === t))
  const inline = Boolean(courseType)

  return (
    <>
      <div style={{ marginBottom: inline ? '0' : '64px' }}>
        {!inline && (
          <>
            <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '8px', color: '#111827' }}>Upcoming Course Schedule</h2>
            <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '28px' }}>
              Select a course below and register directly on this page.
            </p>
          </>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {courseTypes.map(type => {
            const typeCourses = courses.filter(c => c.courseType === type)
            const isOpen = openSections[type]

            return (
              <div key={type} style={{ border: '1px solid #e5e7eb', borderRadius: inline ? '0 0 12px 12px' : '12px', overflow: 'hidden', marginTop: inline ? '-1px' : '0' }}>
                {/* Accordion header */}
                <button
                  onClick={() => toggleSection(type)}
                  style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: inline ? '14px 28px' : '20px 28px', background: isOpen ? '#1e3a5f' : '#f9fafb',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    transition: 'background 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {!inline && (
                      <span style={{ fontSize: '18px', fontWeight: '700', color: isOpen ? '#fff' : '#111827' }}>
                        {type}
                      </span>
                    )}
                    <span style={{
                      fontSize: '12px', fontWeight: '600', padding: '2px 10px', borderRadius: '999px',
                      backgroundColor: isOpen ? 'rgba(255,255,255,0.15)' : '#e5e7eb',
                      color: isOpen ? '#fff' : '#6b7280',
                    }}>
                      {typeCourses.length} session{typeCourses.length !== 1 ? 's' : ''} available
                    </span>
                  </div>
                  <span style={{ fontSize: '18px', color: isOpen ? '#fff' : '#6b7280', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
                    ▾
                  </span>
                </button>

                {/* Accordion body */}
                {isOpen && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0', borderTop: '1px solid #e5e7eb' }}>
                    {typeCourses.map((course, idx) => {
                      const spotsLeft = course.capacity - (course.enrolled || 0)
                      const isFull = spotsLeft <= 0

                      return (
                        <div key={course.id} style={{
                          padding: '24px 28px',
                          borderBottom: idx < typeCourses.length - 1 ? '1px solid #f3f4f6' : 'none',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                          gap: '24px', flexWrap: 'wrap', backgroundColor: '#fff',
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                              <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: '#111827' }}>
                                {course.name}
                              </h3>
                              {isFull && (
                                <span style={{
                                  backgroundColor: '#fef2f2', color: '#dc2626',
                                  fontSize: '11px', fontWeight: '700', padding: '2px 8px',
                                  borderRadius: '999px', border: '1px solid #fecaca',
                                }}>
                                  Full
                                </span>
                              )}
                            </div>

                            {course.description && (
                              <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 12px', lineHeight: '1.6' }}>
                                {course.description}
                              </p>
                            )}

                            {/* Days + per-option spots */}
                            {course.days?.length > 0 && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {course.days.map((day, di) => (
                                  <div key={di}>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '4px' }}>
                                      {day.label}
                                    </span>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                      {day.options.filter(o => o.date).map((opt, oi) => {
                                        const optSpots = opt.spots !== '' && opt.spots != null ? Number(opt.spots) : null
                                        const optFull = optSpots !== null && optSpots <= 0
                                        return (
                                          <div key={oi} style={{
                                            display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap',
                                          }}>
                                            <span style={{
                                              backgroundColor: optFull ? '#f3f4f6' : '#e0f2fe',
                                              color: optFull ? '#9ca3af' : '#0369a1',
                                              fontSize: '12px', fontWeight: '600', padding: '3px 10px',
                                              borderRadius: '6px',
                                            }}>
                                              {opt.date}{opt.startTime ? ` · ${opt.startTime}${opt.endTime ? `–${opt.endTime}` : ''}` : ''}
                                            </span>
                                            {optSpots !== null && (
                                              <span style={{
                                                fontSize: '11px', fontWeight: '600',
                                                color: optFull ? '#dc2626' : optSpots <= 3 ? '#d97706' : '#16a34a',
                                              }}>
                                                {optFull ? 'Full' : `${optSpots} spot${optSpots !== 1 ? 's' : ''} left`}
                                              </span>
                                            )}
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div style={{ textAlign: 'right', flexShrink: 0, paddingTop: '4px' }}>
                            <button
                              onClick={() => setSelectedCourse(course)}
                              disabled={isFull}
                              style={{
                                backgroundColor: isFull ? '#e5e7eb' : '#ecaa00',
                                color: isFull ? '#9ca3af' : '#000',
                                border: 'none', borderRadius: '6px',
                                padding: '10px 22px', fontWeight: '700',
                                fontSize: '14px', cursor: isFull ? 'default' : 'pointer',
                              }}
                            >
                              {isFull ? 'Full' : 'Register'}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
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
