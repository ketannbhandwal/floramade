"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";

export default function FlagshipProducts({ 
  products = [], 
  heading = "OUR FLAGSHIP PRODUCTS",
  subheading = "Choose among the finest ayurvedic products."
}) {
  const baseItems = Array.isArray(products) && products.length > 0 ? products : [];

  // Ensure enough buffer items for seamless, gap-free infinite looping across all screen sizes
  const items = useMemo(() => {
    if (baseItems.length === 0) return [];
    if (baseItems.length > 1 && baseItems.length < 8) {
      const repeatCount = Math.max(3, Math.ceil(12 / baseItems.length));
      return Array.from({ length: repeatCount }, () => baseItems).flat();
    }
    return baseItems;
  }, [baseItems]);

  const isLoopable = baseItems.length > 1;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: isLoopable, 
      align: "center", 
      skipSnaps: false,
      slidesToScroll: 1,
      breakpoints: {
        "(min-width: 1024px)": { 
          align: "start",
          loop: isLoopable,
        },
      },
    },
    isLoopable ? [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })] : []
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const scrollToProduct = useCallback((dotIdx) => {
    if (!emblaApi || baseItems.length === 0) return;
    const currentSnap = emblaApi.selectedScrollSnap();
    const currentProductIdx = currentSnap % baseItems.length;
    let diff = dotIdx - currentProductIdx;
    if (diff > baseItems.length / 2) diff -= baseItems.length;
    if (diff < -baseItems.length / 2) diff += baseItems.length;
    emblaApi.scrollTo(currentSnap + diff);
  }, [emblaApi, baseItems.length]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (baseItems.length === 0) return null;

  const activeDot = baseItems.length > 0 ? selectedIndex % baseItems.length : 0;

  return (
    <section className="relative overflow-hidden py-14 sm:py-18 lg:py-22 bg-background border-t border-[#C5D5E8]/50">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 md:mb-12 text-center max-w-2xl mx-auto space-y-1.5 px-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E7EFD8] text-[#142B49] border border-[#C5D5E8] text-[11px] font-bold tracking-tight uppercase mb-1">
            <Sparkles size={12} />
            <span>Handpicked Ayurvedic Formulations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold tracking-tight text-[#1A2332] uppercase">
            {heading}
          </h2>
          {subheading && (
            <p className="text-xs sm:text-sm md:text-base text-[#1A2332]/70 font-normal tracking-tight">
              {subheading}
            </p>
          )}
        </div>

        {/* Carousel Container */}
        <div className="relative group/carousel">
          
          {/* Floating Navigation Arrows (Desktop & Tablet only to keep mobile cards unblocked) */}
          {isLoopable && (
            <>
              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={scrollPrev}
                aria-label="Previous Products"
                className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 hidden md:flex w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-[#F7F9FC] hover:bg-[#142B49] text-[#1A2332] hover:text-white border border-[#C5D5E8] shadow-lg items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={scrollNext}
                aria-label="Next Products"
                className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 hidden md:flex w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-[#F7F9FC] hover:bg-[#142B49] text-[#1A2332] hover:text-white border border-[#C5D5E8] shadow-lg items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Embla Viewport */}
          <div ref={emblaRef} className="overflow-hidden py-2 cursor-grab active:cursor-grabbing">
            <div className="flex -mx-2 sm:-mx-2.5 md:-mx-3">
              {items.map((product, index) => (
                <div
                  key={`${product._id || product.id || 'prod'}-${index}`}
                  className="min-w-0 flex-[0_0_80%] xs:flex-[0_0_75%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%] px-2 sm:px-2.5 md:px-3"
                >
                  <div className="h-full">
                    <ProductCard product={product} index={index} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Navigation: Pagination Dots + Mobile Arrow Controls */}
        {baseItems.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4">
            {/* Mobile Prev Button */}
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Previous Product"
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-[#C5D5E8] bg-[#F7F9FC] text-[#1A2332] shadow-sm active:scale-90 transition-all cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              {baseItems.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => scrollToProduct(dotIdx)}
                  aria-label={`Go to product ${dotIdx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    activeDot === dotIdx
                      ? "w-7 h-2 bg-[#142B49]"
                      : "w-2 h-2 bg-[#142B49]/20 hover:bg-[#142B49]/40"
                  }`}
                />
              ))}
            </div>

            {/* Mobile Next Button */}
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Next Product"
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-[#C5D5E8] bg-[#F7F9FC] text-[#1A2332] shadow-sm active:scale-90 transition-all cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
