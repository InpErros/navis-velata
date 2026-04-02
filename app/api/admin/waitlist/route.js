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
  await redis.set('waitlist', waitlist.filter(e => e.id !== id))
  await logAction(admin.username, 'removed from waitlist', name || id)
  return NextResponse.json({ success: true })
}
