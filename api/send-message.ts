import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { from, to, message } = req.body;

    if (!from || !to || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (from.length > 100 || to.length > 100 || message.length > 2000) {
      return res.status(400).json({ error: 'Payload too large' });
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ADMIN_EMAILS } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !ADMIN_EMAILS) {
      console.error("Missing SMTP environment variables");
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const adminEmails = ADMIN_EMAILS.split(',').map((email) => email.trim());
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const safeFrom = from.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const safeTo = to.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const safeMessage = message.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>');

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Anonymous Message</title>
</head>
<body style="margin: 0; padding: 0; background-color: #09090b; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #09090b; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #18181b; border-radius: 24px; border: 1px solid #27272a; overflow: hidden; max-width: 600px; width: 100%;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #1e1b4b 0%, #3b0764 100%); background-color: #2e1065; border-bottom: 2px solid #c084fc;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">
                🤫 Someone Spilled the Tea
              </h1>
              <p style="color: #e9d5ff; margin: 12px 0 0 0; font-size: 16px; font-weight: 500;">
                A new anonymous message just arrived.
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <!-- Meta Info (From/To) -->
              <div style="margin-bottom: 30px;">
                <!-- From -->
                <div style="background-color: #27272a; border-radius: 12px; padding: 16px; border-left: 4px solid #c084fc; margin-bottom: 16px;">
                  <span style="display: block; font-size: 11px; font-weight: 700; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">👀 Who's this?</span>
                  <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600; word-break: break-word;">${safeFrom}</p>
                </div>
                
                <!-- To -->
                <div style="background-color: #27272a; border-radius: 12px; padding: 16px; border-left: 4px solid #f472b6;">
                  <span style="display: block; font-size: 11px; font-weight: 700; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">🎯 Who's receiving?</span>
                  <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600; word-break: break-word;">${safeTo}</p>
                </div>
              </div>

              <!-- The Message -->
              <div style="margin-bottom: 30px;">
                <span style="display: block; font-size: 12px; font-weight: 700; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; text-align: center;">💌 The Message</span>
                <div style="background-color: #09090b; border: 1px solid #3f3f46; border-radius: 16px; padding: 30px; text-align: center; box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);">
                  <p style="margin: 0; color: #f4f4f5; font-size: 18px; line-height: 1.7; white-space: pre-wrap; font-style: italic;">"${safeMessage}"</p>
                </div>
              </div>

              <!-- Footer Note -->
              <div style="text-align: center; padding-top: 20px; border-top: 1px dashed #3f3f46;">
                <p style="margin: 0; color: #71717a; font-size: 13px; font-weight: 500;">
                  Sent securely via InstaForm
                </p>
                <p style="margin: 6px 0 0 0; color: #52525b; font-size: 12px;">
                  Uncensored &bull; Unfiltered &bull; Unapologetic
                </p>
                <p style="margin: 12px 0 0 0; color: #3f3f46; font-size: 11px;">
                  ${new Date().toLocaleString('en-US', { timeZone: 'UTC', timeZoneName: 'short' })}
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const textContent = `
New Anonymous Message Received
------------------------------
Sender: ${from}
Recipient: ${to}

Message:
${message}

Submission Time: ${new Date().toLocaleString('en-US', { timeZone: 'UTC', timeZoneName: 'short' })}
------------------------------
This email was automatically generated by your Anonymous Message Website.
    `.trim();

    await transporter.sendMail({
      from: `"Anonymous Form" <${SMTP_USER}>`,
      to: adminEmails.join(','),
      subject: `📨 New Anonymous Message from ${from}`,
      text: textContent,
      html: htmlContent,
    });

    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}
