import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Helper function to escape HTML to prevent XSS
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate input
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Check for API key
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return NextResponse.json(
        { error: 'Server configuration error: RESEND_API_KEY is missing' },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Sanitize inputs for HTML
    const sanitizedName = escapeHtml(name.trim());
    const sanitizedEmail = escapeHtml(email.trim());
    const sanitizedMessage = escapeHtml(message.trim());

    // Send email to Elora with contact form submission
    const emailResult = await resend.emails.send({
      from: 'contact@elorasilver.com',
      to: 'info@elorasilver.com',
      subject: 'New Contact Form Submission',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1>New Contact Form Submission</h1>
          <p>You have received a new message from your website's contact form.</p>
          <h2>Sender Details:</h2>
          <p><strong>Name:</strong> ${sanitizedName}</p>
          <p><strong>Email:</strong> ${sanitizedEmail}</p>
          <h2>Message:</h2>
          <p style="white-space: pre-wrap;">${sanitizedMessage}</p>
        </div>
      `,
    });

    if (emailResult.error) {
      console.error('Error sending email:', emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send email', details: emailResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Email sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error in send-email route:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Error sending email', details: errorMessage },
      { status: 500 }
    );
  }
}