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
  const sessions = await redis.get('sessions') || []
  const prev = sessions.find(s => s.id === id)
  const newSessions = sessions.map(s => s.id === id ? { ...updated, id } : s)
  await redis.set('sessions', newSessions)
  await logAction(admin.username, 'edited session', `${updated.courseType} Day ${updated.dayNumber} – ${updated.date}`)
  if (updated.isOpen && !prev?.isOpen) {
    const waitlist = await redis.get('waitlist') || []
    const targets = waitlist.filter(e => e.courseType === updated.courseType)
    await Promise.allSettled(targets.map(e =>
      sendWaitlistNotification({ to: e.email, name: e.name, courseType: e.courseType })
    ))
  }
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
