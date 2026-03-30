import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { validateAdmin, logAction } from '@/app/lib/adminAuth'

const redis = Redis.fromEnv()

export const GET = async (req) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!admin.isSuperAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const passwords = await redis.get('shields_reg_passwords') || []
  return NextResponse.json(passwords)
}

export const POST = async (req) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!admin.isSuperAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { label, password } = await req.json()
  if (!label || !password) {
    return NextResponse.json({ error: 'Label and password are required.' }, { status: 400 })
  }

  const passwords = await redis.get('shields_reg_passwords') || []
  const entry = { id: Date.now().toString(), label, password, createdAt: new Date().toISOString() }
  await redis.set('shields_reg_passwords', [...passwords, entry])
  await logAction(admin.username, 'created registration password', label)
  return NextResponse.json(entry)
}

export const DELETE = async (req) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!admin.isSuperAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await req.json()
  const passwords = await redis.get('shields_reg_passwords') || []
  const entry = passwords.find(p => p.id === id)
  await redis.set('shields_reg_passwords', passwords.filter(p => p.id !== id))
  await logAction(admin.username, 'deleted registration password', entry?.label || id)
  return NextResponse.json({ success: true })
}
