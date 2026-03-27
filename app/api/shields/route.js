import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { validateAdmin, logAction } from '@/app/lib/adminAuth'
import { sendWaitlistNotification } from '@/app/lib/emails'

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
  if (newSession.isOpen) {
    const waitlist = await redis.get('waitlist') || []
    const targets = waitlist.filter(e => e.courseType === 'Shields')
    await Promise.allSettled(targets.map(e =>
      sendWaitlistNotification({ to: e.email, name: e.name, courseType: 'Shields' })
    ))
  }
  return NextResponse.json(newSession)
}
