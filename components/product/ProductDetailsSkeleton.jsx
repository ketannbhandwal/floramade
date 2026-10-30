"use client";

import React from "react";

export default function ProductDetailsSkeleton() {
  return (
    <div className="w-full bg-white text-[#123838] pb-12 pt-24 md:pt-32 lg:pt-36">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Breadcrumb Shimmer */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-3 w-12 rounded shimmer-luxury" />
          <span className="text-[#123838]/20">/</span>
          <div className="h-3 w-20 rounded shimmer-luxury" />
          <span className="text-[#123838]/20">/</span>
          <div className="h-3 w-36 rounded shimmer-luxury" />
        </div>

        {/* 2-Column Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
          
          {/* Left Column: Image Gallery Shimmer */}
          <div className="w-full flex flex-col gap-4">
            {/* Main Stage */}
            <div className="relative aspect-square w-full max-w-[540px] mx-auto rounded-3xl overflow-hidden border border-[#DCE8E8] shimmer-luxury-subtle flex items-center justify-center p-8 shadow-sm">
              <div className="w-3/5 h-4/5 rounded-2xl shimmer-luxury" />
            </div>

            {/* Thumbnails Row */}
            <div className="flex gap-3 justify-center">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-[#DCE8E8] shimmer-luxury-subtle"
                />
              ))}
            </div>
          </div>

          {/* Right Column: Details & Buy Actions Shimmer */}
          <div className="flex flex-col space-y-5">
            {/* Badges */}
            <div className="flex items-center gap-2">
              <div className="h-6 w-24 rounded-full shimmer-luxury" />
              <div className="h-6 w-32 rounded-full shimmer-luxury" />
            </div>

            {/* Product Title */}
            <div className="space-y-2">
              <div className="h-8 sm:h-9 w-4/5 rounded-xl shimmer-luxury" />
              <div className="h-5 w-3/5 rounded-lg shimmer-luxury-subtle" />
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} className="w-4 h-4 rounded-full shimmer-luxury" />
                ))}
              </div>
              <div className="h-4 w-10 rounded shimmer-luxury" />
              <div className="h-4 w-28 rounded shimmer-luxury" />
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl border border-[#DCE8E8] bg-white/70 space-y-2">
              <div className="flex items-baseline gap-3">
                <div className="h-8 w-28 rounded-lg shimmer-luxury" />
                <div className="h-5 w-20 rounded shimmer-luxury-subtle" />
                <div className="h-6 w-20 rounded-full shimmer-luxury" />
              </div>
              <div className="h-3.5 w-44 rounded shimmer-luxury-subtle" />
            </div>

            {/* Pack Size Pills */}
            <div className="space-y-2">
              <div className="h-3.5 w-24 rounded shimmer-luxury" />
              <div className="grid grid-cols-3 gap-2.5">
                {[1, 2, 3].map((p) => (
                  <div key={p} className="h-14 rounded-2xl border border-[#DCE8E8] shimmer-luxury-subtle" />
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="flex-1 h-13 sm:h-14 rounded-full shimmer-luxury" />
              <div className="flex-1 h-13 sm:h-14 rounded-full shimmer-luxury" />
            </div>

            {/* Key Benefits Grid */}
            <div className="grid grid-cols-2 gap-3 pt-3">
              {[1, 2].map((b) => (
                <div key={b} className="p-3.5 rounded-2xl border border-[#DCE8E8] bg-white/50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl shimmer-luxury shrink-0" />
                  <div className="space-y-1 w-full">
                    <div className="h-3.5 w-3/4 rounded shimmer-luxury" />
                    <div className="h-2.5 w-1/2 rounded shimmer-luxury-subtle" />
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Badges Bar */}
            <div className="p-4 rounded-2xl border border-[#DCE8E8] bg-white/40 flex items-center justify-around gap-2 pt-4">
              {[1, 2, 3, 4].map((t) => (
                <div key={t} className="flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-full shimmer-luxury" />
                  <div className="h-2.5 w-12 rounded shimmer-luxury-subtle" />
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

