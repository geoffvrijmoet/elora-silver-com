'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    if (!success) {
      setError('Invalid password');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
} 