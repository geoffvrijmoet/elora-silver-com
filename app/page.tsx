import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Carousel } from '@/components/ui/carousel';

const heroImages = [
  'https://i.imgur.com/aXgssqc.jpeg',
  'https://i.imgur.com/BYoZZqM.jpeg',
  'https://i.imgur.com/D2XIgBp.jpeg',
  'https://i.imgur.com/jQP8kpA.jpeg',
  'https://i.imgur.com/IyqUtXM.jpeg',
  'https://i.imgur.com/apvfCVa.jpeg',
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Carousel Section */}
      <div className="relative w-full" style={{ height: '90vh' }}>
        <Carousel images={heroImages} />
        <div className="absolute inset-0 flex items-end justify-center pb-12 z-10">
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
