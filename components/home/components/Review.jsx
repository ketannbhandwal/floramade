"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Star, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

const REVIEWS = [
  {
    id: 1,
    name: "Vishal Khanna",
    role: "Verified Customer",
    location: "Delhi, India",
    rating: 5,
    tag: "ENERGY & VITALITY",
    text: "I've been using Floramade Ashwagandha Tablets for about six months now, and I must say, it's been a game-changer for me. As someone who juggles a demanding job, family responsibilities, and a desire for overall well-being, finding a natural solution that addresses various aspects of health was crucial for me.",
    img: "/review/16.jpeg",
    initials: "VK",
  },
  {
    id: 2,
    name: "Sameer Kumar",
    role: "Verified Customer",
    location: "Jaipur, India",
    rating: 5,
    tag: "SUGAR & METABOLISM",
    text: "One of the standout benefits for me has been the steady balance in daily energy and blood sugar levels. The adaptogenic properties of natural herbs are evident in their ability to combat both physical and mental exhaustion without any jitters or crashes associated with other supplements.",
    img: "/review/1.jpeg",
    initials: "SK",
  },
  {
    id: 3,
    name: "Nishant Verma",
    role: "Verified Customer",
    location: "Lucknow, India",
    rating: 5,
    tag: "DIGESTIVE HEALTH",
    text: "I can confidently say that they've had a positive impact on my overall health and well-being. As someone who values natural solutions, the blend of ingredients in these tablets caught my attention, and the results have been truly impressive.",
    img: "/review/4.jpeg",
    initials: "NV",
  },
  {
    id: 4,
    name: "Mrs. Sunita Sharma",
    role: "Verified Customer",
    location: "Indore, India",
    rating: 5,
    tag: "SUGAR CONTROL",
    text: "MadhuCurex powder use karne ke baad fasting sugar readings me constant stability aayi hai. Ayurvedic jadibootiyan bilkul authentic hain aur packaging bhi premium hai. Bahut satisfied hoon.",
    img: "/review/3.jpeg",
    initials: "SS",
  },
  {
    id: 5,
    name: "Mr. Amit Patel",
    role: "Verified Customer",
    location: "Ahmedabad, India",
    rating: 5,
    tag: "PILES RELIEF",
    text: "Pilecurex powder se 1 week me hi jalan aur pain me rahat mil gayi. Surgery se darr lag raha tha par is natural formula ne kamaal ka kaam kiya. Thank you Floramade!",
    img: "/review/5.jpeg",
    initials: "AP",
  },
  {
    id: 6,
    name: "Mrs. Badama Devi",
    role: "Verified Customer",
    location: "Haryana, India",
    rating: 5,
    tag: "SUGAR BALANCE",
    text: "Bahut acche results mile hain. Sugar control ke liye best hai. Doctor ne bhi recommend kiya tha. Regular use karne se bahut fayda hua hai. Quality outstanding hai.",
    img: "/review/2.jpeg",
    initials: "BD",
  },
  {
    id: 7,
    name: "Mr. Birender Kumar",
    role: "Verified Customer",
    location: "Punjab, India",
    rating: 5,
    tag: "METABOLISM",
    text: "Main 3 months se Floramade products use kar raha hoon aur mera blood sugar level bahut improve ho gaya hai. Natural ingredients hain toh mind bhi peaceful rehta hai, aur ab mid-day mein energy crash nahi hota.",
    img: "/review/15.jpeg",
    initials: "BK",
  },
  {
    id: 8,
    name: "Mr. Jamuna Bhardwaj",
    role: "Verified Customer",
    location: "Chandigarh, India",
    rating: 5,
    tag: "VITALITY",
    text: "2 weeks ke baad results bahut acche mil rahe hain. Mere sugar cravings kam ho gaye hain aur poora din energetic feel karta hoon. Products use karne mein easy hain aur koi bad taste nahi hai.",
    img: "/review/14.jpeg",
    initials: "JB",
  },
];

