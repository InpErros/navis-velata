import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

const redis = Redis.fromEnv()

export const PUT = async (req, { params }) => {
  const password = req.headers.get('x-admin-password')
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const updated = await req.json()
  const events = await redis.get('events') || []
  const newEvents = events.map(e => e.id === id ? { ...updated, id } : e)
  await redis.set('events', newEvents)
  return NextResponse.json({ success: true })
}

export const DELETE = async (req, { params }) => {
  const password = req.headers.get('x-admin-password')
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const events = await redis.get('events') || []
  const newEvents = events.filter(e => e.id !== id)
  await redis.set('events', newEvents)
  return NextResponse.json({ success: true })
}