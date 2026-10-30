"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
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
  Sparkles 
} from "lucide-react";
import { FaWhatsapp, FaFacebookF } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function ProductSpotlight({ products = [], selectedId = "" }) {
  const router = useRouter();
  const { addToCart } = useCart();

  // Find the selected product, or fallback to the first active product
  const product = products.find(p => 
    String(p._id || p.id) === String(selectedId) || p.slug === selectedId
  ) || products[0];

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) return null;

  // Collect all gallery images
  const allImages = [
    ...(product.images || []),
    ...(product.featureImages || []),
    product.formulaimage
  ].filter(Boolean);

  const images = allImages.length > 0 ? allImages : ["/placeholder.png"];
  const currentImage = images[activeImageIndex] || images[0];

  const currentPrice = Number(product.discountPrice || product.price || 0);
  const regularPrice = Number(product.price || currentPrice);
  const hasDiscount = regularPrice > currentPrice;
  const savings = hasDiscount ? regularPrice - currentPrice : 0;
  const rating = Number(product.rating || 4.8).toFixed(1);
  const reviewsCount = product.reviewsCount || product.reviews?.length || 115;

  // Clean title by stripping any "(Copy)" artifact
  const cleanName = (product.name || "")
    .replace(/\s*\((?:Copy|\d+|copy)[^)]*\)/gi, "")
    .trim();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Added ${quantity} to Bag`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/checkout");
  };

  const productUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/product/${product.slug}` 
    : `/product/${product.slug}`;

  const shareText = `Check out ${cleanName} on Floramade: ${productUrl}`;

  return (
    <section className="relative overflow-hidden py-14 sm:py-18 lg:py-24 bg-gradient-to-b from-background via-[#FAF5EC]/50 to-background border-t border-[#E8D9C5]/60">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12">
        
        {/* Spotlight Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center max-w-6xl mx-auto">
          
          {/* LEFT: Main Product Image & Thumbnail Strip */}
          <div className="space-y-4">
            
            {/* Main Stage */}
            <div className="relative aspect-square w-full rounded-3xl bg-[#FAF6EE] border border-[#E8D9C5] overflow-hidden flex items-center justify-center shadow-sm">
              
              {/* Delicate Top-Left Watermark */}
              <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <span className="text-[#39160D]/40 text-xs sm:text-sm font-semibold tracking-tight uppercase select-none">
                  Floramade
                </span>
              </div>

              {/* Top-Right Discount Badge */}
              {hasDiscount && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center gap-1 bg-[#872B10] text-[#FFF7EB] text-[10px] sm:text-xs font-bold uppercase tracking-tight px-3 py-1 rounded-full shadow-xs">
                    SAVE ₹{savings.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              {/* Main Image */}
              <Link href={`/product/${product.slug}`} className="relative block w-full h-full cursor-pointer">
                <Image
                  src={currentImage}
                  alt={cleanName}
                  fill
                  sizes="(max-width: 640px) 320px, (max-width: 1024px) 500px, 600px"
                  quality={90}
                  className="object-contain select-none transition-transform duration-500 ease-out hover:scale-105"
                  priority
                />
              </Link>
            </div>

            {/* Thumbnail Strip (if more than 1 image) */}
            {images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                {images.slice(0, 6).map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 bg-[#FAF6EE] transition-all cursor-pointer flex-shrink-0 ${
                      activeImageIndex === idx
                        ? "border-[#872B10] shadow-sm ring-2 ring-[#872B10]/20 scale-102"
                        : "border-[#E8D9C5]/80 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${cleanName} view ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Details & Purchase Actions */}
          <div className="space-y-4 sm:space-y-5">
            
            {/* Category / Super-title */}
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#872B10]/10 text-[#872B10] text-[11px] font-bold tracking-tight uppercase">
              <Sparkles size={12} />
              <span>Ayurvedic Spotlight Formulation</span>
            </div>

            {/* Title */}
            <Link href={`/product/${product.slug}`} className="block group">
              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold tracking-tight text-[#39160D] group-hover:text-[#872B10] transition-colors leading-tight">
                {cleanName}
              </h2>
            </Link>

            {/* Star Rating */}
            <div className="flex items-center gap-2 text-xs sm:text-sm tracking-tight">
              <div className="flex items-center text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-[#39160D]">{rating}</span>
              <span className="text-[#39160D]/60 font-medium">({reviewsCount} verified customer ratings)</span>
            </div>

            {/* Price Box */}
            <div className="rounded-2xl border border-[#E8D9C5] bg-white p-5 sm:p-6 shadow-xs space-y-3">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#872B10] tracking-tight">
                  ₹{currentPrice.toLocaleString("en-IN")}
                </span>
                {hasDiscount && (
                  <span className="text-base sm:text-lg text-[#39160D]/40 line-through tracking-tight font-normal">
                    ₹{regularPrice.toLocaleString("en-IN")}
                  </span>
                )}
                {hasDiscount && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full tracking-tight">
                    Save ₹{savings.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              <div className="pt-2 border-t border-[#E8D9C5]/60 flex items-center gap-2 text-xs font-semibold tracking-tight">
                <span className="text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 size={13} /> In Stock
                </span>
                <span className="text-[#39160D]/40">|</span>
                <span className="text-[#39160D]/70">Inclusive of all taxes</span>
              </div>
            </div>

            {/* Quantity Selector & Primary Actions */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center rounded-full border border-[#E8D9C5] bg-white p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#39160D] hover:bg-[#FAF6EE] transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-9 text-center font-bold text-sm text-[#39160D] tracking-tight">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#39160D] hover:bg-[#FAF6EE] transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-5 rounded-full bg-[#872B10] hover:bg-[#39160D] text-[#FFF7EB] font-bold text-xs sm:text-sm tracking-tight transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                >
                  <ShoppingBag size={15} strokeWidth={2.2} />
                  <span>Add to Bag</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-3.5 px-6 rounded-full bg-[#39160D] hover:bg-[#872B10] text-[#FFF7EB] font-bold text-xs sm:text-sm tracking-tight transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <Zap size={16} className="fill-[#DFC77F] text-[#DFC77F]" />
                <span>Buy Now with 1-Click</span>
              </button>
            </div>

            {/* Sharing, Catalog Pills & Full Details Link */}
            <div className="pt-3 border-t border-[#E8D9C5]/60 space-y-3">
              
              {/* Share Row */}
              <div className="flex items-center gap-3 text-xs text-[#39160D]/70 tracking-tight flex-wrap">
                <span className="font-semibold text-[#39160D] flex items-center gap-1">
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
                  className="w-7 h-7 rounded-full bg-[#39160D]/5 text-[#39160D] hover:bg-[#39160D] hover:text-[#FFF7EB] flex items-center justify-center transition-all"
                  aria-label="Share via Email"
                >
                  <MdEmail size={14} />
                </a>
              </div>

              {/* Catalog Categories & Full Details */}
              <div className="flex items-center justify-between gap-3 text-xs tracking-tight flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[#39160D]/60 font-semibold">Catalog:</span>
                  <Link href="/collection" className="px-2.5 py-0.5 rounded-full bg-black/5 hover:bg-black/10 text-[#39160D] font-medium transition-colors">
                    All Products
                  </Link>
                  <Link href="/" className="px-2.5 py-0.5 rounded-full bg-black/5 hover:bg-black/10 text-[#39160D] font-medium transition-colors">
                    Home
                  </Link>
                  {product.category && (
                    <Link href={`/collections/${product.category.toLowerCase().replace(/\s+/g, '-')}`} className="px-2.5 py-0.5 rounded-full bg-black/5 hover:bg-black/10 text-[#39160D] font-medium transition-colors">
                      {product.category}
                    </Link>
                  )}
                </div>

                <Link
                  href={`/product/${product.slug}`}
                  className="font-bold text-[#872B10] hover:text-[#39160D] inline-flex items-center gap-1 tracking-tight transition-colors"
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

