"use client";

import React from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const slides = [
  { mobile: "/posters/11.webp", desktop: "/posters/12.webp" }
];

export default function Landing() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000 })]);

  return (
    <section className="relative w-full mt-24 overflow-hidden bg-background">
      {/* Container ko fixed height dene ki jagah aspect-ratio use karein */}
      <div className="overflow-hidden w-full aspect-[3/4] md:aspect-[16/9] lg:aspect-[21/9]" ref={emblaRef}>
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