import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

const redis = Redis.fromEnv()

export const POST = async (req) => {
  const { password } = await req.json()
  if (!password) return NextResponse.json({ error: 'Password required.' }, { status: 400 })

  const regPasswords = await redis.get('shields_reg_passwords') || []
  const matched = regPasswords.some(p => p.password === password)
  if (!matched) return NextResponse.json({ error: 'Incorrect password.' }, { status: 403 })

  const res = NextResponse.json({ success: true })
  res.cookies.set('maintenance_access', 'unlocked', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
  })
  return res
}
