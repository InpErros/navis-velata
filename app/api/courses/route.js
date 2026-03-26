import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { validateAdmin, logAction } from '@/app/lib/adminAuth'

const redis = Redis.fromEnv()

export const GET = async () => {
  const courses = await redis.get('courses') || []
  // Public endpoint returns only open courses
  return NextResponse.json(courses.filter(c => c.isOpen))
}

export const POST = async (req) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const course = await req.json()
  const courses = await redis.get('courses') || []
  const newCourse = {
    ...course,
    id: Date.now().toString(),
    enrolled: 0,
    isOpen: course.isOpen ?? false,
  }
  await redis.set('courses', [...courses, newCourse])
  await logAction(admin.username, 'added course', course.name)
  return NextResponse.json(newCourse)
}
