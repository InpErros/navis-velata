import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { validateAdmin, logAction } from '@/app/lib/adminAuth'

const redis = Redis.fromEnv()

// Returns all archived items
export const GET = async (req) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [sessions, shields, events, registrations, waitlist] = await Promise.all([
    redis.get('sessions_archived'),
    redis.get('shields_archived'),
    redis.get('events_archived'),
    redis.get('registrations_archived'),
    redis.get('waitlist_archived'),
  ])
  return NextResponse.json({
    sessions: sessions || [],
    shields: shields || [],
    events: events || [],
    registrations: registrations || [],
    waitlist: waitlist || [],
  })
}

// Restore an archived item back to its active list
export const DELETE = async (req) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { type, id } = await req.json()
  if (!type || !id) return NextResponse.json({ error: 'Missing type or id.' }, { status: 400 })

  const archiveKey = `${type}_archived`
  const activeKey = type

  const archived = await redis.get(archiveKey) || []
  const target = archived.find(item => item.id === id)
  if (!target) return NextResponse.json({ error: 'Not found in archive.' }, { status: 404 })

  const { archivedAt: _, ...restored } = target
  const active = await redis.get(activeKey) || []
  await redis.set(archiveKey, archived.filter(item => item.id !== id))
  await redis.set(activeKey, [...active, restored])
  await logAction(admin.username, `restored ${type.replace('_', ' ')}`, target.title || target.name || target.courseType || id)
  return NextResponse.json({ success: true })
}
