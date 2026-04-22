"use client";

import React from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import FloatingLeaf from '@/components/ui/FloatingLeaf';

const slides = [
  { mobile: "/posters/mobile1.png", desktop: "/posters/desk1.png" },
  { mobile: "/posters/mobile2.png", desktop: "/posters/desk2.png" }
];

export default function Landing() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000 })]);

  return (
    <section className="relative w-full overflow-hidden bg-background">
      {/* Decorative Leaves */}
      <FloatingLeaf 
        type="single" 
        className="w-16 h-16 md:w-24 md:h-24 top-10 left-4 md:left-10 opacity-80 rotate-[15deg]" 
        delay={0.1} 
        parallaxSpeed={50} 
      />
      <FloatingLeaf 
        type="double" 
        className="w-20 h-20 md:w-32 md:h-32 bottom-10 right-4 md:right-10 opacity-70 rotate-[-30deg]" 
        delay={0.4} 
        parallaxSpeed={-60} 
      />

      {/* Container ko fixed height dene ki jagah aspect-ratio use karein */}
      <div className="overflow-hidden w-full mt-6 aspect-[3/4] md:aspect-[16/9] lg:aspect-[21/9]" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div key={index} className="relative flex-[0_0_100%] min-w-0 h-full">
              <picture>
                <source srcSet={slide.mobile} media="(max-width: 768px)" />
                <Image 
                  src={slide.desktop} 
                  alt="Ayurveda" 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 100vw"
                  priority={index === 0}
                />
              </picture>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}