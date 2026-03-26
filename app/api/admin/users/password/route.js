import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { validateAdmin, logAction } from '@/app/lib/adminAuth'

const redis = Redis.fromEnv()

export const PUT = async (req) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (admin.isSuperAdmin) {
    return NextResponse.json(
      { error: 'Superadmin password must be changed via environment variables in Vercel.' },
      { status: 400 }
    )
  }

  const { newPassword } = await req.json()
  if (!newPassword || newPassword.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
  }

  const users = await redis.get('admin_users') || []
  const updated = users.map(u =>
    u.username === admin.username ? { ...u, password: newPassword } : u
  )
  await redis.set('admin_users', updated)
  await logAction(admin.username, 'changed their password')
  return NextResponse.json({ success: true })
}
