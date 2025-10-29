import * as React from 'react';
import { Html, Head, Body, Container, Text, Heading } from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail: React.FC<Readonly<WelcomeEmailProps>> = ({
  name,
}) => (
  <Html>
    <Head />
    <Body>
      <Container>
        <Heading>Welcome, {name}!</Heading>
        <Text>Thank you for reaching out. I have received your message and will get back to you as soon as possible.</Text>
        <Text>Best,</Text>
        <Text>Elora Silver, LCSW</Text>
      </Container>
    </Body>
  </Html>
);