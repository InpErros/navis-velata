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

  const courseId = formData.get('courseId')
  const name = formData.get('name')?.trim()
  const email = formData.get('email')?.trim()
  const discord = formData.get('discord')?.trim()
  const receiptFile = formData.get('receipt')

  // Basic field validation
  if (!courseId || !name || !email || !discord) {
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

  // Load course from Redis
  const courses = await redis.get('courses') || []
  const course = courses.find(c => c.id === courseId)
  if (!course) {
    return NextResponse.json({ error: 'Course not found.' }, { status: 404 })
  }
  if (!course.isOpen) {
    return NextResponse.json({ error: 'Registration for this course is closed.' }, { status: 409 })
  }
  if (course.enrolled >= course.capacity) {
    return NextResponse.json({ error: 'This course is full.' }, { status: 409 })
  }

  // Upload receipt to Vercel Blob
  const timestamp = new Date().toISOString()
  const ext = receiptFile.type === 'application/pdf' ? 'pdf' : receiptFile.type === 'image/png' ? 'png' : 'jpg'
  const blobPath = `receipts/${course.name} - ${name} - ${Date.now()}.${ext}`

  let receiptUrl
  try {
    const blob = await put(blobPath, buffer, { access: 'public', contentType: receiptFile.type })
    receiptUrl = blob.url
  } catch (err) {
    console.error('Blob upload failed:', err)
    return NextResponse.json({ error: `Blob upload failed: ${err.message}` }, { status: 500 })
  }

  // Append row to Google Sheets
  // Columns: Timestamp | Course Name | Course ID | Full Name | Email | Discord | Receipt URL
  try {
    await appendToSheet(spreadsheetId, [timestamp, course.name, course.id, name, email, discord, receiptUrl])
  } catch (err) {
    console.error('Sheets append failed:', err)
    return NextResponse.json({ error: `Sheets append failed: ${err.message}` }, { status: 500 })
  }

  // Increment enrolled count in Redis
  const updatedCourses = courses.map(c =>
    c.id === courseId ? { ...c, enrolled: (c.enrolled || 0) + 1 } : c
  )
  await redis.set('courses', updatedCourses)

  // Send confirmation email (non-blocking — don't fail the registration if email fails)
  sendRegistrationConfirmation({ to: email, name, course }).catch(err =>
    console.error('Confirmation email failed:', err)
  )

  return NextResponse.json({ success: true })
}
