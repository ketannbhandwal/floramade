"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Star, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

const REVIEWS = [
  {
    id: 1,
    name: "Mr. Shivansh",
    role: "Verified Customer",
    location: "Delhi",
    rating: 5,
    tag: "Overall Health",
    text: "Maine 4 months se Floramade products use kiye hain aur results bahut impressive hain. Mera overall health improve ho gaya hai aur energy level bhi stable hai. Natural formulation pe completely trust karta hoon.",
    img: "/review/16.jpeg",
    initials: "S",
  },
  {
    id: 2,
    name: "Mr. Vijay Kumar",
    role: "Verified Customer",
    location: "Jaipur",
    rating: 5,
    tag: "Digestion",
    text: "Excellent products hain. Maine 2 months se use kar raha hoon aur digestion mein bahut improvement dekha. Pure ingredients hain aur koi side effects nahi. Highly recommend karta hoon.",
    img: "/review/1.jpeg",
    initials: "VK",
  },
  {
    id: 3,
    name: "Mrs. Badama Devi",
    role: "Verified Customer",
    location: "Haryana",
    rating: 5,
    tag: "Sugar Balance",
    text: "Bahut acche results mile hain. Sugar control ke liye best hai. Doctor ne bhi recommend kiya tha. Regular use karne se bahut fayda hua hai. Quality outstanding hai.",
    img: "/review/2.jpeg",
    initials: "BD",
  },
  {
    id: 4,
    name: "Mr. Rajneesh",
    role: "Verified Customer",
    location: "Lucknow",
    rating: 5,
    tag: "Gut Health",
    text: "Digestion ke liye excellent hai. Ab bloating nahi hoti! Digestive issues se years se struggle kar raha tha, aur ye products lifesaver nikle. Har meal ke baad lighter aur comfortable feel karta hoon.",
    img: "/review/4.jpeg",
    initials: "R",
  },
  {
    id: 5,
    name: "Mr. Birender Kumar",
    role: "Verified Customer",
    location: "Punjab",
    rating: 5,
    tag: "Metabolism",
    text: "Main 3 months se Floramade products use kar raha hoon aur mera blood sugar level bahut improve ho gaya hai. Natural ingredients hain toh mind bhi peaceful rehta hai, aur ab mid-day mein energy crash nahi hota.",
    img: "/review/15.jpeg",
    initials: "BK",
  },
  {
    id: 6,
    name: "Mr. Jamuna Bhardwaj",
    role: "Verified Customer",
    location: "Chandigarh",
    rating: 5,
    tag: "Vitality",
    text: "2 weeks ke baad results bahut acche mil rahe hain. Mere sugar cravings kam ho gaye hain aur poora din energetic feel karta hoon. Products use karne mein easy hain aur koi bad taste nahi hai.",
    img: "/review/14.jpeg",
    initials: "JB",
  },
  {
    id: 7,
    name: "Mrs. Sunita Sharma",
    role: "Verified Customer",
    location: "Indore",
    rating: 5,
    tag: "Sugar Control",
    text: "MadhuCurex powder use karne ke baad fasting sugar readings me constant stability aayi hai. Ayurvedic jadibootiyan bilkul authentic hain aur packaging bhi premium hai. Bahut satisfied hoon.",
    img: "/review/3.jpeg",
    initials: "SS",
  },
  {
    id: 8,
    name: "Mr. Amit Patel",
    role: "Verified Customer",
    location: "Ahmedabad",
    rating: 5,
    tag: "Piles Relief",
    text: "Pilecurex powder se 1 week me hi jalan aur pain me rahat mil gayi. Surgery se darr lag raha tha par is natural formula ne kamaal ka kaam kiya. Thank you Floramade!",
    img: "/review/5.jpeg",
    initials: "AP",
  },
];

