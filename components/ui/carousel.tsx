'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useCallback } from 'react';
import Image from 'next/image';
import { Button } from './button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
  'https://i.imgur.com/BYoZZqM.jpeg',
  'https://i.imgur.com/D2XIgBp.jpeg',
  'https://i.imgur.com/jQP8kpA.jpeg',
  'https://i.imgur.com/IyqUtXM.jpeg',
  'https://i.imgur.com/apvfCVa.jpeg',
];

export function Carousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative max-w-5xl mx-auto">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((src, i) => (
            <div key={i} className="flex-[0_0_100%] min-w-0 relative h-[500px]">
              <Image
                src={src}
                alt={`Carousel image ${i + 1}`}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90"
        onClick={scrollNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
} 