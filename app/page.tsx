import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full" style={{ height: '90vh' }}>
        <Image
          src="https://i.imgur.com/aXgssqc.jpeg"
          alt="Mystikal performing"
          fill
          className="object-contain object-center"
          priority
        />
        <div className="absolute inset-0 flex items-end justify-center pb-12">
          <Link href="/game">
            <Button size="lg" className="text-lg px-8">
              Play the secret game →
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-600">
          <p>
            &quot;Shake Ya Ass&quot; © 2000 Mystikal. All rights reserved.
            This is a fan-made learning tool.
          </p>
        </div>
      </footer>
    </main>
  );
}
