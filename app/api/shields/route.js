import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { validateAdmin, logAction } from '@/app/lib/adminAuth'

const redis = Redis.fromEnv()

export const GET = async () => {
  const sessions = await redis.get('shields') || []
  return NextResponse.json(sessions.filter(s => s.isOpen))
}

export const POST = async (req) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const session = await req.json()
  const sessions = await redis.get('shields') || []
  const newSession = {
    ...session,
    id: Date.now().toString(),
    enrolled: 0,
    isOpen: session.isOpen ?? false,
  }
  await redis.set('shields', [...sessions, newSession])
  await logAction(admin.username, 'added Shields session', session.name)
  return NextResponse.json(newSession)
}
