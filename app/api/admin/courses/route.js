import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { validateAdmin } from '@/app/lib/adminAuth'

const redis = Redis.fromEnv()

// Returns all sessions (open and closed) for the admin panel
export const GET = async (req) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sessions = await redis.get('sessions') || []
  return NextResponse.json(sessions)
}
