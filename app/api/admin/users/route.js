import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { validateAdmin, logAction } from '@/app/lib/adminAuth'

const redis = Redis.fromEnv()

export const GET = async (req) => {
  const admin = await validateAdmin(req)
  if (!admin?.isSuperAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const users = await redis.get('admin_users') || []
  return NextResponse.json(users.map(u => ({ username: u.username })))
}

export const POST = async (req) => {
  const admin = await validateAdmin(req)
  if (!admin?.isSuperAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { username, password } = await req.json()
  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })
  }

  // Disallow creating an account with the superadmin username
  if (username === process.env.SUPER_ADMIN_USERNAME) {
    return NextResponse.json({ error: 'That username is reserved' }, { status: 400 })
  }

  const users = await redis.get('admin_users') || []
  if (users.find(u => u.username === username)) {
    return NextResponse.json({ error: 'Username already exists' }, { status: 409 })
  }

  const updated = [...users, { username, password }]
  await redis.set('admin_users', updated)
  await logAction(admin.username, 'added admin user', username)
  return NextResponse.json({ success: true })
}

export const DELETE = async (req) => {
  const admin = await validateAdmin(req)
  if (!admin?.isSuperAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { username } = await req.json()
  const users = await redis.get('admin_users') || []
  const updated = users.filter(u => u.username !== username)
  await redis.set('admin_users', updated)
  await logAction(admin.username, 'removed admin user', username)
  return NextResponse.json({ success: true })
}
