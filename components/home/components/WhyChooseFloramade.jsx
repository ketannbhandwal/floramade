"use client";

import React from "react";
import Image from "next/image";

const certificateImages = [
  { id: 1, src: "/certificate/1.svg", alt: "Floramade Quality Certified" },
  { id: 2, src: "/certificate/2.svg", alt: "Floramade Pure & Natural" },
  { id: 3, src: "/certificate/3.svg", alt: "Floramade Clinically Tested" },
  { id: 4, src: "/certificate/4.svg", alt: "Floramade Lab Tested" },
];

export default function WhyChooseFloramade() {
  return (
    <section className="w-full py-12 sm:py-16 md:py-20 bg-background relative border-t border-[#C5D5E8]/40">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Section Heading */}
        <div className="text-center mb-10 sm:mb-12 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold tracking-tight text-[#1A2332]">
            Why Choose Floramade?
          </h2>
        </div>

        {/* Certificate Badges: 2 by 2 on mobile (grid-cols-2), 4 on desktop (md:grid-cols-4) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 md:gap-14 lg:gap-16 max-w-xs sm:max-w-md md:max-w-4xl mx-auto justify-items-center items-center">
          {certificateImages.map((cert) => (
            <div
              key={cert.id}
              className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 transition-transform duration-300 hover:scale-105"
            >
              <Image
                src={cert.src}
                alt={cert.alt}
                fill
                sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, (max-width: 1024px) 128px, 144px"
                className="object-contain p-0 m-0"
                priority={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

