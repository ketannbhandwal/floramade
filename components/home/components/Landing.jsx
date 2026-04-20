"use client";

import React from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const slides = [
  { image: "/posters/1.webp" },
  { image: "/posters/2.webp" },
  { image: "/posters/3.webp" }
];

export default function Landing() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000 })]);

  return (
    <section className="relative w-full mt-12 overflow-hidden bg-background">
      {/* Container ko fixed height dene ki jagah aspect-ratio use karein */}
      <div className="overflow-hidden w-full aspect-[16/9] md:aspect-[21/9]" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div key={index} className="relative flex-[0_0_100%] min-w-0 h-full">
              <Image 
                src={slide.image} 
                alt="Ayurveda" 
                fill 
                className="object-cover" // Desktop par cover sahi lagega
                sizes="(max-width: 768px) 100vw, 100vw"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}