import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { validateAdmin, logAction } from '@/app/lib/adminAuth'

const redis = Redis.fromEnv()

export const PUT = async (req, { params }) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const updated = await req.json()
  const events = await redis.get('events') || []
  const newEvents = events.map(e => e.id === id ? { ...updated, id } : e)
  await redis.set('events', newEvents)
  await logAction(admin.username, 'edited event', updated.title)
  return NextResponse.json({ success: true })
}

export const DELETE = async (req, { params }) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const events = await redis.get('events') || []
  const target = events.find(e => e.id === id)
  const newEvents = events.filter(e => e.id !== id)
  await redis.set('events', newEvents)
  await logAction(admin.username, 'deleted event', target?.title || id)
  return NextResponse.json({ success: true })
}
