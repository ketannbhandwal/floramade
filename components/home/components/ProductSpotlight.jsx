"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { 
  Star, 
  ShoppingBag, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Share2, 
  Minus, 
  Plus, 
  Sparkles,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { FaWhatsapp, FaFacebookF } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function ProductSpotlight({ products = [], selectedId = "" }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Find the selected product, or fallback to the first active product
  const product = products.find(p => 
    String(p._id || p.id) === String(selectedId) || p.slug === selectedId
  ) || products[0];

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Touch swipe support (Hand slider) with zero re-renders during drag
  const touchStartXRef = useRef(null);
  const touchEndXRef = useRef(null);

  if (!product) return null;

  // Collect all gallery images and strictly DEDUPLICATE them by URL string
  const rawImages = [
    ...(Array.isArray(product.images) ? product.images : []),
    ...(Array.isArray(product.featureImages) ? product.featureImages : []),
    product.formulaimage
  ].filter(Boolean);

  const images = Array.from(new Set(rawImages));
  if (images.length === 0) images.push("/placeholder.png");

  // Keep index within bounds if images change
  const safeIndex = activeImageIndex >= images.length ? 0 : activeImageIndex;
  const currentImage = images[safeIndex] || images[0];

  const currentPrice = Number(product.discountPrice || product.price || 0);
  const regularPrice = Number(product.price || currentPrice);
  const hasDiscount = regularPrice > currentPrice;
  const savings = hasDiscount ? regularPrice - currentPrice : 0;
  const rating = Number(product.rating || 0).toFixed(1);
  const reviewsCount = typeof product.reviewsCount === "number" ? product.reviewsCount : (product.reviews?.length || 0);
  const hasReviews = reviewsCount > 0;

  // Clean title by stripping any "(Copy)" artifact
  const cleanName = (product.name || "")
    .replace(/\s*\((?:Copy|\d+|copy)[^)]*\)/gi, "")
    .trim();

  const handlePrevImage = (e) => {
    if (e) e.stopPropagation();
    setActiveImageIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = (e) => {
    if (e) e.stopPropagation();
    setActiveImageIndex(prev => (prev + 1) % images.length);
  };

  // Touch Swipe Handlers for mobile & tablet (Zero Re-renders during movement)
  const handleTouchStart = (e) => {
    touchEndXRef.current = null;
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    if (distance > 45) {
      // Swiped Left -> Next image
      handleNextImage();
    } else if (distance < -45) {
      // Swiped Right -> Previous image
      handlePrevImage();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Added ${quantity} to Bag`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    if (!user) {
      toast("Please sign in to complete your purchase");
      router.push("/login?redirect=/checkout");
      return;
    }
    router.push("/checkout");
  };

  const productUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/product/${product.slug}` 
    : `/product/${product.slug}`;

  const shareText = `Check out ${cleanName} on Floramade: ${productUrl}`;

  return (
    <section className="relative overflow-hidden py-14 sm:py-18 lg:py-24 bg-gradient-to-b from-background via-[#F7F9FC] to-background border-t border-[#C5D5E8]/60">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12">
        
        {/* Spotlight Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center max-w-6xl mx-auto">
          
          {/* LEFT: Main Product Image Stage & Hand Slider */}
          <div className="space-y-4">
            
            {/* Main Stage with Left/Right Navigation Arrows & Touch Swipe */}
            <div 
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative aspect-square w-full rounded-3xl bg-[#F7F9FC] border border-[#C5D5E8] overflow-hidden flex items-center justify-center shadow-sm group select-none"
            >
              
              {/* Delicate Top-Left Watermark */}
              <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <span className="text-[#1A2332]/40 text-xs sm:text-sm font-semibold tracking-tight uppercase select-none">
                  Floramade
                </span>
              </div>

              {/* Left Arrow Button */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrevImage}
                  aria-label="Previous Image"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F7F9FC] hover:bg-[#142B49] text-[#1A2332] hover:text-white border border-[#C5D5E8] shadow-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
                >
                  <ChevronLeft size={18} />
                </button>
              )}

              {/* Right Arrow Button */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextImage}
                  aria-label="Next Image"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F7F9FC] hover:bg-[#142B49] text-[#1A2332] hover:text-white border border-[#C5D5E8] shadow-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
                >
                  <ChevronRight size={18} />
                </button>
              )}

              {/* Image Counter Pill */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
                  <span className="inline-flex items-center bg-[#142B49]/60 backdrop-blur-xs text-white text-[10px] font-bold tracking-tight px-2.5 py-0.5 rounded-full shadow-xs">
                    {safeIndex + 1} / {images.length}
                  </span>
                </div>
              )}

              {/* Main Image */}
              <Link href={`/product/${product.slug}`} className="relative block w-full h-full cursor-pointer">
                <Image
                  src={currentImage}
                  alt={`${cleanName} view ${safeIndex + 1}`}
                  fill
                  sizes="(max-width: 640px) 320px, (max-width: 1024px) 500px, 600px"
                  quality={90}
                  className="object-contain select-none transition-transform duration-500 ease-out group-hover:scale-105"
                  priority
                />
              </Link>
            </div>

            {/* Thumbnail Strip (Unique, Non-Duplicate Images) */}
            {images.length > 1 && (
              <div className="flex items-center justify-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 bg-[#F7F9FC] transition-all cursor-pointer flex-shrink-0 ${
                      safeIndex === idx
                        ? "border-[#142B49] shadow-sm ring-2 ring-[#D9A441]/20 scale-102"
                        : "border-[#C5D5E8]/80 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${cleanName} thumbnail ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover select-none"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Details & Authentic Ayurvedic Actions */}
          <div className="space-y-4 sm:space-y-5">
            
            {/* Category / Super-title */}
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#142B49]/10 text-[#142B49] text-[11px] font-bold tracking-tight uppercase">
              <Sparkles size={12} />
              <span>Ayurvedic Spotlight Formulation</span>
            </div>

            {/* Title */}
            <Link href={`/product/${product.slug}`} className="block group">
              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold tracking-tight text-[#1A2332] group-hover:text-[#142B49] transition-colors leading-tight">
                {cleanName}
              </h2>
            </Link>

            {/* Star Rating */}
            <div className="flex items-center gap-2 text-xs sm:text-sm tracking-tight min-h-[22px]">
              {hasReviews ? (
                <>
                  <div className="flex items-center text-[#D9A441]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={15} className={i < Math.round(Number(rating)) ? "fill-[#D9A441] text-[#D9A441]" : "text-[#C5D5E8]"} />
                    ))}
                  </div>
                  <span className="font-bold text-[#1A2332]">{rating}</span>
                  <span className="text-[#1A2332]/60 font-medium">({reviewsCount} {reviewsCount === 1 ? "rating" : "ratings"})</span>
                </>
              ) : (
                <span className="text-xs text-[#1A2332]/50">No reviews yet</span>
              )}
            </div>

            {/* Luxury Price Box - Pure Floramade Theme (#F7F9FC + #E8D9C5 + #142B49 + #D9A441) */}
            <div className="rounded-2xl border border-[#C5D5E8] bg-[#F7F9FC] p-5 sm:p-6 shadow-xs space-y-3">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#142B49] tracking-tight">
                  ₹{currentPrice.toLocaleString("en-IN")}
                </span>
                {hasDiscount && (
                  <span className="text-base sm:text-lg text-[#1A2332]/40 line-through tracking-tight font-normal">
                    ₹{regularPrice.toLocaleString("en-IN")}
                  </span>
                )}
                {hasDiscount && (
                  <span className="text-xs font-bold text-[#142B49] bg-[#142B49]/10 px-2.5 py-0.5 rounded-full tracking-tight">
                    Save ₹{savings.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {/* Decorative Subtle Accent Divider */}
              <div className="h-[1px] w-full bg-gradient-to-r from-[#D9A441]/60 via-[#E8D9C5] to-transparent pt-0.5" />

              <div className="flex items-center gap-2 text-xs font-semibold tracking-tight">
                <span className="text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 size={13} /> In Stock
                </span>
                <span className="text-[#1A2332]/40">|</span>
                <span className="text-[#1A2332]/70">Free Express Delivery Across India</span>
              </div>
            </div>

            {/* Quantity Selector & Primary Actions */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center rounded-full border border-[#C5D5E8] bg-[#F7F9FC] p-1 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#1A2332] hover:bg-[#F7F9FC] transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-9 text-center font-bold text-sm text-[#1A2332] tracking-tight">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#1A2332] hover:bg-[#F7F9FC] transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-5 rounded-xl bg-[#142B49] hover:bg-[#142B49] text-white font-bold text-xs sm:text-sm tracking-tight transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                >
                  <ShoppingBag size={15} strokeWidth={2.2} />
                  <span>Add to Bag</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-3.5 px-6 rounded-xl bg-[#142B49] hover:bg-[#142B49] text-white font-bold text-xs sm:text-sm tracking-tight transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <Zap size={16} className="fill-[#D9A441] text-[#D9A441]" />
                <span>Buy Now with 1-Click</span>
              </button>
            </div>

            {/* Sharing, Catalog Pills & Full Details Link */}
            <div className="pt-3 border-t border-[#C5D5E8]/60 space-y-3">
              
              {/* Share Row */}
              <div className="flex items-center gap-3 text-xs text-[#1A2332]/70 tracking-tight flex-wrap">
                <span className="font-semibold text-[#1A2332] flex items-center gap-1">
                  <Share2 size={13} /> Share:
                </span>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-all"
                  aria-label="Share on WhatsApp"
                >
                  <FaWhatsapp size={13} />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all"
                  aria-label="Share on Facebook"
                >
                  <FaFacebookF size={12} />
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(cleanName)}&body=${encodeURIComponent(shareText)}`}
                  className="w-7 h-7 rounded-full bg-[#142B49]/5 text-[#1A2332] hover:bg-[#142B49] hover:text-white flex items-center justify-center transition-all"
                  aria-label="Share via Email"
                >
                  <MdEmail size={14} />
                </a>
              </div>

              {/* Catalog Categories & Full Details */}
              <div className="flex items-center justify-between gap-3 text-xs tracking-tight flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[#1A2332]/60 font-semibold">Catalog:</span>
                  <Link href="/collection" className="px-2.5 py-0.5 rounded-full bg-black/5 hover:bg-black/10 text-[#1A2332] font-medium transition-colors">
                    All Products
                  </Link>
                  <Link href="/" className="px-2.5 py-0.5 rounded-full bg-black/5 hover:bg-black/10 text-[#1A2332] font-medium transition-colors">
                    Home
                  </Link>
                  {product.category && (
                    <Link href={`/collections/${product.category.toLowerCase().replace(/\s+/g, '-')}`} className="px-2.5 py-0.5 rounded-full bg-black/5 hover:bg-black/10 text-[#1A2332] font-medium transition-colors">
                      {product.category}
                    </Link>
                  )}
                </div>

                <Link
                  href={`/product/${product.slug}`}
                  className="font-bold text-[#142B49] hover:text-[#1A2332] inline-flex items-center gap-1 tracking-tight transition-colors"
                >
                  Full details <ArrowRight size={13} />
                </Link>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
