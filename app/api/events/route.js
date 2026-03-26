import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { validateAdmin, logAction } from '@/app/lib/adminAuth'

const redis = Redis.fromEnv()

export const GET = async (req) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const events = await redis.get('events')
  return NextResponse.json(events || [])
}

export const POST = async (req) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const event = await req.json()
  const events = await redis.get('events') || []
  const newEvent = { ...event, id: Date.now().toString() }
  await redis.set('events', [...events, newEvent])
  await logAction(admin.username, 'added event', event.title)
  return NextResponse.json(newEvent)
}
