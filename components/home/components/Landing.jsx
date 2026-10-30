"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DEFAULT_SLIDES = [
  { 
    desktop: "/posters/1.jpg", 
    mobile: "/posters/mobile1.jpg", 
    alt: "Floramade Ayurvedic wellness - Natural Health Solutions",
    href: "/collection"
  },
  { 
    desktop: "/posters/2.jpg", 
    mobile: "/posters/mobile2.jpg", 
    alt: "Floramade Natural Wellness - Most Effective Ayurvedic Solutions",
    href: "/collection"
  },
  { 
    desktop: "/posters/3.jpg", 
    mobile: "/posters/mobile3.jpg", 
    alt: "Floramade Herbal Wellness - Sugar Control & Metabolism Support",
    href: "/collection"
  },
  { 
    desktop: "/posters/4.jpg", 
    mobile: "/posters/mobile4.jpg", 
    alt: "Floramade Ayurvedic Products - 100% Pure Botanical Formulations",
    href: "/collection"
  },
];

export default function Landing({ banners }) {
  const activeSlides = Array.isArray(banners) && banners.length > 0 ? banners : DEFAULT_SLIDES;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", skipSnaps: false }, 
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );
  const [activeSlide, setActiveSlide] = useState(0);

  const goPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const goNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const updateActiveSlide = () => setActiveSlide(emblaApi.selectedScrollSnap());
    updateActiveSlide();
    emblaApi.on("select", updateActiveSlide);
    return () => emblaApi.off("select", updateActiveSlide);
  }, [emblaApi]);

  return (
    <section aria-label="Floramade featured banners" className="w-full relative overflow-hidden p-0 m-0 -mt-1 sm:mt-0">
      <h1 className="sr-only">Floramade Ayurvedic wellness</h1>
      
      {/* Full-width Banner Container with Zero Padding */}
      <div className="group relative w-full overflow-hidden bg-[#101D17]">
        <div 
          className="overflow-hidden w-full aspect-[1587/2245] md:aspect-[1700/780]" 
          ref={emblaRef}
        >
          <div className="flex h-full w-full">
            {activeSlides.map((slide, index) => (
              <div 
                key={slide.desktop || index} 
                className="relative h-full w-full min-w-0 flex-[0_0_100%]"
              >
                <Link 
                  href={slide.href || "/collection"} 
                  className="block relative h-full w-full cursor-pointer focus:outline-none"
                  tabIndex={activeSlide === index ? 0 : -1}
                >
                  <div className="absolute inset-0 block h-full w-full">
                    {slide.mobile ? (
                      <>
                        <div className="relative md:hidden w-full h-full">
                          <Image 
                            src={slide.mobile} 
                            alt={slide.alt || "Floramade banner"} 
                            fill 
                            priority={index === 0} 
                            quality={80}
                            sizes="100vw" 
                            className="object-cover object-center w-full h-full" 
                          />
                        </div>
                        <div className="relative hidden md:block w-full h-full">
                          <Image 
                            src={slide.desktop || slide.mobile} 
                            alt={slide.alt || "Floramade banner"} 
                            fill 
                            priority={index === 0} 
                            quality={85}
                            sizes="100vw" 
                            className="object-cover object-center w-full h-full" 
                          />
                        </div>
                      </>
                    ) : (
                      <Image 
                        src={slide.desktop} 
                        alt={slide.alt || "Floramade banner"} 
                        fill 
                        priority={index === 0} 
                        quality={85}
                        sizes="100vw" 
                        className="object-cover object-center w-full h-full" 
                      />
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        {activeSlides.length > 1 && (
          <>
            <button 
              aria-label="Previous banner" 
              onClick={goPrev} 
              className="absolute left-2 sm:left-4 md:left-6 top-1/2 flex h-9 w-9 sm:h-11 sm:w-11 md:h-12 md:w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#101D17]/70 text-white backdrop-blur-md opacity-75 hover:opacity-100 hover:bg-[#101D17] hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl z-20 md:opacity-0 md:group-hover:opacity-100 border border-white/20"
            >
              <ChevronLeft size={22} className="sm:w-6 sm:h-6" />
            </button>
            <button 
              aria-label="Next banner" 
              onClick={goNext} 
              className="absolute right-2 sm:right-4 md:right-6 top-1/2 flex h-9 w-9 sm:h-11 sm:w-11 md:h-12 md:w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#101D17]/70 text-white backdrop-blur-md opacity-75 hover:opacity-100 hover:bg-[#101D17] hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl z-20 md:opacity-0 md:group-hover:opacity-100 border border-white/20"
            >
              <ChevronRight size={22} className="sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Pagination Dots */}
        {activeSlides.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 md:bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#101D17]/75 px-3 py-1.5 backdrop-blur-md z-20 border border-white/20">
            {activeSlides.map((slide, index) => (
              <button
                key={slide.desktop || index}
                aria-label={`Show banner ${index + 1}`}
                aria-current={activeSlide === index ? "true" : undefined}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  activeSlide === index 
                    ? "w-6 sm:w-8 bg-white shadow-[0_0_8px_rgba(255,247,235,0.7)]" 
                    : "w-1.5 sm:w-2 bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