export default function Review({ pretitle, title, subtitle, testimonials }) {
  const items = Array.isArray(testimonials) && testimonials.length > 0 ? testimonials : REVIEWS;
  const pre = pretitle || "Kind Words From Our Community";
  const mainTitle = title || "Wellness stories, shared.";
  const sub = subtitle || "Real experiences from people who made Floramade a part of their daily wellness journey.";

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: items.length > 2, 
      align: "start", 
      skipSnaps: false,
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })]
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
    <section className="relative overflow-hidden border-t border-[#39160D]/10 bg-[#F5EADB]/45 px-4 py-14 sm:px-6 sm:py-18 lg:py-20">
      <div className="mx-auto max-w-[1360px]">
        {/* Header Section - Pure Sans, Tracking Tight, No Italic, No Serif */}
        <div className="mb-8 sm:mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-block mb-2 text-xs font-bold uppercase tracking-tight text-[#872B10]">
              {pre}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold tracking-tight text-[#39160D] leading-tight">
              {mainTitle}
            </h2>
            <p className="mt-2 text-xs sm:text-sm md:text-base text-[#39160D]/75 tracking-tight font-normal">
              {sub}
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Previous testimonial"
              className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-[#39160D]/20 bg-[#FFF7EB] text-[#39160D] transition-all hover:bg-[#39160D] hover:text-[#FFF7EB] hover:scale-105 active:scale-95 shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Next testimonial"
              className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-[#39160D]/20 bg-[#FFF7EB] text-[#39160D] transition-all hover:bg-[#39160D] hover:text-[#FFF7EB] hover:scale-105 active:scale-95 shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Embla Smooth Slider */}
        <div className="overflow-hidden cursor-grab active:cursor-grabbing -mx-4 px-4 sm:mx-0 sm:px-0" ref={emblaRef}>
          <div className="flex -ml-4 sm:-ml-5">
            {items.map((rev, idx) => (
              <div
                key={rev.id || idx}
                className="min-w-0 flex-[0_0_88%] xs:flex-[0_0_80%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4 sm:pl-5"
              >
                <div className="h-full flex flex-col justify-between rounded-3xl border border-[#39160D]/10 bg-[#FFF7EB] p-6 sm:p-7 shadow-[0_6px_24px_rgba(57,22,13,0.06)] hover:shadow-[0_12px_32px_rgba(57,22,13,0.12)] hover:-translate-y-1 transition-all duration-300">
                  {/* Top Bar: Stars + Tag */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={15} fill="#872B10" className="text-[#872B10]" />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-[#872B10] uppercase tracking-tight bg-[#872B10]/10 px-2.5 py-0.5 rounded-full">
                        {rev.tag}
                      </span>
                    </div>

                    {/* Review Body - Clean Sans, Tracking Tight, No Italic */}
                    <p className="text-xs sm:text-sm leading-relaxed text-[#39160D]/85 tracking-tight font-normal mb-6">
                      "{rev.text}"
                    </p>
                  </div>

                  {/* Customer Info Footer */}
                  <div className="flex items-center gap-3 pt-4 border-t border-[#39160D]/10">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0 bg-[#39160D]/10">
                      {rev.img ? (
                        <Image
                          src={rev.img}
                          alt={rev.name}
                          fill
                          unoptimized
                          className="object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-xs text-[#39160D]">
                          {rev.initials}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs sm:text-sm font-bold text-[#39160D] tracking-tight truncate">
                          {rev.name}
                        </h3>
                        <CheckCircle2 size={13} className="text-[#2E6930] flex-shrink-0" />
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#39160D]/60 tracking-tight font-medium">
                        <span>{rev.role}</span>
                        <span>•</span>
                        <span>{rev.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="mt-8 sm:mt-10 flex items-center justify-center gap-2">
          {scrollSnaps.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                selectedIndex === idx
                  ? "w-8 bg-[#39160D]"
                  : "w-2 bg-[#39160D]/25 hover:bg-[#39160D]/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
