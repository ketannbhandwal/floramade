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
  const savings = hasDiscount ? regularPrice - currentPrice : 0;
  const rating = Number(product.rating || 4.8).toFixed(1);
  const reviewsCount = product.reviewsCount || product.reviews?.length || 48;

  // Clean title by stripping any "(Copy)" artifact from duplicated products
  const cleanName = (product.name || "")
    .replace(/\s*\((?:Copy|\d+|copy)[^)]*\)/gi, "")
    .trim();

  return (
    <div className="group relative flex flex-col h-full bg-white rounded-2xl border border-[#E8D9C5] hover:border-[#872B10]/50 transition-all duration-300 overflow-hidden shadow-[0_2px_12px_rgba(57,22,13,0.04)] hover:shadow-[0_12px_28px_rgba(57,22,13,0.10)] hover:-translate-y-1">
      
      {/* 1. TOP STAGE: Zero Padding Edge-to-Edge Container */}
      <div className="relative aspect-square w-full flex items-center justify-center bg-[#FAF6EE] overflow-hidden border-b border-[#E8D9C5]/50">
        
        {/* Top-Left: Sleek Terracotta Discount Pill */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 pointer-events-none">
          {hasDiscount ? (
            <span className="inline-flex items-center gap-1 bg-[#872B10] text-[#FFF7EB] text-[9.5px] sm:text-[10px] font-bold uppercase tracking-tight px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-xs">
              SAVE ₹{savings.toLocaleString("en-IN")}
            </span>
          ) : (
            <span className="text-[#39160D]/40 text-[10px] sm:text-[11px] font-semibold tracking-tight uppercase select-none">
              Floramade
            </span>
          )}
        </div>

        {/* Top-Right: Refined Wishlist Heart */}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white border border-[#E8D9C5] text-[#39160D]/60 hover:text-[#872B10] flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105 active:scale-90 cursor-pointer"
          aria-label="Save to Wishlist"
        >
          <Heart 
            size={13} 
            className={isInWishlist(product._id) ? "fill-[#872B10] text-[#872B10]" : "text-[#39160D]/60"} 
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

      {/* 2. BOTTOM STAGE: Clean White Info Area with Tight Typography */}
      <div className="flex flex-col flex-1 justify-between bg-white p-3.5 sm:p-4 text-center">
        <div className="w-full flex flex-col items-center space-y-1.5">
          
          {/* Product Title (Centered, Bold, Tight Tracking) */}
          <Link href={`/product/${product.slug}`} className="block w-full">
            <h3 
              title={cleanName}
              className="text-[13px] sm:text-[14.5px] font-bold text-[#39160D] group-hover:text-[#872B10] transition-colors tracking-tight truncate px-1"
            >
              {cleanName}
            </h3>
          </Link>

          {/* Star Rating & Reviews (Centered, Tight Tracking) */}
          <div className="flex items-center justify-center gap-1 text-[11px] sm:text-xs tracking-tight">
            <div className="flex items-center text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-bold text-[#39160D] ml-0.5 tracking-tight">{rating}</span>
            <span className="text-[#39160D]/55 tracking-tight">({reviewsCount} ratings)</span>
          </div>

          {/* Pricing (Centered, Tight Tracking) */}
          <div className="flex items-baseline justify-center gap-2 pt-0.5 tracking-tight flex-wrap">
            <span className="text-base sm:text-[17px] font-extrabold text-[#872B10] tracking-tight">
              ₹{currentPrice.toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
              <span className="text-xs sm:text-[13px] text-[#39160D]/40 line-through tracking-tight font-normal">
                ₹{regularPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

        </div>

        {/* Slim, Elegant Add to Bag Pill Button */}
        <div className="pt-3 w-full">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full py-2 sm:py-2.5 px-3 bg-[#39160D] hover:bg-[#872B10] text-[#FFF7EB] rounded-full flex items-center justify-center gap-1.5 font-semibold text-xs sm:text-[13px] tracking-tight active:scale-95 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md"
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
