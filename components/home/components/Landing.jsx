"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';
import { Leaf, ArrowRight, FlaskConical, UserCheck } from 'lucide-react';

const slides = [
  { 
    mobile: "/posters/mobile1.png", 
    desktop: "/posters/desk1.png",
    title: "Embrace Natural Wellness with Fiveetatva",
    subtitle: "Pure by Nature, Effective by Science",
    description: "Ayurvedic solutions for a healthier, happier you. Made with pure herbs. Backed by tradition.",
    primaryCTA: "Shop Now",
    secondaryCTA: "Know More"
  },
  { 
    mobile: "/posters/mobile2.png", 
    desktop: "/posters/desktop2.png",
    title: "Balance Your Elements with Ayurveda",
    subtitle: "Traditional Wisdom, Modern Life",
    description: "Discover the power of five elements to restore your body's natural harmony and vitality.",
    primaryCTA: "View Collection",
    secondaryCTA: "Learn More"
  }
];

export default function Landing() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

  return (
    <section className="relative w-full overflow-hidden bg-background">
      <div className="overflow-hidden w-full aspect-[3/4] md:aspect-[3/1]" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div key={index} className="relative flex-[0_0_100%] min-w-0 h-full">
              {/* Background Image */}
              <picture>
                <source srcSet={`${slide.mobile}?v=2`} media="(max-width: 768px)" />
                <Image 
                  src={`${slide.desktop}?v=2`} 
                  alt={slide.title} 
                  fill 
                  className="object-cover"
                  sizes="100vw"
                  priority={index === 0}
                />
              </picture>

              {/* Desktop Content Overlay */}
              <div className="absolute inset-0 z-10 hidden md:flex items-center">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 w-full">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-xl space-y-6"
                  >
                    <div className="space-y-3">
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-[#658518] font-medium tracking-[0.15em] uppercase text-sm"
                      >
                        {slide.subtitle}
                      </motion.p>
                      
                      <h1 className="text-5xl lg:text-6xl font-display text-[#2b2b2b] leading-[1.1] font-bold">
                        {slide.title.split('Fiveetatva')[0]}
                        <span className="text-[#e2b826]">Fiveetatva</span>
                      </h1>

                      <p className="text-[#4b4b4b] text-lg font-light leading-relaxed max-w-sm">
                        {slide.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-5 pt-2">
                      <Link 
                        href="#product"
                        className="bg-[#658518] text-white px-8 py-3.5 rounded-lg font-medium flex items-center gap-2 hover:bg-[#546e14] transition-all shadow-xl shadow-green-900/10 active:scale-95 text-sm"
                      >
                        {slide.primaryCTA}
                        <ArrowRight size={16} />
                      </Link>
                      <Link 
                        href="/about"
                        className="border border-[#658518]/20 text-[#658518] px-8 py-3.5 rounded-lg font-medium hover:bg-[#658518]/5 transition-all active:scale-95 text-sm"
                      >
                        
                        {slide.secondaryCTA}
                      </Link>
                    </div>

                    {/* Features row - Clean & Minimal */}
                    <div className="flex items-center gap-8 pt-8 border-t border-black/5">
                      <div className="flex items-center gap-2.5">
                        <Leaf size={16} className="text-[#658518]" />
                        <span className="text-xs font-medium text-[#4b4b4b]/70 uppercase tracking-wider">100% Natural</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <FlaskConical size={16} className="text-[#658518]" />
                        <span className="text-xs font-medium text-[#4b4b4b]/70 uppercase tracking-wider">No Chemicals</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <UserCheck size={16} className="text-[#658518]" />
                        <span className="text-xs font-medium text-[#4b4b4b]/70 uppercase tracking-wider">Ayurvedic</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}