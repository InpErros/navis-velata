import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { validateAdmin } from '@/app/lib/adminAuth'

const redis = Redis.fromEnv()

export const GET = async (req) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sessions = await redis.get('shields') || []
  return NextResponse.json(sessions)
}
