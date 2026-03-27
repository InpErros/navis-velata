import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Sends a registration confirmation email to the student.
 */
export async function sendRegistrationConfirmation({ to, name, course, sessionSummary }) {
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@sailcsulb.org'
  const contactUrl = 'https://sailcsulb.com/contact'

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
                  <p style="font-size:15px;color:#374151;line-height:1.8;margin:0 0 16px;">${sessionLines}</p>
                  <p style="font-size:15px;color:#111827;font-weight:700;margin:0;">$${course.price} per course</p>
                </td>
              </tr>
            </table>

            <!-- Next steps -->
            <h3 style="font-size:16px;font-weight:700;color:#111827;margin:0 0 12px;">What happens next?</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              ${[
                ['💬', 'An officer will reach out to you before your course '],
                ['📅', 'Add the session dates to your calendar — courses start on time.'],
                ['⛵', 'Show up ready to sail! We\'ll have everything else you need.'],
              ].map(([icon, text]) => `
              <tr>
                <td width="32" valign="top" style="padding:8px 12px 8px 0;font-size:18px;">${icon}</td>
                <td style="padding:8px 0;font-size:15px;color:#374151;line-height:1.6;">${text}</td>
              </tr>`).join('')}
            </table>

            <!-- Edit / contact note -->
            <div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:16px 20px;margin-bottom:32px;">
              <p style="font-size:14px;color:#92400e;margin:0;line-height:1.6;">
                Need to make changes to your registration?
                <a href="${contactUrl}" style="color:#92400e;font-weight:700;">Contact us here</a> and we'll get it sorted out.
              </p>
            </div>

            <p style="font-size:15px;color:#374151;line-height:1.7;margin:0;">
              See you on the water,<br/>
              <strong>CSULB Sailing Association</strong>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 32px;text-align:center;">
            <p style="font-size:12px;color:#9ca3af;margin:0;">
              CSULB Sailing Association · Long Beach, CA
              &nbsp;·&nbsp;
              <a href="${contactUrl}" style="color:#9ca3af;">Contact us</a>
            </p>
          </td>
        </tr>

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
