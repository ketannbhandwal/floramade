"use client";

import { memo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import toast from "react-hot-toast";
import { ShoppingBag, Heart, Star } from "lucide-react";

// Rich Muted Ayurvedic Palettes (matching Image 1 / Vedabay style)
const AYURVEDIC_PALETTES = [
  "#2C4436", // Forest Herbal Green (like Ashwagandha)
  "#3A4B59", // Muted Slate Blue (like Orthoheal)
  "#7A4A43", // Earthy Terracotta Burgundy (like Psory-Sys)
  "#1E3A4C", // Deep Prussian Teal/Navy (like Ayush 82)
  "#244638", // Deep Emerald Herbal
  "#9E5D4E", // Warm Terracotta Clay (like Collagen Builder)
  "#1E3345", // Midnight Slate (like Endure Pro)
  "#824E5C", // Deep Mauve / Jamun (like Glutathione Plus)
];

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
  const emiAmount = Math.max(100, Math.round(currentPrice / 3));

  // Clean title by stripping any "(Copy)" artifact from duplicated products
  const cleanName = (product.name || "")
    .replace(/\s*\((?:Copy|\d+|copy)[^)]*\)/gi, "")
    .trim();

  // Background color for upper stage: product specific or cycle through rich Ayurvedic palette
  const cardBg = product.bgColor || product.color || AYURVEDIC_PALETTES[index % AYURVEDIC_PALETTES.length];

  return (
    <div className="group relative flex flex-col h-full bg-white rounded-2xl border border-[#E8D9C5]/90 hover:border-[#872B10]/40 transition-all duration-300 overflow-hidden shadow-xs hover:shadow-lg">
      
      {/* 1. TOP STAGE: Rich Muted Ayurvedic Background Box with Product Image */}
      <div 
        className="relative aspect-square w-full overflow-hidden flex items-center justify-center transition-colors duration-300"
        style={{ backgroundColor: cardBg }}
      >
        {/* Top-Left: Save Badge (Pill) OR Subtle Floramade Watermark */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 pointer-events-none">
          {hasDiscount ? (
            <span className="inline-flex items-center gap-1 bg-[#10291D]/80 sm:bg-black/40 backdrop-blur-xs text-[#FFF7EB] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-white/20 shadow-xs">
              <span className="text-[10px]">🏷️</span>
              SAVE RS. {savings.toLocaleString("en-IN")}.00
            </span>
          ) : (
            <span className="text-white/45 text-[10px] sm:text-[11px] font-medium tracking-widest lowercase select-none">
              floramade
            </span>
          )}
        </div>

        {/* Top-Right: Subtle Wishlist Heart (Appears smoothly on hover) */}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/25 hover:bg-black/50 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer shadow-xs"
          aria-label="Save to Wishlist"
        >
          <Heart 
            size={13} 
            className={isInWishlist(product._id) ? "fill-[#FF4D4D] text-[#FF4D4D]" : "text-white"} 
          />
        </button>

        {/* Centered Product Bottle */}
        <Link 
          href={`/product/${product.slug}`} 
          className="relative block w-full h-full p-4 sm:p-5 flex items-center justify-center cursor-pointer"
        >
          <Image
            src={productImage}
            alt={cleanName}
            fill
            sizes="(max-width: 640px) 180px, (max-width: 1024px) 300px, 25vw"
            quality={90}
            className="object-contain select-none transition-transform duration-500 ease-out group-hover:scale-105 drop-shadow-[0_12px_22px_rgba(0,0,0,0.28)]"
          />
        </Link>

        {/* Desktop Hover Quick Add Pill */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hidden sm:flex justify-center pointer-events-none">
          <button
            type="button"
            onClick={handleAddToCart}
            className="pointer-events-auto px-4 py-1.5 rounded-full bg-white/95 hover:bg-white text-[#39160D] hover:text-[#872B10] text-xs font-bold tracking-tight shadow-md flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingBag size={13} className="text-[#872B10]" />
            Quick Add
          </button>
        </div>
      </div>

      {/* 2. BOTTOM STAGE: Clean White Box with Centered Details */}
      <div className="flex flex-col flex-1 items-center justify-between bg-white p-3.5 sm:p-4 text-center">
        <div className="w-full flex flex-col items-center">
          
          {/* Product Title (Centered, Bold) */}
          <Link href={`/product/${product.slug}`} className="block w-full">
            <h3 
              title={cleanName}
              className="text-[13px] sm:text-[14px] md:text-[15px] font-bold text-[#39160D] group-hover:text-[#872B10] transition-colors truncate px-1"
            >
              {cleanName}
            </h3>
          </Link>

          {/* Star Rating & Reviews (Centered) */}
          <div className="flex items-center justify-center gap-1 mt-1 text-[11px] sm:text-xs">
            <div className="flex items-center text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-bold text-[#39160D] ml-0.5">{rating}</span>
            <span className="text-[#39160D]/55">({reviewsCount} ratings)</span>
          </div>

          {/* Pricing (Centered) */}
          <div className="flex items-center justify-center gap-2 mt-1.5 flex-wrap">
            <span className="text-sm sm:text-[15px] font-bold text-[#872B10]">
              Rs. {currentPrice.toLocaleString("en-IN")}.00
            </span>
            {hasDiscount && (
              <span className="text-xs sm:text-[13px] text-[#39160D]/40 line-through">
                Rs. {regularPrice.toLocaleString("en-IN")}.00
              </span>
            )}
          </div>

          {/* EMI Pill (Centered) */}
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[#E8D9C5] bg-[#FFF7EB]/50 text-[10px] sm:text-[11px] text-[#39160D]/85">
            <span>or ₹{emiAmount.toLocaleString("en-IN")}/Month</span>
            <span className="bg-[#1E3A4C] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
              Buy on EMI
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}

export default memo(ProductCard);
