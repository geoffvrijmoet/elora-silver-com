#!/usr/bin/env node
// Sends an email via Resend.
// Usage: node send-email.js <subject> <body-text>

const RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) {
  console.error('RESEND_API_KEY not set');
  process.exit(1);
}

const subject = process.argv[2];
const bodyText = process.argv[3];

if (!subject || !bodyText) {
  console.error('Usage: send-email.js <subject> <body-text>');
  process.exit(1);
}

async function main() {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Website Updates <contact@elorasilver.com>',
      to: 'info@elorasilver.com',
      cc: 'geofferyv@gmail.com',
      reply_to: 'noreply@elorasilver.com',
      subject,
      html: bodyText.replace(/\n/g, '<br>') +
        '<br><br><hr style="border:none;border-top:1px solid #ddd;margin:16px 0">' +
        '<p style="color:#888;font-size:12px;">This is an automated message. Please do not reply to this email — replies are not monitored. ' +
        'To request changes or approve updates, visit your <a href="https://admin.elorasilver.com/dashboard">admin dashboard</a>.</p>',
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Failed to send email:', err);
    process.exit(1);
  }

  console.log('Email sent');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
