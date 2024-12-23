'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useCallback } from 'react';
import Image from 'next/image';
import { Button } from './button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  images: string[];
}

export function Carousel({ images }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative h-full">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {images.map((src, i) => (
            <div key={i} className="flex-[0_0_100%] min-w-0 relative h-full">
              <Image
                src={src}
                alt={`Hero image ${i + 1}`}
                fill
                className="object-contain"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </div>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white z-20 w-32 h-32 rounded-full shadow-lg border-2 border-white"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-24 w-24 text-gray-700" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white z-20 w-32 h-32 rounded-full shadow-lg border-2 border-white"
        onClick={scrollNext}
      >
        <ChevronRight className="h-24 w-24 text-gray-700" />
      </Button>
    </div>
  );
} 