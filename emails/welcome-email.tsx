import * as React from 'react';

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail: React.FC<Readonly<WelcomeEmailProps>> = ({
  name,
}) => (
  <div>
    <h1>Welcome, {name}!</h1>
    <p>Thank you for reaching out. I have received your message and will get back to you as soon as possible.</p>
    <p>Best,</p>
    <p>Elora Silver, LCSW</p>
  </div>
);