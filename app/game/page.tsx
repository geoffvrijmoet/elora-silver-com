'use client';

import { useAuth } from '@/lib/auth-context';
import { LoginForm } from '@/components/login-form';
import { LyricsGame } from '@/components/lyrics-game';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function GamePage() {
  const { isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return null; // or a loading spinner
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <LoginForm />
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4">
      <nav className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost">← Back to Home</Button>
        </Link>
        <Button onClick={logout} variant="outline">
          Logout
        </Button>
      </nav>
      
      <LyricsGame />
    </main>
  );
} 