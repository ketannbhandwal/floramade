"use client";

import React from "react";

// Generic customizable shimmer box
export function SkeletonBox({ className = "" }) {
  return <div className={`shimmer-luxury rounded-lg ${className}`} />;
}

// 1. HERO BANNER SKELETON
export function HeroBannerSkeleton() {
  return (
    <div className="w-full relative overflow-hidden bg-[#FFF7EB] pb-6 sm:pb-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-2 sm:pt-4">
        {/* Banner Frame */}
        <div className="relative w-full aspect-[4/5] sm:aspect-[16/7] md:aspect-[21/9] lg:aspect-[24/9] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E8D9C5]/60 shadow-sm shimmer-luxury">
          {/* Subtle overlay gradients for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#39160D]/5 via-transparent to-transparent" />
          
          {/* Bottom Indicators & Arrow Placeholders */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full shimmer-luxury-subtle border border-[#39160D]/10 ${
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
    <div className="w-full py-3 bg-[#39160D]/5 border-y border-[#E8D9C5]/50 overflow-hidden">
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

// 3. SHOP BY CONCERN SKELETON (6 ARCH DOMES)
export function ShopByConcernSkeleton() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-background overflow-hidden border-b border-[#E8D9C5]/40">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Section Heading */}
        <div className="text-center mb-8 sm:mb-12 max-w-xl mx-auto space-y-2">
          <div className="h-3 w-28 mx-auto rounded-full shimmer-luxury" />
          <div className="h-7 sm:h-8 w-56 sm:w-72 mx-auto rounded-lg shimmer-luxury" />
        </div>

        {/* 6 Arch Dome Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 md:gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="group relative flex flex-col items-center p-3 sm:p-4 rounded-t-[54px] rounded-b-2xl border border-[#E8D9C5]/60 bg-[#FFF7EB] shadow-xs space-y-3"
            >
              {/* Arch Dome Top Image Area */}
              <div className="w-full aspect-[4/5] rounded-t-[44px] rounded-b-xl shimmer-luxury-subtle flex items-center justify-center p-2 border border-[#E8D9C5]/40">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full shimmer-luxury" />
              </div>
              {/* Card Label */}
              <div className="w-20 sm:w-24 h-3.5 rounded shimmer-luxury" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 4. PRODUCT CARD SKELETON (Exact 1:1 Match to ProductCard.jsx)
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col h-full bg-transparent rounded-2xl border border-[#E8D9C5] overflow-hidden shadow-xs">
      {/* 1. TOP STAGE: Natural Background + Bottle Area */}
      <div className="relative aspect-square w-full p-4 sm:p-5 flex items-center justify-center bg-transparent">
        {/* Top-Right Badges: Discount Tag & Wishlist Circle */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          <div className="w-16 h-5 rounded shimmer-luxury" />
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shimmer-luxury border border-[#E8D9C5]" />
        </div>

        {/* Bottle Image Shimmer */}
        <div className="w-3/5 h-4/5 rounded-2xl shimmer-luxury-subtle" />
      </div>

      {/* 2. BOTTOM STAGE: Text & Action Area */}
      <div className="flex flex-col flex-1 justify-between bg-white/60 backdrop-blur-sm p-4 sm:p-5 border-t border-[#E8D9C5]/70 space-y-3">
        <div className="space-y-2">
          {/* Title Lines */}
          <div className="h-4 sm:h-4.5 w-4/5 rounded shimmer-luxury" />
          <div className="h-4 w-3/5 rounded shimmer-luxury" />

          {/* Star Rating Line */}
          <div className="flex items-center gap-1.5 pt-1">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="w-3 h-3 rounded-full shimmer-luxury" />
              ))}
            </div>
            <div className="w-6 h-3 rounded shimmer-luxury" />
            <div className="w-16 h-3 rounded shimmer-luxury" />
          </div>

          {/* Price Line */}
          <div className="flex items-baseline gap-2 pt-1">
            <div className="w-16 sm:w-20 h-5 sm:h-6 rounded shimmer-luxury" />
            <div className="w-12 h-3.5 rounded shimmer-luxury opacity-60" />
          </div>

          {/* Trust Line */}
          <div className="w-36 h-3 rounded shimmer-luxury opacity-70" />
        </div>

        {/* Rounded Add to Bag Button */}
        <div className="w-full h-10 sm:h-11 rounded-full shimmer-luxury" />
      </div>
    </div>
  );
}

// 5. PRODUCT GRID SKELETON
export function ProductGridSkeleton({ count = 4, heading = true }) {
  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-background overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Heading */}
        {heading && (
          <div className="mb-8 sm:mb-10 md:mb-12 text-center max-w-2xl mx-auto space-y-2">
            <div className="h-7 sm:h-8 w-64 sm:w-80 mx-auto rounded-lg shimmer-luxury" />
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
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
    <section className="py-14 sm:py-16 lg:py-20 bg-[#FFF7EB] border-t border-[#E8D9C5]/50 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-10 sm:mb-12">
          <div className="h-7 sm:h-8 w-44 mx-auto rounded-lg shimmer-luxury" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8D9C5] shadow-xs flex flex-col items-center text-center space-y-4"
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
    <section className="py-12 sm:py-16 bg-background border-t border-[#E8D9C5]/40 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-10">
          <div className="h-7 sm:h-8 w-60 mx-auto rounded-lg shimmer-luxury" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 md:gap-14 max-w-xs sm:max-w-md md:max-w-4xl mx-auto justify-items-center items-center">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full shimmer-luxury border border-[#E8D9C5]/50"
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
    <section className="py-14 sm:py-18 lg:py-20 bg-[#F5EADB]/45 border-t border-[#39160D]/10 overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-3 w-36 rounded shimmer-luxury" />
            <div className="h-7 sm:h-9 w-64 sm:w-80 rounded-lg shimmer-luxury" />
            <div className="h-4 w-72 sm:w-96 rounded shimmer-luxury-subtle" />
          </div>
          <div className="flex gap-2">
            <div className="w-10 h-10 rounded-full shimmer-luxury" />
            <div className="w-10 h-10 rounded-full shimmer-luxury" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#FFF7EB] border border-[#39160D]/10 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="w-3.5 h-3.5 rounded-full shimmer-luxury" />
                  ))}
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-full rounded shimmer-luxury-subtle" />
                  <div className="h-3 w-full rounded shimmer-luxury-subtle" />
                  <div className="h-3 w-4/5 rounded shimmer-luxury-subtle" />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[#39160D]/10">
                <div className="w-11 h-11 rounded-full shimmer-luxury border border-[#39160D]/15" />
                <div className="space-y-1">
                  <div className="h-3.5 w-24 rounded shimmer-luxury" />
                  <div className="h-2.5 w-16 rounded shimmer-luxury-subtle" />
                </div>
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
    <div className="w-full bg-[#FFF7EB] min-h-screen text-[#39160D]">
      <HeroBannerSkeleton />
      <MarqueeTickerSkeleton />
      <ShopByConcernSkeleton />
      <ProductGridSkeleton count={4} />
      <BenefitsSkeleton />
      <WhyChooseSkeleton />
      <TestimonialsSkeleton />
    </div>
  );
}
