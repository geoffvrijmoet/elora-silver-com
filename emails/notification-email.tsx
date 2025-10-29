import * as React from 'react';
import { Html, Head, Body, Container, Text, Heading } from '@react-email/components';

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
  <Html>
    <Head />
    <Body>
      <Container>
        <Heading>New Contact Form Submission</Heading>
        <Text>You have received a new message from your website's contact form.</Text>
        <Heading as="h2">Sender Details:</Heading>
        <Text><strong>Name:</strong> {name}</Text>
        <Text><strong>Email:</strong> {email}</Text>
        <Heading as="h2">Message:</Heading>
        <Text>{message}</Text>
      </Container>
    </Body>
  </Html>
);