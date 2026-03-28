import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { validateAdmin, logAction } from '@/app/lib/adminAuth'

const redis = Redis.fromEnv()

export const GET = async () => {
  const sessions = await redis.get('sessions') || []
  return NextResponse.json(sessions.filter(s => s.isOpen))
}

export const POST = async (req) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const session = await req.json()
  const sessions = await redis.get('sessions') || []
  const newSession = {
    ...session,
    id: Date.now().toString(),
    enrolled: 0,
    isOpen: session.isOpen ?? false,
  }
  await redis.set('sessions', [...sessions, newSession])
  await logAction(admin.username, 'added session', `${session.courseType} Day ${session.dayNumber} – ${session.date}`)
  return NextResponse.json(newSession)
}
