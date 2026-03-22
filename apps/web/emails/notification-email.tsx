import * as React from 'react';

interface NotificationEmailProps {
  name: string;
  email: string;
  message: string;
}

export const NotificationEmail = ({ name, email, message }: NotificationEmailProps) => {
  return React.createElement('div', {
    style: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
    }
  }, [
    React.createElement('h1', { key: 'title' }, 'New Contact Form Submission'),
    React.createElement('p', { key: 'intro' }, 'You have received a new message from your website\'s contact form.'),
    React.createElement('h2', { key: 'details-title' }, 'Sender Details:'),
    React.createElement('p', { key: 'name' }, `Name: ${name}`),
    React.createElement('p', { key: 'email' }, `Email: ${email}`),
    React.createElement('h2', { key: 'message-title' }, 'Message:'),
    React.createElement('p', { key: 'message', style: { whiteSpace: 'pre-wrap' } }, message)
  ]);
};