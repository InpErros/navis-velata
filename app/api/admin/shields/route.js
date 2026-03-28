import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { validateAdmin, logAction } from '@/app/lib/adminAuth'

const redis = Redis.fromEnv()

export const GET = async (req) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sessions = await redis.get('shields') || []
  return NextResponse.json(sessions)
}

// Bulk import — accepts an array of session objects
export const POST = async (req) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const incoming = await req.json()
  if (!Array.isArray(incoming) || incoming.length === 0) {
    return NextResponse.json({ error: 'Expected a non-empty array of sessions.' }, { status: 400 })
  }

  const now = Date.now()
  const newSessions = incoming.map((s, i) => ({
    ...s,
    id: (now + i).toString(),
    enrolled: 0,
    isOpen: s.isOpen ?? false,
  }))

  const existing = await redis.get('shields') || []
  await redis.set('shields', [...existing, ...newSessions])
  await logAction(admin.username, 'bulk imported Shields sessions', `${newSessions.length} sessions`)
  return NextResponse.json({ imported: newSessions.length })
}

// Deletes all Shields sessions
export const DELETE = async (req) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sessions = await redis.get('shields') || []
  await redis.set('shields', [])
  await logAction(admin.username, 'deleted all Shields sessions', `${sessions.length} sessions removed`)
  return NextResponse.json({ deleted: sessions.length })
}
