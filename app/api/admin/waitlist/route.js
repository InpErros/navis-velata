import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { validateAdmin, logAction } from '@/app/lib/adminAuth'

const redis = Redis.fromEnv()

export const GET = async (req) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const waitlist = await redis.get('waitlist') || []
  return NextResponse.json(waitlist)
}

export const DELETE = async (req) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, name } = await req.json()
  if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 })

  const waitlist = await redis.get('waitlist') || []
  const target = waitlist.find(e => e.id === id)
  await redis.set('waitlist', waitlist.filter(e => e.id !== id))

  if (target) {
    const waitlistArchived = await redis.get('waitlist_archived') || []
    await redis.set('waitlist_archived', [...waitlistArchived, { ...target, archivedAt: new Date().toISOString() }])
  }

  await logAction(admin.username, 'removed from waitlist', name || id)
  return NextResponse.json({ success: true })
}
