"use client";

import { memo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import toast from "react-hot-toast";
import { ShoppingBag, Heart, Star } from "lucide-react";

function ProductCard({ product }) {
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
  }, [product._id, isInWishlist, addToWishlist, removeFromWishlist]);

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

  return (
    <div className="group relative flex flex-col h-full bg-transparent rounded-2xl border border-[#E8D9C5] hover:border-[#872B10]/40 transition-all duration-300 overflow-hidden shadow-xs hover:shadow-md">
      
      {/* 1. TOP STAGE: Natural Website Background (No White Box, No Tinted BG) */}
      <div className="relative aspect-square w-full p-4 sm:p-5 flex items-center justify-center bg-transparent">
        
        {/* Top-Right Badges: Discount Tag & Wishlist */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          {hasDiscount && (
            <span className="bg-[#872B10] text-[#FFF7EB] text-[10px] font-bold uppercase tracking-tight px-2 py-0.5 rounded shadow-xs">
              SAVE ₹{savings}
            </span>
          )}
          <button
            type="button"
            onClick={handleWishlist}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 backdrop-blur-sm border border-[#E8D9C5] flex items-center justify-center shadow-xs text-[#39160D] hover:text-[#872B10] hover:scale-105 active:scale-90 transition-all cursor-pointer"
            aria-label="Save to Wishlist"
          >
            <Heart 
              size={14} 
              className={isInWishlist(product._id) ? "fill-[#872B10] text-[#872B10]" : "text-[#39160D]/60"} 
            />
          </button>
        </div>

        {/* Product Bottle on Natural Website Background */}
        <Link href={`/product/${product.slug}`} className="relative block w-full h-full">
          <Image
            src={productImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 280px, (max-width: 1024px) 50vw, 25vw"
            quality={90}
            className="object-contain select-none transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      </div>

      {/* 2. BOTTOM STAGE: Subtle Background ONLY for Text & Actions */}
      <div className="flex flex-col flex-1 justify-between bg-white/60 backdrop-blur-sm p-4 sm:p-5 border-t border-[#E8D9C5]/70 space-y-3">
        <div className="space-y-1.5">
          {/* Title */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-sm sm:text-[15px] font-semibold text-[#39160D] group-hover:text-[#872B10] transition-colors line-clamp-2 leading-snug min-h-[40px] tracking-tight">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <div className="flex items-center text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs font-bold text-[#39160D]">{rating}</span>
            <span className="text-[11px] text-[#39160D]/50">({reviewsCount} ratings)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-base sm:text-lg font-bold text-[#39160D]">
              ₹{currentPrice.toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
              <span className="text-xs text-[#39160D]/40 line-through">
                ₹{regularPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Shipping / Trust line */}
          <p className="text-[11px] text-[#39160D]/60 flex items-center gap-1 tracking-tight">
            <span className="text-emerald-700 font-bold">✓</span> Free Shipping Across India
          </p>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full py-2.5 px-4 bg-[#39160D] hover:bg-[#872B10] text-[#FFF7EB] rounded-full flex items-center justify-center gap-2 font-medium text-xs sm:text-sm uppercase tracking-tight active:scale-95 transition-all duration-200 cursor-pointer shadow-xs"
        >
          <ShoppingBag size={14} strokeWidth={2.2} />
          <span>Add to Bag</span>
        </button>
      </div>

    </div>
  );
}

export default memo(ProductCard);
