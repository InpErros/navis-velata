import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { appendToSheet } from '@/app/lib/googleApi'
import { sendShieldsRegistrationConfirmation } from '@/app/lib/emails'
import { logError } from '@/app/lib/errorLog'

const redis = Redis.fromEnv()

export const POST = async (req) => {
  const spreadsheetId = process.env.GOOGLE_SHIELDS_SHEETS_ID
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!spreadsheetId || !serviceAccountJson) {
    return NextResponse.json({ error: 'Registration is not configured yet.' }, { status: 503 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { sessionId, name, email, phone, password } = body

  if (!sessionId || !name || !email || !phone || !password) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }

  // Validate registration password
  const regPasswords = await redis.get('shields_reg_passwords') || []
  const matchedPassword = regPasswords.find(p => p.password === password)
  if (!matchedPassword) {
    return NextResponse.json({ error: 'Invalid registration password.' }, { status: 403 })
  }

  const sessions = await redis.get('shields') || []
  const session = sessions.find(s => s.id === sessionId)
  if (!session) return NextResponse.json({ error: 'Session not found.' }, { status: 404 })
  if (!session.isOpen) return NextResponse.json({ error: 'This session is closed.' }, { status: 409 })
  if ((session.enrolled || 0) >= session.spots) return NextResponse.json({ error: 'This session is full.' }, { status: 409 })

  const timestamp = new Date().toISOString()

  // Columns: Timestamp | Course Type | Name | Session Name | Email | Phone | Session ID
  try {
    await appendToSheet(spreadsheetId, [timestamp, session.courseType || 'Shields', name, session.name, email, phone, sessionId])
  } catch (err) {
    console.error('Sheets append failed:', err)
    await logError('Google Sheets', `Sheet append failed for ${name} (${session.courseType || 'Shields'})`, err.message)
    return NextResponse.json({ error: `Sheets append failed: ${err.message}` }, { status: 500 })
  }

  const updatedSessions = sessions.map(s =>
    s.id === sessionId ? { ...s, enrolled: (s.enrolled || 0) + 1 } : s
  )
  await redis.set('shields', updatedSessions)

  // Increment usage count on the matched password
  const updatedPasswords = regPasswords.map(p =>
    p.id === matchedPassword.id ? { ...p, usageCount: (p.usageCount || 0) + 1 } : p
  )
  await redis.set('shields_reg_passwords', updatedPasswords)

  let emailError = null
  try {
    await sendShieldsRegistrationConfirmation({ to: email, name, session })
  } catch (err) {
    console.error('Confirmation email failed:', err)
    emailError = err.message
    await logError('Email', `Confirmation email failed for ${name} <${email}> (${session.courseType || 'Shields'})`, err.message)
  }

  return NextResponse.json({ success: true, emailError })
}
