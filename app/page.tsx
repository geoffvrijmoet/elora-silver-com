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


    </main>
  );
}
