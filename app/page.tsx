'use client';

import { useAuth } from '@/lib/auth-context';
import { LoginForm } from '@/components/login-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
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
      <nav className="flex justify-end mb-8">
        <Button onClick={logout} variant="outline">
          Logout
        </Button>
      </nav>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Welcome to Elora Silver&apos;s Website</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">About Me</h2>
          <p className="text-lg">
            Professional social worker and therapist dedicated to helping individuals
            navigate life&apos;s challenges.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Learn &quot;Shake Ya Ass&quot;</h2>
          <p className="text-lg mb-4">
            Ready to learn the lyrics to this classic song?
          </p>
          <Link href="/game">
            <Button size="lg">
              Play the Game →
            </Button>
          </Link>
        </section>
      </div>
    </main>
  );
}