export default function Review({ pretitle, title, subtitle, testimonials }) {
  const items = Array.isArray(testimonials) && testimonials.length > 0 ? testimonials : REVIEWS;
  const pre = pretitle || "REAL STORIES & REVIEWS";
  const mainTitle = title || "What Our Customers Are Saying";
  const sub = subtitle || "Customer satisfaction is our #1 priority";

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: items.length > 2, 
      align: "center", 
      containScroll: false,
      skipSnaps: false,
      slidesToScroll: 1,
      breakpoints: {
        "(min-width: 1024px)": { align: "start" },
      },
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

  return (
    <section className="relative overflow-hidden border-t border-[#E0D9C8]/60 bg-[#F8F4E9] px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1360px]">
        {/* Centered Header Section - Matches Reference 1:1 with Elevated Floramade Style */}
        <div className="mb-10 sm:mb-14 text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 mb-2.5 text-[11px] sm:text-xs font-bold uppercase tracking-tight text-[#101D17] bg-[#101D17]/10 px-3.5 py-1 rounded-full border border-[#101D17]/15">
            🌿 {pre}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold tracking-tight text-[#171717] leading-tight">
            {mainTitle}
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm md:text-base text-[#171717]/75 tracking-tight font-normal">
            {sub}
          </p>
        </div>

        {/* Carousel Container with Desktop Floating Arrow Buttons */}
        <div className="relative">
          {/* Floating Left Arrow (Desktop) */}
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous testimonial"
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-11 w-11 items-center justify-center rounded-full border border-[#E0D9C8] bg-[#F8F4E9] text-[#171717] shadow-md hover:bg-[#101D17] hover:text-white hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Embla Smooth Slider */}
          <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex -mx-2.5 sm:-mx-3">
              {items.map((rev, idx) => (
                <div
                  key={rev.id || idx}
                  className="min-w-0 flex-[0_0_84%] xs:flex-[0_0_80%] sm:flex-[0_0_55%] lg:flex-[0_0_33.333%] px-2.5 sm:px-3"
                >
                  {/* Testimonial Card - Centered Avatar at Top, Centered Text, Centered Signature */}
                  <div className="h-full flex flex-col justify-between items-center text-center rounded-3xl border border-[#E0D9C8] bg-[#F8F4E9] p-7 sm:p-8 shadow-[0_4px_20px_rgba(18,61,43,0.04)] hover:shadow-[0_14px_36px_rgba(18,61,43,0.10)] hover:-translate-y-1 transition-all duration-300">
                    
                    {/* Top Section: Centered Customer Avatar + 5 Golden Stars */}
                    <div className="w-full flex flex-col items-center">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white shadow-md mx-auto mb-4 bg-[#F8F4E9] flex-shrink-0 ring-2 ring-[#D4AF55]/30">
                        {rev.img ? (
                          <Image
                            src={rev.img}
                            alt={rev.name}
                            fill
                            sizes="80px"
                            quality={80}
                            className="object-cover object-top"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-base text-[#171717] bg-[#E0D9C8]/40">
                            {rev.initials || rev.name?.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* 5 Amber/Gold Rating Stars */}
                      <div className="flex items-center justify-center gap-1 mb-4">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    {/* Middle Section: Centered Authentic Testimonial Quote */}
                    <p className="text-xs sm:text-sm md:text-[14.5px] leading-relaxed text-[#171717]/85 tracking-tight font-normal text-center mb-6 px-1 flex-grow">
                      "{rev.text}"
                    </p>

                    {/* Bottom Section: Centered Author Signature — Name + Verified Badge */}
                    <div className="pt-4 border-t border-[#101D17]/10 w-full text-center">
                      <p className="text-xs sm:text-sm md:text-[15px] font-bold text-[#171717] tracking-tight">
                        — {rev.name}
                      </p>
                      <div className="flex items-center justify-center gap-1 text-[11px] text-[#101D17] font-semibold tracking-tight uppercase mt-1">
                        <CheckCircle2 size={12} className="text-[#2E6930] flex-shrink-0" />
                        <span>{rev.role || "Verified Buyer"}</span>
                        {rev.location && (
                          <>
                            <span className="text-[#171717]/30">•</span>
                            <span className="text-[#171717]/60 normal-case font-normal">{rev.location}</span>
                          </>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Right Arrow (Desktop) */}
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next testimonial"
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-11 w-11 items-center justify-center rounded-full border border-[#E0D9C8] bg-[#F8F4E9] text-[#171717] shadow-md hover:bg-[#101D17] hover:text-white hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Bottom Navigation: Pagination Dots + Mobile Arrow Controls */}
        <div className="mt-8 sm:mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous testimonial"
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-[#E0D9C8] bg-[#F8F4E9] text-[#171717] shadow-sm active:scale-90"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-2">
            {scrollSnaps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollTo(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  selectedIndex === idx
                    ? "w-8 bg-[#101D17]"
                    : "w-2 bg-[#101D17]/25 hover:bg-[#101D17]/50"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next testimonial"
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-[#E0D9C8] bg-[#F8F4E9] text-[#171717] shadow-sm active:scale-90"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}