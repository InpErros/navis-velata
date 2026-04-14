import { Resend } from 'resend'
import { DISCORD_URL, SITE_LEARN_TO_SAIL_URL, SITE_CONTACT_URL } from '@/app/lib/links'


const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = `CSULB Sailing <${process.env.RESEND_FROM_EMAIL || 'noreply@sailcsulb.org'}>`

const SOCIAL_FOOTER = `
        <tr>
          <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 32px;text-align:center;">
            <p style="font-size:12px;color:#9ca3af;margin:0 0 12px;">CSULB Sailing Association · Long Beach, CA</p>
            <a href="${SITE_CONTACT_URL}" target="_blank" style="display:inline-block;background:#1e3a5f;color:#ffffff;text-decoration:none;padding:8px 20px;border-radius:6px;font-size:13px;font-weight:700;">Contact Us</a>
          </td>
        </tr>`

/**
 * Sends a registration confirmation email to the student.
 */
export async function sendRegistrationConfirmation({ to, name, course, sessionSummary }) {
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@sailcsulb.org'

  const sessionLines = sessionSummary
    ? sessionSummary.split(', ').join('<br/>')
    : 'Dates to be announced — check with an officer on Discord.'

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background:#1e3a5f;padding:32px;text-align:center;">
            <p style="color:#ecaa00;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 8px;">CSULB Sailing Association</p>
            <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0;">Registration Confirmed</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 32px;">
            <p style="font-size:16px;color:#374151;margin:0 0 24px;">Hi <strong>${name}</strong>,</p>
            <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 32px;">
              We've received your registration for the course below. Your payment receipt has been uploaded and is under review.
            </p>

            <!-- Course card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;margin-bottom:32px;">
              <tr>
                <td style="padding:24px;">
                  <p style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 6px;">${course.courseType}</p>
                  <h2 style="font-size:20px;font-weight:700;color:#111827;margin:0 0 16px;">${course.name}</h2>
                  <p style="font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 8px;">Sessions</p>
                  <p style="font-size:15px;color:#374151;line-height:1.8;margin:0;">${sessionLines}</p>
                </td>
              </tr>
            </table>

            <!-- Next steps -->
            <h3 style="font-size:16px;font-weight:700;color:#111827;margin:0 0 12px;">What happens next?</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              ${[
                ['💬', 'A coach will email you before your course with more details.'],
                ['📅', 'Add the session dates to your calendar, please arrive on time.'],
                ['⛵', 'Join the discord and follow the instagram.'],
              ].map(([icon, text]) => `
              <tr>
                <td width="32" valign="top" style="padding:8px 12px 8px 0;font-size:18px;">${icon}</td>
                <td style="padding:8px 0;font-size:15px;color:#374151;line-height:1.6;">${text}</td>
              </tr>`).join('')}
            </table>

            <!-- Contact note -->
            <div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:16px 20px;margin-bottom:32px;">
              <p style="font-size:14px;color:#92400e;margin:0;line-height:1.6;">
                Need to make changes to your registration? Reach out to an officer on
                <a href="${DISCORD_URL}" style="color:#92400e;font-weight:700;">Discord</a>
                and we'll get it sorted out.
              </p>
            </div>

            <p style="font-size:15px;color:#374151;line-height:1.7;margin:0;">
              See you on the water,<br/>
              <strong>CSULB Sailing Association</strong>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        ${SOCIAL_FOOTER}

      </table>
    </td></tr>
  </table>
</body>
</html>
`

  await resend.emails.send({
    from: `CSULB Sailing <${fromEmail}>`,
    to,
    subject: `Registration confirmed: ${course.name}`,
    html,
  })
}

/**
 * Sends a waitlist confirmation email to the student.
 */
export async function sendWaitlistConfirmation({ to, name, courseType }) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;">
        <tr>
          <td style="background:#1e3a5f;padding:32px;text-align:center;">
            <p style="color:#ecaa00;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 8px;">CSULB Sailing Association</p>
            <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0;">You're on the Waitlist</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 32px;">
            <p style="font-size:16px;color:#374151;margin:0 0 24px;">Hi <strong>${name}</strong>,</p>
            <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 32px;">
              We've added you to the waitlist for the course below. We'll email you as soon as new sessions open up. Keep an eye on our socials for any announcements about upcoming sessions and events.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;margin-bottom:32px;">
              <tr>
                <td style="padding:24px;">
                  <p style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 6px;">Course</p>
                  <h2 style="font-size:20px;font-weight:700;color:#111827;margin:0;">${courseType}</h2>
                </td>
              </tr>
            </table>
            <p style="font-size:15px;color:#374151;line-height:1.7;margin:0;">
              See you on the water,<br/>
              <strong>CSULB Sailing Association</strong>
            </p>
          </td>
        </tr>
        ${SOCIAL_FOOTER}
      </table>
    </td></tr>
  </table>
</body>
</html>
`
  await resend.emails.send({
    from: FROM,
    to,
    subject: `You're on the waitlist: ${courseType}`,
    html,
  })
}

