"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";

export default function FlagshipProducts({ 
  products = [], 
  heading = "OUR FLAGSHIP PRODUCTS",
  subheading = "Choose among the finest ayurvedic products."
}) {
  const items = Array.isArray(products) && products.length > 0 ? products : [];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: items.length > 3, 
      align: "start", 
      skipSnaps: false,
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (items.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-14 sm:py-18 lg:py-22 bg-background border-t border-[#E8D9C5]/50">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 md:mb-12 text-center max-w-2xl mx-auto space-y-1.5 px-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#872B10]/10 text-[#872B10] text-[11px] font-bold tracking-tight uppercase mb-1">
            <Sparkles size={12} />
            <span>Handpicked Ayurvedic Formulations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold tracking-tight text-[#39160D] uppercase">
            {heading}
          </h2>
          {subheading && (
            <p className="text-xs sm:text-sm md:text-base text-[#39160D]/70 font-normal tracking-tight">
              {subheading}
            </p>
          )}
        </div>

        {/* Carousel Container */}
        <div className="relative group/carousel">
          
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous Products"
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-[#39160D] text-[#39160D] hover:text-[#FFF7EB] border border-[#E8D9C5] shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next Products"
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-[#39160D] text-[#39160D] hover:text-[#FFF7EB] border border-[#E8D9C5] shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
          >
            <ChevronRight size={20} />
          </button>

          {/* Embla Viewport */}
          <div ref={emblaRef} className="overflow-hidden py-2 px-1">
            <div className="flex -ml-3.5 sm:-ml-5 md:-ml-6">
              {items.map((product, index) => (
                <div
                  key={product._id || product.id || index}
                  className="min-w-0 flex-[0_0_80%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] pl-3.5 sm:pl-5 md:pl-6"
                >
                  <div className="h-full">
                    <ProductCard product={product} index={index} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Pagination Dots */}
        {scrollSnaps.length > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            {scrollSnaps.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => scrollTo(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  selectedIndex === dotIdx
                    ? "w-7 h-2 bg-[#872B10]"
                    : "w-2 h-2 bg-[#39160D]/20 hover:bg-[#39160D]/40"
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

