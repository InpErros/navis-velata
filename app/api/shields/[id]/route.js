import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { validateAdmin, logAction } from '@/app/lib/adminAuth'
import { sendWaitlistNotification } from '@/app/lib/emails'

const redis = Redis.fromEnv()

export const PUT = async (req, { params }) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const updated = await req.json()
  const sessions = await redis.get('shields') || []
  const prev = sessions.find(s => s.id === id)
  const newSessions = sessions.map(s => s.id === id ? { ...updated, id } : s)
  await redis.set('shields', newSessions)
  await logAction(admin.username, 'edited Shields session', updated.name)
  if (updated.isOpen && !prev?.isOpen) {
    const waitlist = await redis.get('waitlist') || []
    const targets = waitlist.filter(e => e.courseType === 'Shields')
    await Promise.allSettled(targets.map(e =>
      sendWaitlistNotification({ to: e.email, name: e.name, courseType: 'Shields' })
    ))
  }
  return NextResponse.json({ success: true })
}

export const PATCH = async (req, { params }) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const sessions = await redis.get('shields') || []
  const target = sessions.find(s => s.id === id)
  if (!target) return NextResponse.json({ error: 'Not found.' }, { status: 404 })

  const archived = await redis.get('shields_archived') || []
  await redis.set('shields', sessions.filter(s => s.id !== id))
  await redis.set('shields_archived', [...archived, { ...target, archivedAt: new Date().toISOString() }])
  await logAction(admin.username, 'archived Shields session', target.name || id)
  return NextResponse.json({ success: true })
}

export const DELETE = async (req, { params }) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const sessions = await redis.get('shields') || []
  const target = sessions.find(s => s.id === id)
  await redis.set('shields', sessions.filter(s => s.id !== id))
  await logAction(admin.username, 'deleted Shields session', target?.name || id)
  return NextResponse.json({ success: true })
}
