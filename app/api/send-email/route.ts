import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { name, email, message } = await request.json();

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // Send notification email to Elora
    await resend.emails.send({
      from: 'contact@elorasilver.com',
      to: 'info@elorasilver.com', // Elora's email address
      subject: 'New Contact Form Submission',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1>New Contact Form Submission</h1>
          <p>You have received a new message from your website's contact form.</p>
          <h2>Sender Details:</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <h2>Message:</h2>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    // Send welcome email to the user
    await resend.emails.send({
      from: 'contact@elorasilver.com',
      to: email,
      subject: 'Thank you for your message!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1>Welcome, ${name}!</h1>
          <p>Thank you for reaching out. I have received your message and will get back to you as soon as possible.</p>
          <p>Best,</p>
          <p>Elora Silver, LCSW</p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Emails sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Error sending email' }, { status: 500 });
  }
}