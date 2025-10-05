import * as React from 'react';

interface NotificationEmailProps {
  name: string;
  email: string;
  message: string;
}

export const NotificationEmail: React.FC<Readonly<NotificationEmailProps>> = ({
  name,
  email,
  message,
}) => (
  <div>
    <h1>New Contact Form Submission</h1>
    <p>You have received a new message from your website's contact form.</p>
    <h2>Sender Details:</h2>
    <ul>
      <li><strong>Name:</strong> {name}</li>
      <li><strong>Email:</strong> {email}</li>
    </ul>
    <h2>Message:</h2>
    <p>{message}</p>
  </div>
);