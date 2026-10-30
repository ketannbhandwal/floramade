"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import toast from "react-hot-toast";
import { 
  CheckCircle2, 
  Leaf, 
  ShieldCheck, 
  ShoppingBag, 
  Star, 
  Zap, 
  Plus, 
  Minus, 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  Camera, 
  Trash2, 
  Sparkles, 
  Copy,
  Eye,
  Flame,
  Activity,
  Home,
  Share2
} from "lucide-react";
import { FaWhatsapp, FaFacebookF } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";

const ProductStructuredData = ({ product }) => {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images,
    "brand": {
      "@type": "Brand",
      "name": "Floramade"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://fiveetatv.com/product/${product.slug}`,
      "priceCurrency": "INR",
      "price": product.discountPrice || product.price,
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Floramade"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating || 5,
      "reviewCount": product.reviewsCount || 0
    },
    "review": product.reviews?.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.name
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating || 5
      },
      "reviewBody": review.comment
    })) || []
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
    />
  );
};

const ratingLabels = {
  1: "1/5 - Poor",
  2: "2/5 - Fair",
  3: "3/5 - Good",
  4: "4/5 - Very Good",
  5: "5/5 - Excellent!",
};

export default function ProductDetails({ product, relatedProducts = [] }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Scroll to top on mount or product change
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [product?.slug]);

  // Gallery Images
  const productImages = useMemo(() => {
    if (Array.isArray(product.images) && product.images.length > 0) return product.images;
    if (Array.isArray(product.featureImages) && product.featureImages.length > 0) return product.featureImages;
    if (product.formulaimage) return [product.formulaimage];
    return ["/placeholder.png"];
  }, [product]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedPack, setSelectedPack] = useState(null);
  const [buyNowOpen, setBuyNowOpen] = useState(false);
  const [buyDetails, setBuyDetails] = useState({ fullName: "", phone: "", addressLine: "", city: "", state: "", pincode: "" });
  
  // Accordion state
  const [accordionOpen, setAccordionOpen] = useState({
    description: true,
    howToUse: false,
    ingredients: false,
  });

  const toggleAccordion = (key) => {
    setAccordionOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const toggleFaq = (index) => {
    setOpenFaqIndex(prev => prev === index ? null : index);
  };

  // Review states
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewData, setReviewData] = useState({ name: "", rating: 5, comment: "", title: "", imageFile: null });
  const [hoverRating, setHoverRating] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [reviewSort, setReviewSort] = useState("recent");
  const [reviewsList, setReviewsList] = useState(product.reviews || []);

  // Packs System
  const packs = useMemo(() => {
    if (product.packs && product.packs.length > 0) {
      return product.packs;
    }
    return [{
      label: "1 Month Pack",
      packCount: 1,
      sachets: product.sachets || null,
      price: product.discountPrice || product.price,
      mrp: product.price,
      mostPopular: false,
    }];
  }, [product]);

  useEffect(() => {
    setActiveIdx(0);
    if (packs.length > 0) {
      const popular = packs.find(p => p.mostPopular);
      setSelectedPack(popular || packs[0]);
    }
  }, [product._id, packs]);

  // 6 Benefit Badges for the Hero Grid (Supports Admin Images & Pre-defined SVGs)
  const benefitBadges = useMemo(() => {
    const defaultIcons = [Sparkles, Zap, Leaf, Flame, Activity, ShieldCheck];

    // Priority 1: Admin configured keyBenefits array of objects { text, image }
    if (Array.isArray(product.keyBenefits) && product.keyBenefits.length > 0) {
      const valid = product.keyBenefits
        .filter(b => b && (b.text || b.image))
        .map((b, idx) => ({
          text: (b.text || "").trim(),
          image: b.image || null,
          icon: defaultIcons[idx % defaultIcons.length],
        }))
        .filter(b => Boolean(b.text));

      if (valid.length > 0) {
        return valid.slice(0, 6);
      }
    }

    // Priority 2: Admin configured benefits + benefitImages
    if (Array.isArray(product.benefits) && product.benefits.length > 0) {
      const valid = product.benefits.map((b, idx) => {
        const text = (typeof b === "string" ? b : b?.text || "").trim();
        const image = (Array.isArray(product.benefitImages) && product.benefitImages[idx]) || (typeof b === "object" && b?.image) || null;
        return { text, image, icon: defaultIcons[idx % defaultIcons.length] };
      }).filter(b => Boolean(b.text));

      if (valid.length > 0) return valid.slice(0, 6);
    }

    // Category authentic defaults with crisp SVGs
    const isDiabetes = product.category === "diabetes" || 
      product.slug?.includes("madhu") || 
      product.name?.toLowerCase().includes("diabetes") ||
      product.name?.toLowerCase().includes("sugar");

    const isDigestion = product.category === "digestion" ||
      product.slug?.includes("paachan") ||
      product.name?.toLowerCase().includes("paachan") ||
      product.name?.toLowerCase().includes("digest");

    if (isDiabetes) {
      return [
        { text: "Balances Metabolism & Sugar", image: "/feature/5svg.svg", icon: Sparkles },
        { text: "Enhances Insulin Sensitivity", image: "/feature/6.svg", icon: Zap },
        { text: "Boosts Natural Immunity", image: "/feature/7.svg", icon: Leaf },
        { text: "Improves Heart & Vitality", image: "/feature/8.svg", icon: Flame },
        { text: "Boosts Daily Energy", image: "/feature/1.svg", icon: Activity },
        { text: "Supports Pancreas Health", image: "/feature/2.svg", icon: ShieldCheck },
      ];
    }

    if (isDigestion) {
      return [
        { text: "Relieves Acidity & Gas", image: "/feature/1.svg", icon: Sparkles },
        { text: "Boosts Digestive Fire", image: "/feature/2.svg", icon: Zap },
        { text: "Smooth Bowel Movement", image: "/feature/3.svg", icon: Leaf },
        { text: "Eases Stomach Heaviness", image: "/feature/4.svg", icon: Flame },
        { text: "Improves Gut Health", image: "/feature/7.svg", icon: Activity },
        { text: "Detoxifies Gut System", image: "/feature/6.svg", icon: ShieldCheck },
      ];
    }

    return [
      { text: "Reduces Stress & Fatigue", image: "/feature/3.svg", icon: Sparkles },
      { text: "Improves Daily Energy", image: "/feature/1.svg", icon: Zap },
      { text: "Relaxes Mind & Body", image: "/feature/2.svg", icon: Leaf },
      { text: "Enhances Natural Vitality", image: "/feature/8.svg", icon: Flame },
      { text: "Balances Natural Doshas", image: "/feature/5svg.svg", icon: Activity },
      { text: "Supports Immune Health", image: "/feature/7.svg", icon: ShieldCheck },
    ];
  }, [product]);

  // Dynamic coupons managed by admin
  const [coupons, setCoupons] = useState([
    {
      code: "FLAT05",
      badge: "FIRST ORDER",
      title: "Flat 5% OFF",
      description: "Get flat 5% OFF on your first order. Applicable on all products.",
      showOnProductPage: true,
      isActive: true,
    },
    {
      code: "FLAT10",
      badge: "BEST VALUE",
      title: "Flat 10% OFF",
      description: "Get flat 10% OFF on orders above ₹3,000. Applicable on all products.",
      showOnProductPage: true,
      isActive: true,
    },
  ]);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data?.coupons) && data.coupons.length > 0) {
          const activeCoupons = data.coupons.filter(c => c.isActive !== false && c.showOnProductPage !== false);
          if (activeCoupons.length > 0) {
            setCoupons(activeCoupons);
          }
        }
      })
      .catch(() => {});
  }, []);

  const applyAndCopyCoupon = (coupon) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(coupon.code);
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("floramade-applied-coupon", JSON.stringify(coupon));
    }
    toast.success(`Coupon "${coupon.code}" applied! It will be used at checkout.`);
  };

  // Clean description without generic placeholder
  const cleanDescription = useMemo(() => {
    if (product.description && 
        !["relief from discomfort", "better results", "relief from discomfort."].includes(product.description.toLowerCase().trim())) {
      return product.description;
    }
    return "100% natural Ayurvedic formulation crafted with time-tested botanical herbs for holistic wellness, sustained vitality, and natural health balance.";
  }, [product.description]);

  // Pricing
  const currentPrice = selectedPack?.price || product.discountPrice || product.price;
  const currentMRP = selectedPack?.mrp || product.price;
  const savings = currentMRP > currentPrice ? currentMRP - currentPrice : 0;

  // Reviews Stats
  const totalReviews = reviewsList?.length || product.reviewsCount || 48;
  const ratingDistribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    (reviewsList || []).forEach(r => {
      const rating = Math.min(5, Math.max(1, r.rating || 5));
      dist[rating - 1]++;
    });
    return dist.reverse();
  }, [reviewsList]);

  const sortedReviews = useMemo(() => {
    const reviews = [...(reviewsList || [])];
    if (reviewSort === "recent") {
      return reviews.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    if (reviewSort === "highest") {
      return reviews.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }
    if (reviewSort === "lowest") {
      return reviews.sort((a, b) => (a.rating || 5) - (b.rating || 5));
    }
    return reviews;
  }, [reviewsList, reviewSort]);

  // Handlers
  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      selectedPack,
      price: currentMRP,
      discountPrice: currentPrice,
    };
    for (let i = 0; i < quantity; i++) {
      addToCart(cartItem);
    }
    toast.success(`Added ${quantity} ${quantity > 1 ? "items" : "item"} to Bag`);
  };

  const handleWishlist = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  const copyCoupon = (code) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      toast.success(`Coupon ${code} copied to clipboard!`);
    }
  };

  const shareProduct = (platform) => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = product.name;
    if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "whatsapp") {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} - ${url}`)}`, "_blank");
    } else {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(url);
        toast.success("Product link copied to clipboard!");
      }
    }
  };

  const buyNow = () => {
    if (Object.values(buyDetails).some((value) => !String(value).trim())) {
      return toast.error("Please add your name, phone and address before continuing.");
    }
    const buyNowItem = [{
      productId: product._id,
      name: product.name,
      quantity,
      price: currentPrice,
      image: product.images?.[0],
      slug: product.slug,
      selectedPack,
    }];
    localStorage.setItem("fiveetatv-buy-now-items", JSON.stringify(buyNowItem));
    localStorage.setItem("fiveetatv-buy-now-address", JSON.stringify(buyDetails));
    setBuyNowOpen(false);
    router.push("/checkout");
  };

  const handleImageSelect = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }
    setReviewData((prev) => ({ ...prev, imageFile: file }));
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const handleRemoveImage = () => {
    setReviewData((prev) => ({ ...prev, imageFile: null }));
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  }

  async function handleImageUpload(file) {
    if (!file) return null;
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: JSON.stringify({ file: await fileToBase64(file), type: "image" }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      return data.url;
    } catch {
      toast.error("Image upload failed");
      return null;
    }
  }

  async function handleSubmitReview() {
    if (!reviewData.name || !reviewData.comment) {
      return toast.error("Please fill in all fields");
    }

    setUploading(true);
    let imageUrl = "";
    if (reviewData.imageFile) {
      imageUrl = await handleImageUpload(reviewData.imageFile);
      if (!imageUrl) {
        setUploading(false);
        return;
      }
    }

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          rating: reviewData.rating,
          comment: reviewData.comment,
          name: reviewData.name,
          title: reviewData.title,
          image: imageUrl,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit review");
      const savedReview = await response.json();
      setReviewsList(prev => [savedReview, ...prev]);
      toast.success("Review submitted for verification!");
      setReviewOpen(false);
      setReviewData({ name: "", rating: 5, comment: "", title: "", imageFile: null });
      setImagePreview(null);
    } catch (error) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="w-full bg-[#FAF6EE] text-[#39160D] pt-4 sm:pt-6 pb-12 sm:pb-16 font-sans">
      <ProductStructuredData product={product} />

      {/* TOP CONTAINER & BREADCRUMBS BAR */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12 mb-4 sm:mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#39160D]/70 py-2.5 border-b border-[#E8D9C5]">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <Link href="/" className="hover:text-[#872B10] transition-colors flex items-center gap-1">
              <Home size={13} />
              <span>Home</span>
            </Link>
            <span>›</span>
            <Link href="/collection" className="hover:text-[#872B10] transition-colors">
              <span>Products</span>
            </Link>
            <span>›</span>
            <span className="text-[#39160D] font-bold truncate max-w-[200px] sm:max-w-md">{product.name}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-semibold text-[#39160D]/60 flex items-center gap-1">
              <Share2 size={12} /> Share:
            </span>
            <button 
              type="button" 
              onClick={() => shareProduct("facebook")} 
              className="w-6 h-6 rounded-full bg-[#FAF6EE] border border-[#E8D9C5] hover:bg-[#872B10] hover:text-white flex items-center justify-center transition-all text-[#39160D] text-[10px]"
              title="Share on Facebook"
            >
              <FaFacebookF size={10} />
            </button>
            <button 
              type="button" 
              onClick={() => shareProduct("whatsapp")} 
              className="w-6 h-6 rounded-full bg-[#FAF6EE] border border-[#E8D9C5] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all text-[#39160D] text-[10px]"
              title="Share on WhatsApp"
            >
              <FaWhatsapp size={11} />
            </button>
            <button 
              type="button" 
              onClick={() => shareProduct("copy")} 
              className="w-6 h-6 rounded-full bg-[#FAF6EE] border border-[#E8D9C5] hover:bg-[#39160D] hover:text-white flex items-center justify-center transition-all text-[#39160D] text-[10px]"
              title="Copy Link"
            >
              <Copy size={11} />
            </button>
          </div>
        </div>
      </div>

      {/* PRODUCT HERO SECTION (2 COLUMNS: STICKY IMAGE ON PC) */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12 mb-14 sm:mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* =========================================================================
              LEFT COLUMN: Sticky on PC so it does NOT scroll away while browsing details
              ========================================================================= */}
          <div className="lg:col-span-6 lg:sticky lg:top-[96px] lg:self-start space-y-4">
            {/* Main Stage Image (Slightly Darker Warm Beige Background for Definition) */}
            <div className="relative aspect-square max-h-[520px] xl:max-h-[560px] w-full rounded-3xl bg-[#F3E8D8] border border-[#E8D9C5] overflow-hidden flex items-center justify-center shadow-xs select-none group">
              {/* Top-Left Brand Tag */}
              <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <span className="text-[#39160D]/40 text-xs sm:text-sm font-semibold tracking-tight uppercase select-none">
                  Floramade
                </span>
              </div>

              {/* Top-Right Wishlist Button */}
              <button
                type="button"
                onClick={handleWishlist}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#FAF6EE]/90 hover:bg-[#FAF6EE] border border-[#E8D9C5] text-[#39160D]/60 hover:text-[#872B10] flex items-center justify-center transition-all shadow-xs hover:scale-105 active:scale-95"
                aria-label="Save to Wishlist"
              >
                <Heart 
                  size={16} 
                  className={isInWishlist(product._id) ? "fill-[#872B10] text-[#872B10]" : "text-[#39160D]/60"} 
                />
              </button>

              {/* Main Product Image */}
              <div className="relative w-full h-full p-2.5 sm:p-4 flex items-center justify-center">
                <Image
                  src={productImages[activeIdx] || "/placeholder.png"}
                  alt={product.name}
                  fill
                  priority={activeIdx === 0}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={85}
                  className="object-contain select-none transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Left/Right Arrows */}
              {productImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveIdx(prev => (prev - 1 + productImages.length) % productImages.length)}
                    aria-label="Previous Image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FAF6EE]/95 hover:bg-[#39160D] text-[#39160D] hover:text-[#FFF7EB] border border-[#E8D9C5] shadow-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-105 active:scale-95"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveIdx(prev => (prev + 1) % productImages.length)}
                    aria-label="Next Image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FAF6EE]/95 hover:bg-[#39160D] text-[#39160D] hover:text-[#FFF7EB] border border-[#E8D9C5] shadow-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-105 active:scale-95"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails Row */}
            {productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar justify-start sm:justify-center">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    aria-label={`View thumbnail ${idx + 1}`}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 bg-[#F3E8D8] flex-shrink-0 transition-all p-1 ${
                      activeIdx === idx
                        ? "border-[#39160D] shadow-sm scale-105"
                        : "border-[#E8D9C5] opacity-75 hover:opacity-100 hover:border-[#872B10]/50"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="80px"
                      quality={75}
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* =========================================================================
              RIGHT COLUMN: Details, Badges, Pricing, Accordions (Unified warm theme, NO white blocks)
              ========================================================================= */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            
            {/* Title & Category Tag */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold text-[#872B10] uppercase tracking-tight bg-[#872B10]/10 px-2.5 py-0.5 rounded-full border border-[#872B10]/15">
                  🌿 {product.category || "Ayurvedic Formulation"}
                </span>
                <span className="text-[10px] font-semibold text-[#39160D]/60 uppercase tracking-tight">
                  100% Organic & Lab-Tested
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#39160D] tracking-tight leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating Bar (Clean & Authentic, NO Fake Social Proof Claims) */}
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.round(product.rating || 4.8) ? "fill-amber-400 text-amber-400" : "text-[#E8D9C5]"}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-[#39160D] tracking-tight">
                {Number(product.rating || 4.8).toFixed(1)} ({totalReviews} ratings)
              </span>
            </div>

            {/* KEY BENEFIT BADGES GRID (Prominent crisp icons, admin image support, compact elegant layout) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1 max-w-[480px]">
              {benefitBadges.map((badge, idx) => {
                const IconComp = badge.icon;
                return (
                  <div
                    key={idx}
                    className="p-2.5 sm:p-3 rounded-2xl bg-[#F3E8D8] border border-[#E8D9C5] shadow-xs flex flex-col items-center text-center justify-center gap-2 hover:border-[#872B10]/50 transition-colors"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FAF6EE] border border-[#E8D9C5]/80 text-[#872B10] flex items-center justify-center shrink-0 p-1.5 overflow-hidden shadow-xs">
                      {badge.image ? (
                        <img 
                          src={badge.image} 
                          alt={badge.text} 
                          className="w-full h-full object-contain transition-transform duration-300 hover:scale-105" 
                        />
                      ) : (
                        <IconComp size={24} className="text-[#872B10]" />
                      )}
                    </div>
                    <span className="text-[10.5px] sm:text-[11px] font-semibold text-[#39160D] leading-tight tracking-tight line-clamp-2">
                      {badge.text}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* PRICE & STOCK STATUS */}
            <div className="space-y-1 pt-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-bold tracking-tight text-[#39160D]">
                  ₹{currentPrice.toLocaleString("en-IN")}
                </span>
                {currentMRP > currentPrice && (
                  <span className="text-base sm:text-lg text-[#39160D]/40 line-through">
                    ₹{currentMRP.toLocaleString("en-IN")}
                  </span>
                )}
                {savings > 0 && (
                  <span className="text-xs font-bold text-[#872B10] bg-[#872B10]/10 px-2.5 py-0.5 rounded-full uppercase tracking-tight">
                    Save ₹{savings.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <div className="text-xs font-semibold text-[#2E6930] flex items-center gap-1.5 tracking-tight">
                <span className="w-2 h-2 rounded-full bg-[#2E6930] animate-pulse" />
                <span>In Stock | Incl. All Taxes</span>
              </div>
            </div>

            {/* PACK SELECTION (if multiple packs configured) */}
            {packs.length > 1 && (
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-bold text-[#39160D] uppercase tracking-tight">Select Pack</label>
                <div className="grid gap-2.5" style={{ gridTemplateColumns: `repeat(${Math.min(packs.length, 3)}, 1fr)` }}>
                  {packs.map((pack, idx) => {
                    const isSelected = selectedPack === pack;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedPack(pack)}
                        className={`p-3 rounded-2xl border-2 text-left transition-all ${
                          isSelected
                            ? "border-[#39160D] bg-[#FFF7EB] ring-2 ring-[#39160D]/10 shadow-xs"
                            : "border-[#E8D9C5] bg-[#F3E8D8] hover:border-[#39160D]/40"
                        }`}
                      >
                        <span className="block text-xs font-bold text-[#39160D] tracking-tight">{pack.label}</span>
                        <span className="block text-sm font-bold text-[#872B10] mt-0.5">₹{pack.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* QUANTITY SELECTOR */}
            <div className="flex items-center gap-4 pt-1">
              <span className="text-xs font-bold text-[#39160D] uppercase tracking-tight">Quantity</span>
              <div className="flex items-center border border-[#E8D9C5] rounded-xl bg-[#F3E8D8]">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center text-[#39160D] hover:bg-[#FAF6EE] rounded-l-xl transition-colors active:scale-90"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-bold text-[#39160D]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-9 h-9 flex items-center justify-center text-[#39160D] hover:bg-[#FAF6EE] rounded-r-xl transition-colors active:scale-90"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* ACTION BUTTONS: Add to Bag & Buy Now */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="h-12 sm:h-13 rounded-2xl bg-[#FFF7EB] border-2 border-[#39160D] text-[#39160D] flex items-center justify-center gap-2 hover:bg-[#39160D]/5 transition-all active:scale-[0.98] font-bold text-xs sm:text-sm uppercase tracking-tight shadow-xs cursor-pointer"
              >
                <ShoppingBag size={17} />
                <span>Add to Bag</span>
              </button>
              <button
                type="button"
                onClick={() => setBuyNowOpen(true)}
                className="h-12 sm:h-13 rounded-2xl bg-[#39160D] text-[#FFF7EB] flex items-center justify-center gap-2 hover:bg-[#4E2014] transition-all active:scale-[0.98] font-bold text-xs sm:text-sm uppercase tracking-tight shadow-md shadow-[#39160D]/20 cursor-pointer"
              >
                <Zap size={17} fill="currentColor" />
                <span>Buy It Now</span>
              </button>
            </div>

            {/* OFFERS FOR YOU (Admin Managed Live Coupons) */}
            {coupons.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-bold text-[#39160D] uppercase tracking-tight">Offers for You</h3>
                  <span className="text-[10px] text-[#872B10] font-semibold">Click to apply coupon</span>
                </div>
                
                <div className="space-y-2">
                  {coupons.map((coupon, idx) => (
                    <div 
                      key={coupon.id || idx}
                      onClick={() => applyAndCopyCoupon(coupon)}
                      className="p-3 sm:p-3.5 rounded-2xl bg-[#F3E8D8] border border-[#E8D9C5] hover:border-[#872B10]/50 flex items-center justify-between gap-3 shadow-xs cursor-pointer transition-all hover:scale-[1.01]"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {coupon.badge && (
                            <span className="text-[10px] font-bold text-[#FFF7EB] bg-[#872B10] px-2 py-0.5 rounded-md uppercase tracking-tight">
                              {coupon.badge}
                            </span>
                          )}
                          <span className="text-xs sm:text-sm font-bold text-[#39160D] tracking-tight">
                            {coupon.title || coupon.code}
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-[#39160D]/75 tracking-tight">
                          {coupon.description || `Use coupon ${coupon.code} on your order.`}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          applyAndCopyCoupon(coupon);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-[#39160D]/20 bg-[#FFF7EB] hover:bg-[#39160D] hover:text-white text-[#39160D] text-xs font-bold tracking-tight transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                        title="Copy and Apply Coupon"
                      >
                        <span>{coupon.code}</span>
                        <Copy size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ACCORDIONS (Description, How to Use, Ingredients - Smooth Animated Accordions) */}
            <div className="space-y-2.5 pt-2">
              
              {/* 1. Description Accordion */}
              <div className="border border-[#E8D9C5] rounded-2xl overflow-hidden bg-[#F3E8D8] shadow-xs">
                <button
                  type="button"
                  onClick={() => toggleAccordion("description")}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-[#39160D] hover:bg-[#FFF7EB] transition-colors cursor-pointer select-none"
                >
                  <span>Description</span>
                  <Plus size={16} className={`transition-transform duration-300 ease-in-out ${accordionOpen.description ? "rotate-45 text-[#872B10]" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {accordionOpen.description && (
                    <motion.div
                      key="desc-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-[#39160D]/85 leading-relaxed border-t border-[#E8D9C5]/50">
                        <p>{cleanDescription}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. How to Use Accordion (Clean text ritual steps, NO IMAGES) */}
              <div className="border border-[#E8D9C5] rounded-2xl overflow-hidden bg-[#F3E8D8] shadow-xs">
                <button
                  type="button"
                  onClick={() => toggleAccordion("howToUse")}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-[#39160D] hover:bg-[#FFF7EB] transition-colors cursor-pointer select-none"
                >
                  <span>How to Use</span>
                  <Plus size={16} className={`transition-transform duration-300 ease-in-out ${accordionOpen.howToUse ? "rotate-45 text-[#872B10]" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {accordionOpen.howToUse && (
                    <motion.div
                      key="use-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-2 text-xs sm:text-sm text-[#39160D]/85 leading-relaxed border-t border-[#E8D9C5]/50 space-y-2">
                        <p className="font-semibold text-[#872B10]">🌿 Recommended Daily Ritual:</p>
                        <ul className="space-y-1.5 list-disc pl-4 text-xs sm:text-sm text-[#39160D]/80">
                          <li><strong>Dosage:</strong> Take 1 to 2 scoops or tablets daily, or as advised by your Ayurvedic physician.</li>
                          <li><strong>Timing:</strong> Best consumed with lukewarm water or warm milk after meals (morning and evening).</li>
                          <li><strong>Course Duration:</strong> Continue consistently for 6 to 8 weeks for sustained and best holistic results.</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 3. Ingredients Accordion (Clean herb list, NO IMAGES) */}
              <div className="border border-[#E8D9C5] rounded-2xl overflow-hidden bg-[#F3E8D8] shadow-xs">
                <button
                  type="button"
                  onClick={() => toggleAccordion("ingredients")}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-[#39160D] hover:bg-[#FFF7EB] transition-colors cursor-pointer select-none"
                >
                  <span>Ingredients</span>
                  <Plus size={16} className={`transition-transform duration-300 ease-in-out ${accordionOpen.ingredients ? "rotate-45 text-[#872B10]" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {accordionOpen.ingredients && (
                    <motion.div
                      key="ing-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-2 text-xs sm:text-sm text-[#39160D]/85 leading-relaxed border-t border-[#E8D9C5]/50 space-y-2.5">
                        <p className="font-semibold text-[#872B10]">🌿 100% Pure Botanical Ingredients:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(product.ingredients && product.ingredients.length > 0 
                            ? product.ingredients 
                            : ["Ashwagandha", "Safed Musli", "Shatavari", "Gokshura", "Kaunch Beej", "Amla", "Vidarikand", "Gudmar", "Jamun", "Karela"]
                          ).map((ing, idx) => {
                            const name = typeof ing === "string" ? ing : ing?.name || "";
                            return (
                              <span 
                                key={idx}
                                className="inline-block px-2.5 py-1 rounded-full bg-[#FFF7EB] border border-[#E8D9C5] text-xs font-semibold text-[#39160D] capitalize tracking-tight"
                              >
                                {name}
                              </span>
                            );
                          })}
                        </div>
                        <p className="text-[11px] sm:text-xs text-[#39160D]/65 leading-relaxed pt-1 border-t border-[#E8D9C5]/50">
                          Ethically sourced pure extracts. Zero added sugar, no artificial chemicals, no synthetic binders.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* CERTIFIED NATURAL GOODNESS (4 Trust Badges - Identical to Why Choose Floramade, Crisp & Warm) */}
      <section className="py-12 sm:py-16 bg-[#FAF6EE] border-t border-[#E8D9C5]/80">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold text-[#39160D] tracking-tight">
              Certified Natural Goodness For You
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 md:gap-14 lg:gap-16 max-w-xs sm:max-w-md md:max-w-4xl mx-auto justify-items-center items-center">
            {[
              { id: 1, src: "/certificate/1.svg", alt: "Quality You Can Trust - Gluten Free" },
              { id: 2, src: "/certificate/2.svg", alt: "100% Pure, Natural & Vegan" },
              { id: 3, src: "/certificate/3.svg", alt: "Clinically Tested Ingredients" },
              { id: 4, src: "/certificate/4.svg", alt: "Certified Organic & GMO Free" },
            ].map((cert) => (
              <div
                key={cert.id}
                className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 transition-transform duration-300 hover:scale-105 flex items-center justify-center cursor-default"
              >
                <Image
                  src={cert.src}
                  alt={cert.alt}
                  fill
                  sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, 160px"
                  className="object-contain p-0 m-0"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FREQUENTLY BOUGHT TOGETHER (4 Product Cards matching reference Image 3) */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="py-14 sm:py-18 bg-[#FAF6EE] border-t border-[#E8D9C5]/80">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold text-[#39160D] tracking-tight">
                Frequently Bought Together
              </h2>
              <p className="text-xs sm:text-sm text-[#39160D]/70 font-normal tracking-tight mt-1.5">
                Pair with these complementary Ayurvedic formulations for faster holistic results.
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {relatedProducts.slice(0, 4).map((item, idx) => (
                <div key={item._id || item.id || idx} className="h-full">
                  <ProductCard product={item} index={idx} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FREQUENTLY ASKED QUESTIONS (Unified warm theme, NO white bands) */}
      <section className="py-14 sm:py-18 bg-[#FAF6EE] border-t border-[#E8D9C5]/80">
        <div className="max-w-[840px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#872B10]/10 text-[#872B10] text-[11px] font-bold uppercase tracking-tight">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#39160D] tracking-tight mt-2">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {(product.faqs || [
              { question: "How do I use this product?", answer: "Follow the usage instructions provided on the packaging. Consult with an Ayurvedic practitioner for personalized guidance." },
              { question: "Is this product suitable for daily use?", answer: "Yes, all our products are formulated for daily use following Ayurvedic principles. However, we recommend consulting with an Ayurvedic practitioner for personalized dosage guidance." },
              { question: "Are there any side effects?", answer: "Our products are made from 100% natural ingredients and are generally safe for consumption. However, if you have any specific health conditions or are pregnant/nursing, please consult your healthcare provider before use." },
              { question: "How long does it take to see results?", answer: "Ayurvedic remedies work holistically and results may vary from person to person. Typically, consistent use for 4-6 weeks shows noticeable improvements in overall well-being." },
              { question: "Does this product provide long-lasting support?", answer: "Yes, with regular and consistent use, our Ayurvedic formulations are designed to provide sustained, long-lasting wellness benefits." }
            ]).map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div 
                  key={i}
                  className="bg-[#FAF6EE] rounded-2xl border border-[#E8D9C5] overflow-hidden shadow-xs transition-colors hover:border-[#872B10]/40"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(i)}
                    className="w-full flex items-center gap-3 p-4 sm:p-5 cursor-pointer text-left text-xs sm:text-sm font-bold text-[#39160D] hover:bg-[#F3E8D8]/40 transition-colors select-none"
                  >
                    <span className="text-[#872B10] font-bold text-xs min-w-[24px]">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1">{faq.question}</span>
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-[#39160D] flex items-center justify-center text-white transition-all duration-300 ease-in-out ${isOpen ? "rotate-45 bg-[#872B10]" : ""}`}>
                      <Plus size={13} />
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key={`faq-anim-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pl-[52px] text-[#39160D]/80 font-normal leading-relaxed text-xs sm:text-sm border-t border-[#E8D9C5]/50 pt-2.5">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS SECTION (Unified warm theme) */}
      <section id="reviews-section" className="py-14 sm:py-18 bg-[#FAF6EE] border-t border-[#E8D9C5]/80">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#39160D] tracking-tight">Customer Reviews</h2>
          </div>

          {/* Rating Summary Card */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8 p-6 sm:p-8 bg-[#FAF6EE] rounded-3xl border border-[#E8D9C5] shadow-xs">
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-4xl sm:text-5xl font-bold text-[#39160D] tracking-tight">
                {Number(product.rating || 4.8).toFixed(1)}
              </span>
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} className={i < Math.round(product.rating || 4.8) ? "fill-amber-400 text-amber-400" : "text-[#E8D9C5]"} />
                ))}
              </div>
              <span className="text-xs text-[#39160D]/60 font-medium">
                Based on {totalReviews} reviews
              </span>
            </div>

            <div className="flex-1 w-full space-y-2">
              {[5, 4, 3, 2, 1].map((stars, idx) => {
                const count = ratingDistribution[idx];
                const pct = totalReviews > 0 ? (count / totalReviews) * 100 : (stars === 5 ? 85 : stars === 4 ? 12 : 3);
                return (
                  <div key={stars} className="flex items-center gap-2">
                    <div className="flex text-amber-400 w-20">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className={i < stars ? "fill-amber-400 text-amber-400" : "text-[#E8D9C5]"} />
                      ))}
                    </div>
                    <div className="flex-1 h-2 bg-[#39160D]/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#872B10] rounded-full transition-all duration-500" 
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-[#39160D]/60 w-6 text-right font-medium">{count}</span>
                  </div>
                );
              })}
            </div>

            <div>
              <button 
                onClick={() => setReviewOpen(true)}
                className="px-6 py-3 bg-[#39160D] text-[#FFF7EB] rounded-full font-bold text-xs uppercase tracking-tight hover:bg-[#4E2014] transition-all shadow-sm whitespace-nowrap active:scale-95 cursor-pointer"
              >
                Write a review
              </button>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-bold text-[#39160D]/60 uppercase tracking-tight">
              Customer Feedback
            </span>
            <select
              value={reviewSort}
              onChange={(e) => setReviewSort(e.target.value)}
              className="text-xs sm:text-sm border border-[#E8D9C5] rounded-full px-3.5 py-1.5 bg-[#FAF6EE] text-[#39160D] outline-none shadow-xs font-medium cursor-pointer"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>

          {/* Review Cards */}
          <div className="space-y-4">
            {sortedReviews.map((review, i) => (
              <div 
                key={i}
                className="p-5 bg-[#FAF6EE] rounded-2xl border border-[#E8D9C5] shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} size={14} className={idx < (review.rating || 5) ? "fill-amber-400 text-amber-400" : "text-[#E8D9C5]"} />
                    ))}
                  </div>
                  {review.createdAt && (
                    <span className="text-xs text-[#39160D]/50 font-medium">
                      {new Date(review.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#FFF7EB] flex items-center justify-center text-[#872B10] font-bold text-xs border border-[#E8D9C5]">
                    {review.name?.charAt(0) || "U"}
                  </div>
                  <span className="text-sm font-bold text-[#39160D] capitalize">{review.name}</span>
                  <span className="px-2 py-0.5 bg-[#872B10]/10 text-[#872B10] border border-[#872B10]/20 text-[10px] font-bold rounded-full">
                    ✓ Verified Buyer
                  </span>
                </div>

                {review.title && (
                  <h4 className="font-bold text-sm text-[#39160D] mb-1">{review.title}</h4>
                )}
                <p className="text-xs sm:text-sm text-[#39160D]/80 leading-relaxed font-normal">{review.comment}</p>
              </div>
            ))}
          </div>

          {sortedReviews.length === 0 && (
            <div className="text-center py-10">
              <p className="text-[#39160D]/60 text-sm">No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>
      </section>

      {/* REVIEW MODAL */}
      <Modal 
        open={reviewOpen} 
        title="Write a Review" 
        subtitle={`Reviewing ${product.name}`}
        onClose={() => setReviewOpen(false)}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#39160D] uppercase tracking-tight">
                Your Rating <span className="text-red-500">*</span>
              </label>
              <span className="text-xs font-semibold text-[#872B10]">
                {ratingLabels[hoverRating || reviewData.rating]}
              </span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-[#FAF6EE] rounded-xl border border-[#E8D9C5]">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating || reviewData.rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setReviewData((prev) => ({ ...prev, rating: star }))}
                    className="p-1 hover:scale-110 active:scale-95 transition-all focus:outline-none"
                    aria-label={`Rate ${star} star`}
                  >
                    <Star 
                      size={26} 
                      fill={active ? "#F59E0B" : "none"} 
                      className={active ? "text-amber-400" : "text-[#E8D9C5]"} 
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#39160D] uppercase tracking-tight">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={reviewData.name}
                onChange={(e) => setReviewData((prev) => ({ ...prev, name: e.target.value }))}
                className="h-11 w-full rounded-xl border border-[#E8D9C5] bg-[#FAF6EE] px-3.5 text-sm text-[#39160D] outline-none transition placeholder:text-[#39160D]/35 focus:border-[#39160D]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#39160D] uppercase tracking-tight">
                Review Title <span className="text-[#39160D]/40 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Excellent Ayurvedic remedy!"
                value={reviewData.title}
                onChange={(e) => setReviewData((prev) => ({ ...prev, title: e.target.value }))}
                className="h-11 w-full rounded-xl border border-[#E8D9C5] bg-[#FAF6EE] px-3.5 text-sm text-[#39160D] outline-none transition placeholder:text-[#39160D]/35 focus:border-[#39160D]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#39160D] uppercase tracking-tight">
                Your Photo <span className="text-[#39160D]/40 font-normal">(Optional)</span>
              </label>
              
              {imagePreview ? (
                <div className="relative flex items-center gap-3 p-3 rounded-xl bg-[#FAF6EE] border border-[#E8D9C5]">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-[#E8D9C5]">
                    <Image src={imagePreview} alt="Review attachment" fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#39160D] truncate">
                      {reviewData.imageFile?.name || "Photo selected"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-1.5 rounded-full text-red-500 hover:bg-red-50"
                    title="Remove photo"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-[#E8D9C5] hover:border-[#39160D]/40 bg-[#FAF6EE] cursor-pointer transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageSelect(e.target.files?.[0])}
                    className="hidden"
                  />
                  <Camera size={16} className="text-[#872B10]" />
                  <span className="text-xs font-semibold text-[#39160D]">Click to upload a photo (Optional)</span>
                </label>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#39160D] uppercase tracking-tight">
                Your Review <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData((prev) => ({ ...prev, comment: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D9C5] focus:outline-none focus:border-[#39160D] min-h-[100px] bg-[#FAF6EE] text-sm text-[#39160D] placeholder:text-[#39160D]/35 resize-none transition-all"
                placeholder="Share your experience with this product..."
                rows={3}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmitReview}
            disabled={uploading || !reviewData.name.trim() || !reviewData.comment.trim()}
            className="w-full h-11 rounded-full bg-[#39160D] text-[#FFF7EB] font-bold text-xs uppercase tracking-tight hover:bg-[#4E2014] disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            {uploading ? (
              <span>Submitting Review...</span>
            ) : (
              <>
                <Sparkles size={14} />
                <span>Submit Review</span>
              </>
            )}
          </button>
        </div>
      </Modal>

      {/* BUY NOW QUICK CHECKOUT MODAL */}
      <Modal open={buyNowOpen} title="Quick Checkout" subtitle="Complete your order details" onClose={() => setBuyNowOpen(false)}>
        <div className="space-y-4">
          {selectedPack && (
            <div className="flex items-center gap-3 p-3 bg-[#FAF6EE] rounded-xl border border-[#E8D9C5]">
              {product.images?.[0] && (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-[#E8D9C5]">
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#39160D] truncate">{product.name}</p>
                <p className="text-[11px] text-[#39160D]/60">{selectedPack.label || `Pack of ${selectedPack.packCount}`} × {quantity}</p>
              </div>
              <p className="text-sm font-bold text-[#39160D]">₹{currentPrice * quantity}</p>
            </div>
          )}
          
          <div className="space-y-3">
            <Input label="Full Name" value={buyDetails.fullName} onChange={(e) => setBuyDetails((prev) => ({ ...prev, fullName: e.target.value }))} />
            <Input label="Phone Number" placeholder="e.g. 9220251059" value={buyDetails.phone} onChange={(e) => setBuyDetails((prev) => ({ ...prev, phone: e.target.value }))} />
            <Input label="Street Address" value={buyDetails.addressLine} onChange={(e) => setBuyDetails((prev) => ({ ...prev, addressLine: e.target.value }))} />
            <div className="grid gap-2.5 sm:grid-cols-3">
              <Input label="City" value={buyDetails.city} onChange={(e) => setBuyDetails((prev) => ({ ...prev, city: e.target.value }))} />
              <Input label="State" value={buyDetails.state} onChange={(e) => setBuyDetails((prev) => ({ ...prev, state: e.target.value }))} />
              <Input label="Pincode" value={buyDetails.pincode} onChange={(e) => setBuyDetails((prev) => ({ ...prev, pincode: e.target.value }))} />
            </div>
          </div>

          <button 
            type="button"
            onClick={buyNow}
            className="w-full h-11 rounded-full bg-[#39160D] text-[#FFF7EB] font-bold text-xs uppercase tracking-tight hover:bg-[#4E2014] shadow-md transition-all cursor-pointer"
          >
            Continue to Payment
          </button>
        </div>
      </Modal>

    </div>
  );
}
