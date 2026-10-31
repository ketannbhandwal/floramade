"use client";

import { memo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import toast from "react-hot-toast";
import { ShoppingBag, Heart, Star } from "lucide-react";

function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleWishlist = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast.success("Removed from favorites");
    } else {
      addToWishlist(product);
      toast.success("Saved to favorites");
    }
  }, [product, isInWishlist, addToWishlist, removeFromWishlist]);

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success("Added to Bag");
  }, [product, addToCart]);

  const productImage = product.images?.[0]
    || product.featureImages?.[0]
    || product.formulaimage
    || "/placeholder.png";

  const currentPrice = Number(product.discountPrice || product.price || 0);
  const regularPrice = Number(product.price || currentPrice);
  const hasDiscount = regularPrice > currentPrice;
  const ratingValue = Number(product.rating || 0);
  const reviewsCount = typeof product.reviewsCount === "number" 
    ? product.reviewsCount 
    : (product.reviews?.length || 0);
  const hasReviews = reviewsCount > 0;

  // Clean title by stripping any "(Copy)" artifact from duplicated products
  const cleanName = (product.name || "")
    .replace(/\s*\((?:Copy|\d+|copy)[^)]*\)/gi, "")
    .trim();

  return (
    <div className="group relative flex flex-col h-full bg-[#D9E5F3] rounded-2xl border border-[#C5D5E8] hover:border-[#D9A441]/60 transition-all duration-300 overflow-hidden shadow-[0_2px_12px_rgba(20,43,73,0.04)] hover:shadow-[0_12px_28px_rgba(20,43,73,0.10)] hover:-translate-y-1">
      
      {/* 1. TOP STAGE: Zero Padding Edge-to-Edge Container with Slightly Darker Warm Background */}
      <div className="relative aspect-square w-full flex items-center justify-center bg-[#D9E5F3] overflow-hidden border-b border-[#C5D5E8]/60">
        
        {/* Top-Right: Refined Wishlist Heart */}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#D9E5F3]/90 hover:bg-[#D9E5F3] border border-[#C5D5E8] text-[#1A2332]/60 hover:text-[#142B49] flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105 active:scale-90 cursor-pointer"
          aria-label="Save to Wishlist"
        >
          <Heart 
            size={13} 
            className={isInWishlist(product._id) ? "fill-[#D9A441] text-[#142B49]" : "text-[#1A2332]/60"} 
          />
        </button>

        {/* Product Image: Edge to Edge (No Outer Padding) */}
        <Link 
          href={`/product/${product.slug}`} 
          className="relative block w-full h-full cursor-pointer"
        >
          <Image
            src={productImage}
            alt={cleanName}
            fill
            sizes="(max-width: 640px) 240px, (max-width: 1024px) 300px, 25vw"
            quality={80}
            className="object-contain select-none transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </Link>
      </div>

      {/* 2. BOTTOM STAGE: Clean Warm Info Area with Slightly Darker Background */}
      <div className="flex flex-col flex-1 justify-between bg-[#D9E5F3] p-3.5 sm:p-4 text-center">
        <div className="w-full flex flex-col items-center space-y-1.5">
          
          {/* Product Title (Centered, Bold, Tight Tracking) */}
          <Link href={`/product/${product.slug}`} className="block w-full">
            <h3 
              title={cleanName}
              className="text-[13px] sm:text-[14.5px] font-bold text-[#1A2332] group-hover:text-[#142B49] transition-colors tracking-tight truncate px-1"
            >
              {cleanName}
            </h3>
          </Link>

          {/* Star Rating & Reviews (Centered, Tight Tracking, No Wrapping on Mobile) */}
          <div className="flex items-center justify-center gap-1 text-[11px] sm:text-xs tracking-tight min-h-[18px] whitespace-nowrap">
            {hasReviews ? (
              <>
                <div className="flex items-center text-[#D9A441]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      size={11} 
                      className={i < Math.round(ratingValue) ? "fill-[#D9A441] text-[#D9A441]" : "text-[#D9A441]/30"} 
                    />
                  ))}
                </div>
                <span className="font-bold text-[#1A2332] ml-0.5 tracking-tight">{ratingValue.toFixed(1)}</span>
                <span className="text-[#1A2332]/55 tracking-tight whitespace-nowrap">({reviewsCount})</span>
              </>
            ) : (
              <span className="text-[10.5px] text-[#1A2332]/40 tracking-tight">
                No reviews yet
              </span>
            )}
          </div>

          {/* Pricing (Centered, Tight Tracking) */}
          <div className="flex items-baseline justify-center gap-2 pt-0.5 tracking-tight flex-wrap">
            <span className="text-base sm:text-[17px] font-extrabold text-[#142B49] tracking-tight">
              ₹{currentPrice.toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
              <span className="text-xs sm:text-[13px] text-[#1A2332]/40 line-through tracking-tight font-normal">
                ₹{regularPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

        </div>

        {/* Modern Elegant Add to Bag Button with Refined Smooth Radius */}
        <div className="pt-3 w-full">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full py-2 sm:py-2.5 px-3 bg-[#D9A441] hover:bg-[#C48F2E] text-white rounded-xl flex items-center justify-center gap-1.5 font-bold text-xs sm:text-[13px] tracking-tight uppercase active:scale-95 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md"
          >
            <ShoppingBag size={13} strokeWidth={2.2} />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>

    </div>
  );
}

export default memo(ProductCard);
