import { Resend } from 'resend';
import { WelcomeEmail } from '@/emails/welcome-email';
import { NotificationEmail } from '@/emails/notification-email';
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
      react: NotificationEmail({ name, email, message }),
    });

    // Send welcome email to the user
    await resend.emails.send({
      from: 'contact@elorasilver.com',
      to: email,
      subject: 'Thank you for your message!',
      react: WelcomeEmail({ name }),
    });

    return NextResponse.json({ message: 'Emails sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Error sending email' }, { status: 500 });
  }
}