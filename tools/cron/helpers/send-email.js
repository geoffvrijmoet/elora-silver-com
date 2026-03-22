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
      subject,
      html: bodyText.replace(/\n/g, '<br>'),
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
