'use client';

import { useAuth } from '@/lib/auth-context';
import { LoginForm } from '@/components/login-form';
import { LyricsGame } from '@/components/lyrics-game';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function GamePage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // or a loading spinner
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-6">Enter Password to Play</h2>
        <LoginForm />
        <Link href="/secret" className="mt-4">
          <Button variant="ghost">← Back to Home</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4">
      <nav className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost">← Back to Home</Button>
        </Link>
      </nav>
      
      <LyricsGame />
    </main>
  );
} 