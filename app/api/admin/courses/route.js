import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { validateAdmin } from '@/app/lib/adminAuth'

const redis = Redis.fromEnv()

// Returns all courses (open and closed) for the admin panel
export const GET = async (req) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const courses = await redis.get('courses') || []
  return NextResponse.json(courses)
}
