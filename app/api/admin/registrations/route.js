import { NextResponse } from 'next/server'
import { validateAdmin } from '@/app/lib/adminAuth'
import { getSheetRows } from '@/app/lib/googleApi'

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
