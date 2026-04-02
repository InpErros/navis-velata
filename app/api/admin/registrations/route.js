import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { validateAdmin, logAction } from '@/app/lib/adminAuth'
import { getSheetRows, deleteSheetRow } from '@/app/lib/googleApi'
import { del } from '@vercel/blob'

const redis = Redis.fromEnv()

export const GET = async (req) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const spreadsheetId = process.env.GOOGLE_SHEETS_ID
  const shieldsSpreadsheetId = process.env.GOOGLE_SHIELDS_SHEETS_ID

  try {
    const [studentRows, shieldsRows] = await Promise.all([
      spreadsheetId ? getSheetRows(spreadsheetId).catch(() => []) : [],
      shieldsSpreadsheetId ? getSheetRows(shieldsSpreadsheetId).catch(() => []) : [],
    ])
    return NextResponse.json({
      student: studentRows,
      shields: shieldsRows,
    })
  } catch (err) {
    console.error('Failed to fetch registrations:', err)
    return NextResponse.json({ error: 'Failed to load registrations.' }, { status: 500 })
  }
}

export const DELETE = async (req) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { sheetRowIndex, sessionIds, studentName, receiptUrl, source } = await req.json()
  if (sheetRowIndex == null) {
    return NextResponse.json({ error: 'sheetRowIndex is required.' }, { status: 400 })
  }

  const isShields = source === 'shields'
  const spreadsheetId = isShields
    ? process.env.GOOGLE_SHIELDS_SHEETS_ID
    : process.env.GOOGLE_SHEETS_ID

  if (!spreadsheetId) {
    return NextResponse.json({ error: 'Sheet is not configured.' }, { status: 503 })
  }

  try {
    await deleteSheetRow(spreadsheetId, sheetRowIndex)
  } catch (err) {
    console.error('Failed to delete registration row:', err)
    return NextResponse.json({ error: 'Failed to delete registration.' }, { status: 500 })
  }

  if (receiptUrl) {
    try {
      await del(receiptUrl)
    } catch (err) {
      console.error('Failed to delete receipt blob:', err)
    }
  }

  // Decrement enrolled on the matching Redis key
  if (sessionIds?.length) {
    const redisKey = isShields ? 'shields' : 'sessions'
    const sessions = await redis.get(redisKey) || []
    const updated = sessions.map(s =>
      sessionIds.includes(s.id) ? { ...s, enrolled: Math.max(0, (s.enrolled || 1) - 1) } : s
    )
    await redis.set(redisKey, updated)
  }

  await logAction(admin.username, `deleted ${isShields ? 'shields ' : ''}registration`, studentName || `row ${sheetRowIndex}`)
  return NextResponse.json({ success: true })
}
