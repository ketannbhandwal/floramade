"use client";

import React from "react";

// Generic customizable shimmer box
export function SkeletonBox({ className = "" }) {
  return <div className={`shimmer-luxury rounded-lg ${className}`} />;
}

// 1. HERO BANNER SKELETON
export function HeroBannerSkeleton() {
  return (
    <div className="w-full relative overflow-hidden bg-[#EFE8D8] pb-6 sm:pb-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-2 sm:pt-4">
        {/* Banner Frame */}
        <div className="relative w-full aspect-[4/5] sm:aspect-[16/7] md:aspect-[21/9] lg:aspect-[24/9] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#DDD2BD]/60 shadow-sm shimmer-luxury">
          {/* Subtle overlay gradients for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#101D17]/5 via-transparent to-transparent" />
          
          {/* Bottom Indicators & Arrow Placeholders */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full shimmer-luxury-subtle border border-[#101D17]/10 ${
                  i === 1 ? "w-8" : "w-2.5"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. MARQUEE TICKER SKELETON
export function MarqueeTickerSkeleton() {
  return (
    <div className="w-full py-3 bg-[#101D17]/5 border-y border-[#DDD2BD]/50 overflow-hidden">
      <div className="flex items-center justify-around gap-6 opacity-60">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full shimmer-luxury" />
            <div className="w-24 sm:w-36 h-3 rounded shimmer-luxury" />
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. SHOP BY CONCERN SKELETON (DEPRECATED / REMOVED)
export function ShopByConcernSkeleton() {
  return null;
}

// 4. PRODUCT CARD SKELETON (Exact 1:1 Match to ProductCard.jsx)
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col h-full bg-[#EFE8D8] rounded-2xl border border-[#DDD2BD]/90 overflow-hidden shadow-xs">
      {/* 1. TOP STAGE: Warm Luxury Ivory Container Shimmer (Zero Padding) */}
      <div className="relative aspect-square w-full flex items-center justify-center bg-[#EFE8D8]">
        {/* Top-Left Pill Shimmer */}
        <div className="absolute top-3 left-3 z-10 w-24 h-4 rounded-full shimmer-luxury-subtle" />

        {/* Bottle Image Shimmer */}
        <div className="w-full h-full shimmer-luxury-subtle" />
      </div>

      {/* 2. BOTTOM STAGE: Centered Text & Info Shimmer */}
      <div className="flex flex-col flex-1 items-center justify-between bg-[#EFE8D8] p-3.5 sm:p-4 text-center">
        <div className="w-full flex flex-col items-center space-y-2">
          {/* Centered Title */}
          <div className="h-4 w-3/4 rounded shimmer-luxury" />

          {/* Centered Star Rating */}
          <div className="flex items-center justify-center gap-1">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="w-2.5 h-2.5 rounded-full shimmer-luxury" />
              ))}
            </div>
            <div className="w-14 h-3 rounded shimmer-luxury" />
          </div>

          {/* Centered Price */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-16 h-4.5 rounded shimmer-luxury" />
            <div className="w-12 h-3.5 rounded shimmer-luxury opacity-60" />
          </div>
        </div>

        {/* Add to Bag Button Shimmer */}
        <div className="pt-3 w-full">
          <div className="w-full h-8 sm:h-9 rounded-full shimmer-luxury" />
        </div>
      </div>
    </div>
  );
}

// 5. PRODUCT GRID SKELETON
export function ProductGridSkeleton({ count = 8, heading = true }) {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Heading */}
        {heading && (
          <div className="mb-8 sm:mb-10 md:mb-12 text-center max-w-2xl mx-auto space-y-2">
            <div className="h-7 sm:h-8 w-64 sm:w-80 mx-auto rounded-lg shimmer-luxury" />
            <div className="h-4 w-48 sm:w-64 mx-auto rounded shimmer-luxury opacity-70" />
          </div>
        )}

        {/* Grid: 2 cols mobile, 4 cols desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 md:gap-6">
          {Array.from({ length: count }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// 6. BENEFITS SECTION SKELETON (4 CARDS)
export function BenefitsSkeleton() {
  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-white border-t border-[#DDD2BD]/50 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-10 sm:mb-12">
          <div className="h-7 sm:h-8 w-44 mx-auto rounded-lg shimmer-luxury" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DDD2BD] shadow-xs flex flex-col items-center text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl shimmer-luxury" />
              <div className="h-5 w-32 rounded shimmer-luxury" />
              <div className="space-y-1.5 w-full">
                <div className="h-3 w-full rounded shimmer-luxury-subtle" />
                <div className="h-3 w-5/6 mx-auto rounded shimmer-luxury-subtle" />
                <div className="h-3 w-4/6 mx-auto rounded shimmer-luxury-subtle" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 7. WHY CHOOSE FLORAMADE (CERTIFICATE BADGES)
export function WhyChooseSkeleton() {
  return (
    <section className="py-12 sm:py-16 bg-background border-t border-[#DDD2BD]/40 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-10">
          <div className="h-7 sm:h-8 w-60 mx-auto rounded-lg shimmer-luxury" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 md:gap-14 max-w-xs sm:max-w-md md:max-w-4xl mx-auto justify-items-center items-center">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full shimmer-luxury border border-[#DDD2BD]/50"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// 8. TESTIMONIALS SKELETON
export function TestimonialsSkeleton() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#EFE8D8] border-t border-[#DDD2BD]/60 overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="mb-10 sm:mb-14 flex flex-col items-center text-center max-w-2xl mx-auto space-y-2.5">
          <div className="h-5 w-40 rounded-full shimmer-luxury" />
          <div className="h-8 sm:h-10 w-72 sm:w-96 rounded-lg shimmer-luxury" />
          <div className="h-4 w-60 sm:w-80 rounded shimmer-luxury-subtle" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/95 border border-[#DDD2BD] rounded-3xl p-7 sm:p-8 shadow-sm flex flex-col items-center text-center justify-between space-y-5"
            >
              <div className="flex flex-col items-center w-full space-y-3">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shimmer-luxury border-2 border-white" />
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="w-3.5 h-3.5 rounded-full shimmer-luxury" />
                  ))}
                </div>
              </div>

              <div className="space-y-2 w-full">
                <div className="h-3 w-full rounded shimmer-luxury-subtle mx-auto" />
                <div className="h-3 w-5/6 rounded shimmer-luxury-subtle mx-auto" />
                <div className="h-3 w-4/6 rounded shimmer-luxury-subtle mx-auto" />
              </div>

              <div className="pt-4 border-t border-[#101D17]/10 w-full flex flex-col items-center space-y-1.5">
                <div className="h-4 w-28 rounded shimmer-luxury" />
                <div className="h-3 w-20 rounded shimmer-luxury-subtle" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 9. FULL WEBSITE HOME SKELETON
export default function LoadingSkeleton() {
  return (
    <div className="w-full bg-white min-h-screen text-[#171717]">
      <HeroBannerSkeleton />
      <MarqueeTickerSkeleton />
      <ProductGridSkeleton count={4} />
      <BenefitsSkeleton />
      <TestimonialsSkeleton />
    </div>
  );
}
