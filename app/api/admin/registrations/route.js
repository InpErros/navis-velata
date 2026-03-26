import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { validateAdmin, logAction } from '@/app/lib/adminAuth'
import { getSheetRows, deleteSheetRow } from '@/app/lib/googleApi'

const redis = Redis.fromEnv()

export const GET = async (req) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const spreadsheetId = process.env.GOOGLE_SHEETS_ID
  if (!spreadsheetId) {
    return NextResponse.json({ error: 'GOOGLE_SHEETS_ID is not configured.' }, { status: 503 })
  }

  try {
    const rows = await getSheetRows(spreadsheetId)
    return NextResponse.json(rows)
  } catch (err) {
    console.error('Failed to fetch registrations:', err)
    return NextResponse.json({ error: 'Failed to load registrations.' }, { status: 500 })
  }
}

export const DELETE = async (req) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const spreadsheetId = process.env.GOOGLE_SHEETS_ID
  if (!spreadsheetId) {
    return NextResponse.json({ error: 'GOOGLE_SHEETS_ID is not configured.' }, { status: 503 })
  }

  const { sheetRowIndex, sessionIds, studentName } = await req.json()
  if (sheetRowIndex == null) {
    return NextResponse.json({ error: 'sheetRowIndex is required.' }, { status: 400 })
  }

  try {
    await deleteSheetRow(spreadsheetId, sheetRowIndex)
  } catch (err) {
    console.error('Failed to delete registration row:', err)
    return NextResponse.json({ error: 'Failed to delete registration.' }, { status: 500 })
  }

  // Decrement enrolled on each selected session
  if (sessionIds?.length) {
    const sessions = await redis.get('sessions') || []
    const updated = sessions.map(s =>
      sessionIds.includes(s.id) ? { ...s, enrolled: Math.max(0, (s.enrolled || 1) - 1) } : s
    )
    await redis.set('sessions', updated)
  }

  await logAction(admin.username, 'deleted registration', studentName || `row ${sheetRowIndex}`)
  return NextResponse.json({ success: true })
}
