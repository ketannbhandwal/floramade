"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

// Rich botanical palm leaf fronds for badge corners matching the reference design
function PalmCornerFrond({ flip = false }) {
  return (
    <svg
      viewBox="0 0 70 50"
      className={`w-7 h-5 sm:w-8 sm:h-6 pointer-events-none absolute -bottom-1 z-10 transition-transform duration-300 ${
        flip ? "-right-2 -scale-x-100" : "-left-2"
      }`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background soft shadow for depth */}
      <path
        d="M6 46 C16 38, 32 26, 62 14"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Main Curved Stem */}
      <path
        d="M4 48 C14 39, 30 26, 60 14"
        stroke="#1E4720"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Leaflet 1 - Lowest outer leaf */}
      <path
        d="M6 46 C14 44, 26 42, 44 42 C30 45, 18 47, 6 46 Z"
        fill="#2E6930"
      />
      {/* Leaflet 2 - Lower middle leaf */}
      <path
        d="M6 46 C16 40, 32 34, 56 31 C40 37, 24 43, 6 46 Z"
        fill="#3D8240"
      />
      {/* Leaflet 3 - Center long frond */}
      <path
        d="M6 46 C18 36, 36 24, 66 18 C48 25, 26 38, 6 46 Z"
        fill="#4A994E"
      />
      {/* Leaflet 4 - Upper middle leaf */}
      <path
        d="M6 46 C15 32, 28 18, 54 10 C38 18, 22 34, 6 46 Z"
        fill="#39793C"
      />
      {/* Leaflet 5 - Top tip leaf */}
      <path
        d="M6 46 C12 30, 22 14, 38 4 C28 14, 16 32, 6 46 Z"
        fill="#55A859"
      />
    </svg>
  );
}

export default function ShopByConcern({ concerns = [] }) {
  if (!concerns || concerns.length === 0) return null;

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 bg-[#FFF7EB] relative border-b border-[#E8D9C5]/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold tracking-tight text-[#39160D] capitalize">
            Shop By Concern
          </h2>
          <div className="w-16 h-0.5 bg-[#DFC77F] mx-auto mt-2 rounded-full" />
        </div>

        {/* 6 Arch Dome Cards Grid: 2 by 2 on mobile (grid-cols-2), 3 on tablet, 6 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5 sm:gap-4 md:gap-5 items-end">
          {concerns.map((concern, idx) => {
            const href = concern.href || `/collection?concern=${encodeURIComponent(concern.title)}`;
            const bg = concern.bgColor || "#39160D";

            return (
              <Link
                key={concern.id || idx}
                href={href}
                className="group w-full flex flex-col items-center cursor-pointer select-none focus:outline-none"
              >
                {/* Arch Dome Container */}
                <div 
                  className="relative w-full aspect-[1/1.32] rounded-t-[70px] xs:rounded-t-[80px] sm:rounded-t-[90px] md:rounded-t-[100px] overflow-hidden shadow-[0_8px_24px_rgba(57,22,13,0.14)] group-hover:shadow-[0_12px_32px_rgba(57,22,13,0.24)] transition-all duration-300 flex items-end justify-center border border-[#DFC77F]/30"
                  style={{ backgroundColor: bg }}
                >
                  {/* Subtle Lighting Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-white/10 pointer-events-none z-0" />
                  
                  {/* Soft Radial Base Shadow beneath the bottle at contact line */}
                  <div className="absolute bottom-5 sm:bottom-6 md:bottom-7 left-1/2 -translate-x-1/2 w-[72%] h-3.5 bg-black/40 blur-[3px] rounded-full pointer-events-none z-10" />

                  {/* Bottle Display Area */}
                  <div className="relative w-full h-[90%] sm:h-[92%] md:h-[95%] z-10 flex items-end justify-center px-2 pb-0">
                    {concern.image ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={concern.image}
                          alt={concern.title || "Ayurvedic product"}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 160px, (max-width: 1024px) 200px, 240px"
                          className="object-contain object-bottom drop-shadow-[0_12px_22px_rgba(0,0,0,0.45)] group-hover:scale-108 transition-transform duration-500 ease-out"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#FFF7EB]/40 text-xs font-semibold">
                        No image
                      </div>
                    )}
                  </div>
                </div>

                {/* Overlapping Bottom Label Pill */}
                <div className="relative -mt-6 sm:-mt-7 md:-mt-8 z-20 w-[94%] bg-white/95 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-[0_6px_18px_rgba(57,22,13,0.16)] border border-[#DFC77F]/40 py-2 sm:py-2.5 px-2 text-center group-hover:border-[#872B10] group-hover:bg-white group-hover:shadow-[0_8px_24px_rgba(57,22,13,0.22)] transition-all duration-300">
                  {/* Lush Botanical Palm Leaf Accents */}
                  <PalmCornerFrond flip={false} />
                  <PalmCornerFrond flip={true} />

                  <span className="block text-[11px] sm:text-xs md:text-[13px] font-bold text-[#39160D] group-hover:text-[#872B10] uppercase tracking-tight transition-colors duration-200 px-1">
                    {concern.title}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
