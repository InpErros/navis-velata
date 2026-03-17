import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

const redis = Redis.fromEnv()

export const GET = async () => {
  const events = await redis.get('events')
  return NextResponse.json(events || [])
}

export const POST = async (req) => {
  const password = req.headers.get('x-admin-password')
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const event = await req.json()
  const events = await redis.get('events') || []
  const newEvent = { ...event, id: Date.now().toString() }
  await redis.set('events', [...events, newEvent])
  return NextResponse.json(newEvent)
}