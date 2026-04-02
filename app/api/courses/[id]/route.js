import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { validateAdmin, logAction } from '@/app/lib/adminAuth'

const redis = Redis.fromEnv()

export const PUT = async (req, { params }) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const updated = await req.json()
  const sessions = await redis.get('sessions') || []
  const newSessions = sessions.map(s => s.id === id ? { ...updated, id } : s)
  await redis.set('sessions', newSessions)
  await logAction(admin.username, 'edited session', `${updated.courseType} Day ${updated.dayNumber} – ${updated.date}`)
  return NextResponse.json({ success: true })
}

export const PATCH = async (req, { params }) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const sessions = await redis.get('sessions') || []
  const target = sessions.find(s => s.id === id)
  if (!target) return NextResponse.json({ error: 'Not found.' }, { status: 404 })

  const archivedAt = new Date().toISOString()

  // Archive the session
  const archived = await redis.get('sessions_archived') || []
  await redis.set('sessions', sessions.filter(s => s.id !== id))
  await redis.set('sessions_archived', [...archived, { ...target, archivedAt }])

  await logAction(admin.username, 'archived session', `${target.courseType} Day ${target.dayNumber} – ${target.date}`)
  return NextResponse.json({ success: true })
}

export const DELETE = async (req, { params }) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const sessions = await redis.get('sessions') || []
  const target = sessions.find(s => s.id === id)
  const newSessions = sessions.filter(s => s.id !== id)
  await redis.set('sessions', newSessions)
  await logAction(admin.username, 'deleted session', target ? `${target.courseType} Day ${target.dayNumber} – ${target.date}` : id)
  return NextResponse.json({ success: true })
}
