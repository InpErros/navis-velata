import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { appendToSheet } from '@/app/lib/googleApi'
import { sendRegistrationConfirmation } from '@/app/lib/emails'

const redis = Redis.fromEnv()

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf']
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

export const POST = async (req) => {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!spreadsheetId || !serviceAccountJson) {
    const missing = [
      !serviceAccountJson && 'GOOGLE_SERVICE_ACCOUNT_JSON',
      !spreadsheetId && 'GOOGLE_SHEETS_ID',
    ].filter(Boolean).join(', ')
    console.error('Missing env vars:', missing)
    return NextResponse.json({ error: 'Registration is not configured yet.' }, { status: 503 })
  }

  let formData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 })
  }

  const courseType = formData.get('courseType')
  const sessionIdsRaw = formData.get('sessionIds') // comma-separated session IDs
  const name = formData.get('name')?.trim()
  const email = formData.get('email')?.trim()
  const discord = formData.get('discord')?.trim()
  const sessionSummary = formData.get('sessionSummary')?.trim() || ''
  const receiptFile = formData.get('receipt')

  if (!courseType || !sessionIdsRaw || !name || !email || !discord) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }
  if (!receiptFile || typeof receiptFile === 'string') {
    return NextResponse.json({ error: 'Payment receipt file is required.' }, { status: 400 })
  }
  if (!ALLOWED_TYPES.includes(receiptFile.type)) {
    return NextResponse.json({ error: 'Receipt must be a JPG, PNG, or PDF.' }, { status: 400 })
  }

  const buffer = Buffer.from(await receiptFile.arrayBuffer())
  if (buffer.byteLength > MAX_SIZE) {
    return NextResponse.json({ error: 'Receipt file must be under 10 MB.' }, { status: 400 })
  }

  const sessionIds = sessionIdsRaw.split(',').filter(Boolean)

  // Validate sessions
  const sessions = await redis.get('sessions') || []
  const selectedSessions = sessionIds.map(id => sessions.find(s => s.id === id)).filter(Boolean)

  if (selectedSessions.length !== sessionIds.length) {
    return NextResponse.json({ error: 'One or more sessions not found.' }, { status: 404 })
  }
  for (const session of selectedSessions) {
    if (!session.isOpen) {
      return NextResponse.json({ error: `Session on ${session.date} is closed.` }, { status: 409 })
    }
    if (session.enrolled >= session.spots) {
      return NextResponse.json({ error: `Session on ${session.date} is full.` }, { status: 409 })
    }
  }

  // Upload receipt to Vercel Blob
  const timestamp = new Date().toISOString()
  const ext = receiptFile.type === 'application/pdf' ? 'pdf' : receiptFile.type === 'image/png' ? 'png' : 'jpg'
  const blobPath = `receipts/${courseType} - ${name} - ${Date.now()}.${ext}`

  let receiptUrl
  try {
    const blob = await put(blobPath, buffer, { access: 'public', contentType: receiptFile.type })
    receiptUrl = blob.url
  } catch (err) {
    console.error('Blob upload failed:', err)
    return NextResponse.json({ error: `Blob upload failed: ${err.message}` }, { status: 500 })
  }

  // Build coach-friendly session detail from actual session objects (sorted by day)
  const sessionDetail = [...selectedSessions]
    .sort((a, b) => (a.dayNumber || 0) - (b.dayNumber || 0))
    .map(s => `Day ${s.dayNumber}: ${s.date}`)
    .join(' · ')

  // Append row to Google Sheets
  // Columns: Timestamp | Course Type | Name | Session Detail | Email | Discord | Session IDs | Receipt URL
  try {
    await appendToSheet(spreadsheetId, [timestamp, courseType, name, sessionDetail, email, discord, sessionIds.join(','), receiptUrl])
  } catch (err) {
    console.error('Sheets append failed:', err)
    return NextResponse.json({ error: `Sheets append failed: ${err.message}` }, { status: 500 })
  }

  // Increment enrolled on each selected session
  const updatedSessions = sessions.map(s =>
    sessionIds.includes(s.id) ? { ...s, enrolled: (s.enrolled || 0) + 1 } : s
  )
  await redis.set('sessions', updatedSessions)

  // Send confirmation email
  let emailError = null
  try {
    await sendRegistrationConfirmation({ to: email, name, course: { name: courseType }, sessionSummary })
  } catch (err) {
    console.error('Confirmation email failed:', err)
    emailError = err.message
  }

  return NextResponse.json({ success: true, emailError })
}