/**
 * Sends a registration confirmation email for Shields / community program courses.
 */
export async function sendShieldsRegistrationConfirmation({ to, name, session }) {
  const sessionDetail = `Day 1: ${session.day1Date}${session.day1StartTime ? ` · ${session.day1StartTime}${session.day1EndTime ? `–${session.day1EndTime}` : ''}` : ''} &nbsp;|&nbsp; Day 2: ${session.day2Date}${session.day2StartTime ? ` · ${session.day2StartTime}${session.day2EndTime ? `–${session.day2EndTime}` : ''}` : ''}`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background:#1e3a5f;padding:32px;text-align:center;">
            <p style="color:#ecaa00;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 8px;">CSULB Sailing Association</p>
            <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0;">RSVP Confirmed</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 32px;">
            <p style="font-size:16px;color:#374151;margin:0 0 24px;">Hi <strong>${name}</strong>,</p>
            <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 32px;">
              Your RSVP for the community sailing session below has been received:
            </p>

            <!-- Course card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;margin-bottom:32px;">
              <tr>
                <td style="padding:24px;">
                  <p style="font-size:11px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 6px;">${session.courseType || 'Community Program'}</p>
                  <h2 style="font-size:20px;font-weight:700;color:#111827;margin:0 0 16px;">${session.name}</h2>
                  <p style="font-size:14px;color:#374151;line-height:1.8;margin:0;">${sessionDetail}</p>
                </td>
              </tr>
            </table>

            <!-- Next steps -->
            <h3 style="font-size:16px;font-weight:700;color:#111827;margin:0 0 12px;">What happens next?</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              ${[
                ['💬', 'A coach will email you before your course with more details.'],
                ['📅', 'Add the session dates to your calendar and plan to arrive on time.'],
                ['⛵', 'Come ready to learn, all equipment will be provided.'],
              ].map(([icon, text]) => `
              <tr>
                <td width="32" valign="top" style="padding:8px 12px 8px 0;font-size:18px;">${icon}</td>
                <td style="padding:8px 0;font-size:15px;color:#374151;line-height:1.6;">${text}</td>
              </tr>`).join('')}
            </table>

            <!-- Contact note -->
            <div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:16px 20px;margin-bottom:32px;">
              <p style="font-size:14px;color:#92400e;margin:0;line-height:1.6;">
                Questions or need to make changes? Reach out via
                <a href="${DISCORD_URL}" style="color:#92400e;font-weight:700;">Discord</a>.
              </p>
            </div>

            <p style="font-size:15px;color:#374151;line-height:1.7;margin:0;">
              See you on the water,<br/>
              <strong>CSULB Sailing Association</strong>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        ${SOCIAL_FOOTER}

      </table>
    </td></tr>
  </table>
</body>
</html>
`

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@sailcsulb.org'
  await resend.emails.send({
    from: `CSULB Sailing <${fromEmail}>`,
    to,
    subject: `Registration confirmed: ${session.name}`,
    html,
  })
}

/**
 * Notifies a waitlisted student that sessions for their course are now open.
 */
export async function sendWaitlistNotification({ to, name, courseType }) {
  const registerUrl = SITE_LEARN_TO_SAIL_URL
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;">
        <tr>
          <td style="background:#1e3a5f;padding:32px;text-align:center;">
            <p style="color:#ecaa00;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 8px;">CSULB Sailing Association</p>
            <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0;">Sessions Are Now Open!</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 32px;">
            <p style="font-size:16px;color:#374151;margin:0 0 24px;">Hi <strong>${name}</strong>,</p>
            <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 32px;">
              Good news! Sessions for the course you've been waiting on are now open for registration. Spots are limited, so sign up soon!
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;margin-bottom:32px;">
              <tr>
                <td style="padding:24px;">
                  <p style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 6px;">Course</p>
                  <h2 style="font-size:20px;font-weight:700;color:#111827;margin:0 0 20px;">${courseType}</h2>
                  <a href="${registerUrl}" style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;font-weight:700;font-size:15px;">Register Now →</a>
                </td>
              </tr>
            </table>
            <p style="font-size:15px;color:#374151;line-height:1.7;margin:0;">
              See you on the water,<br/>
              <strong>CSULB Sailing Association</strong>
            </p>
          </td>
        </tr>
        ${SOCIAL_FOOTER}
      </table>
    </td></tr>
  </table>
</body>
</html>
`
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Sessions open: ${courseType} — register now`,
    html,
  })
}
