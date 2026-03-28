import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { validateAdmin, logAction } from '@/app/lib/adminAuth'
import { sendWaitlistNotification } from '@/app/lib/emails'

const redis = Redis.fromEnv()

export const POST = async (req) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { courseType } = await req.json()
  if (!courseType) return NextResponse.json({ error: 'courseType is required.' }, { status: 400 })

  const waitlist = await redis.get('waitlist') || []
  const targets = waitlist.filter(e => e.courseType === courseType)

  if (targets.length === 0) return NextResponse.json({ sent: 0 })

  const results = await Promise.allSettled(
    targets.map(e => sendWaitlistNotification({ to: e.email, name: e.name, courseType: e.courseType }))
  )
  const sent = results.filter(r => r.status === 'fulfilled').length

  await logAction(admin.username, 'notified waitlist', `${courseType} (${sent}/${targets.length} sent)`)
  return NextResponse.json({ sent, total: targets.length })
}
