import * as React from 'react';

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => {
  return React.createElement('div', {
    style: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
    }
  }, [
    React.createElement('h1', { key: 'title' }, `Welcome, ${name}!`),
    React.createElement('p', { key: 'message' }, 'Thank you for reaching out. I have received your message and will get back to you as soon as possible.'),
    React.createElement('p', { key: 'signature1' }, 'Best,'),
    React.createElement('p', { key: 'signature2' }, 'Elora Silver, LCSW')
  ]);
};