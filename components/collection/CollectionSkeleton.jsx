"use client";

import React from "react";
import { ProductCardSkeleton } from "@/components/ui/LoadingSkeleton";

export default function CollectionSkeleton() {
  return (
    <div className="w-full bg-[#D9E5F3] text-[#1A2332] pb-16 pt-24 md:pt-32">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Collection Header Banner Shimmer */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-3">
          <div className="h-3 w-28 mx-auto rounded-full shimmer-luxury" />
          <div className="h-9 sm:h-11 w-64 sm:w-80 mx-auto rounded-xl shimmer-luxury" />
          <div className="h-4 w-72 sm:w-96 mx-auto rounded shimmer-luxury-subtle" />
        </div>

        {/* Filter Pills Row Shimmer */}
        <div className="flex items-center justify-center gap-2.5 overflow-x-auto pb-6 mb-8">
          {[1, 2, 3, 4, 5, 6].map((f) => (
            <div
              key={f}
              className={`h-9 rounded-full shimmer-luxury border border-[#C5D5E8] ${
                f === 1 ? "w-24 bg-[#142B49]/10" : "w-28"
              }`}
            />
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>

      </div>
    </div>
  );
}

