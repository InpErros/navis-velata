import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { sendWaitlistConfirmation } from '@/app/lib/emails'

const redis = Redis.fromEnv()

export const POST = async (req) => {
  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const { courseType, name, email, discord } = body
  if (!courseType || !name?.trim() || !email?.trim() || !discord?.trim()) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }

  const waitlist = await redis.get('waitlist') || []
  const entry = {
    id: Date.now().toString(),
    courseType,
    name: name.trim(),
    email: email.trim(),
    discord: discord.trim(),
    timestamp: new Date().toISOString(),
  }
  await redis.set('waitlist', [...waitlist, entry])
  try {
    await sendWaitlistConfirmation({ to: entry.email, name: entry.name, courseType: entry.courseType })
  } catch (err) {
    console.error('Waitlist confirmation email failed:', err)
  }
  return NextResponse.json({ success: true })
}
