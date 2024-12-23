import { Button } from '@/components/ui/button';
import Link from 'next/link';
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
      </div>
      
      <div className="flex justify-center py-8">
        <Link href="/game">
          <Button size="lg" className="text-lg px-8">
            Play the secret game →
          </Button>
        </Link>
      </div>
    </main>
  );
}
