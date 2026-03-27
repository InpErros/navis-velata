import { NextResponse } from 'next/server'
import { validateAdmin } from '@/app/lib/adminAuth'
import {
  sendRegistrationConfirmation,
  sendWaitlistConfirmation,
  sendWaitlistNotification,
} from '@/app/lib/emails'

export const POST = async (req) => {
  const admin = await validateAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { type, to } = await req.json()
  if (!type || !to) return NextResponse.json({ error: 'Missing type or to.' }, { status: 400 })

  try {
    if (type === 'registration') {
      await sendRegistrationConfirmation({
        to,
        name: 'Test Student',
        course: { courseType: 'Sailing A', name: 'Sailing A', price: '150' },
        sessionSummary: 'Day 1: Sat Jun 7 · Day 2: Sun Jun 8',
      })
    } else if (type === 'waitlist-confirm') {
      await sendWaitlistConfirmation({ to, name: 'Test Student', courseType: 'Sailing A' })
    } else if (type === 'waitlist-notify') {
      await sendWaitlistNotification({ to, name: 'Test Student', courseType: 'Sailing A' })
    } else {
      return NextResponse.json({ error: `Unknown email type: ${type}` }, { status: 400 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Test email failed:', err)
    return NextResponse.json({ error: err.message || 'Failed to send email.' }, { status: 500 })
  }
}
