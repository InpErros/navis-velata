import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { validateAdmin, logAction } from '@/app/lib/adminAuth'

const redis = Redis.fromEnv()

export const PUT = async (req, { params }) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const updated = await req.json()
  const courses = await redis.get('courses') || []
  const newCourses = courses.map(c => c.id === id ? { ...updated, id } : c)
  await redis.set('courses', newCourses)
  await logAction(admin.username, 'edited course', updated.name)
  return NextResponse.json({ success: true })
}

export const DELETE = async (req, { params }) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const courses = await redis.get('courses') || []
  const target = courses.find(c => c.id === id)
  const newCourses = courses.filter(c => c.id !== id)
  await redis.set('courses', newCourses)
  await logAction(admin.username, 'deleted course', target?.name || id)
  return NextResponse.json({ success: true })
}
