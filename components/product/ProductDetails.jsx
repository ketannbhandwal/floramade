"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import toast from "react-hot-toast";
import { CheckCircle2, Leaf, ShieldCheck, ShoppingBag, Star, Zap, Plus, Minus, ArrowRight, Quote, Heart, Award, ChevronLeft, ChevronRight, Phone, Package, Clock, Truck, X, Camera, Trash2, Sparkles, UploadCloud } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import FloatingLeaf from "@/components/ui/FloatingLeaf";

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

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : direction < 0 ? "-100%" : 0,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    transition: {
      x: { type: "spring", stiffness: 320, damping: 32, mass: 0.8 },
      opacity: { duration: 0.2 },
    },
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
    transition: {
      x: { type: "spring", stiffness: 320, damping: 32, mass: 0.8 },
      opacity: { duration: 0.18 },
    },
  }),
};

// Countdown timer component
function DeliveryCountdown() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, mins: 0 });

  useEffect(() => {
    function calcTime() {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft({ hours, mins });
    }
    calcTime();
    const interval = setInterval(calcTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <p className="text-sm text-[#3d2e1a] text-center">
      For Fastest delivery, order within{" "}
      <span className="font-bold">{timeLeft.hours} hrs {timeLeft.mins} mins</span>
    </p>
  );
}

const ratingLabels = {
  1: "1/5 - Poor",
  2: "2/5 - Fair",
  3: "3/5 - Good",
  4: "4/5 - Very Good",
  5: "5/5 - Excellent!",
};

export default function ProductDetails({ product, relatedProducts }) {
  const productImages = useMemo(() => {
    if (Array.isArray(product.images) && product.images.length > 0) return product.images;
    if (Array.isArray(product.featureImages) && product.featureImages.length > 0) return product.featureImages;
    if (product.formulaimage) return [product.formulaimage];
    return ["/placeholder.png"];
  }, [product]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedPack, setSelectedPack] = useState(null);
  const [buyNowOpen, setBuyNowOpen] = useState(false);
  const [buyDetails, setBuyDetails] = useState({ fullName: "", phone: "", addressLine: "", city: "", state: "", pincode: "" });
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewData, setReviewData] = useState({ name: "", rating: 5, comment: "", title: "", imageFile: null });
  const [hoverRating, setHoverRating] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [reviewSort, setReviewSort] = useState("recent");
  const [reviewsList, setReviewsList] = useState(product.reviews || []);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const router = useRouter();

  // Always ensure the page starts at the top when viewing product details
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [product?.slug]);

  // Pack system
  const packs = useMemo(() => {
    if (product.packs && product.packs.length > 0) {
      return product.packs;
    }
    // Default single pack if no packs configured
    return [{
      label: "1 Month",
      packCount: 1,
      sachets: product.sachets || null,
      price: product.discountPrice || product.price,
      mrp: product.price,
      mostPopular: false,
    }];
  }, [product]);

  const benefitsList = useMemo(() => {
    // 1. If product.keyBenefits is provided as an array of items { text, image }
    if (Array.isArray(product.keyBenefits) && product.keyBenefits.length > 0) {
      return product.keyBenefits.map((item, idx) => ({
        text: typeof item === "string" ? item : (item?.text || ""),
        image: (typeof item === "object" && item?.image)
          ? item.image
          : (Array.isArray(product.benefitImages) && product.benefitImages[idx])
            ? product.benefitImages[idx]
            : `/feature/${(idx % 8) + 1}.svg`,
      }));
    }

    // 2. Fallback to product.benefits + product.benefitImages (cleanse any legacy product gallery image)
    if (Array.isArray(product.benefits) && product.benefits.length > 0) {
      return product.benefits.map((text, idx) => {
        let img = (Array.isArray(product.benefitImages) && product.benefitImages[idx])
          ? product.benefitImages[idx]
          : null;
        if (!img || img.includes("pilecurex") || img.includes("floramade") || img.includes("/upload/v")) {
          const defaults = ["/feature/3.svg", "/feature/4.svg", "/feature/1.svg", "/feature/2.svg"];
          img = defaults[idx % defaults.length] || `/feature/${(idx % 8) + 1}.svg`;
        }
        return { text, image: img };
      });
    }

    // 3. Category based fallbacks
    if (product.category === 'diabetes') {
      return [
        { text: "Balances Sugar Levels*", image: "/feature/5svg.svg" },
        { text: "Enhances Insulin Sensitivity*", image: "/feature/6.svg" },
        { text: "Reduces Sugar Cravings*", image: "/feature/2.svg" },
        { text: "Improves Heart Health*", image: "/feature/8.svg" },
      ];
    }
    return [
      { text: "Relief from Discomfort", image: "/feature/3.svg" },
      { text: "Better Results", image: "/feature/4.svg" },
      { text: "Reduces Gas and Bloating*", image: "/feature/1.svg" },
      { text: "Promotes Healthy Digestion*", image: "/feature/2.svg" },
    ];
  }, [product]);

  useEffect(() => {
    setActiveIdx(0);
    setSlideDirection(0);
    // Auto-select the most popular pack, or the first pack
    if (packs.length > 0) {
      const popular = packs.find(p => p.mostPopular);
      setSelectedPack(popular || packs[0]);
    }
  }, [product._id, packs]);

  const slideTo = (newIdx) => {
    if (productImages.length <= 1 || newIdx === activeIdx) return;
    setSlideDirection(newIdx > activeIdx ? 1 : -1);
    setActiveIdx(newIdx);
  };

  const nextSlide = () => {
    if (productImages.length <= 1) return;
    setSlideDirection(1);
    setActiveIdx((prev) => (prev + 1) % productImages.length);
  };

  const prevSlide = () => {
    if (productImages.length <= 1) return;
    setSlideDirection(-1);
    setActiveIdx((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  // Current effective price based on selected pack
  const currentPrice = selectedPack?.price || product.discountPrice || product.price;
  const currentMRP = selectedPack?.mrp || product.price;
  const savings = currentMRP - currentPrice;

  // Rating distribution
  const ratingDistribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    (reviewsList || []).forEach(r => {
      const rating = Math.min(5, Math.max(1, r.rating || 5));
      dist[rating - 1]++;
    });
    return dist.reverse(); // 5-star first
  }, [reviewsList]);

  const totalReviews = reviewsList?.length || product.reviewsCount || 0;

  // Sorted reviews
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

  function handleAddToCart() {
    const cartItem = {
      ...product,
      selectedPack: selectedPack,
      price: currentMRP,
      discountPrice: currentPrice,
    };
    for (let i = 0; i < quantity; i++) {
      addToCart(cartItem);
    }
    toast.success(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart`);
  }

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
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: JSON.stringify({ file: await fileToBase64(file), type: 'image' }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      return data.url;
    } catch (error) {
      toast.error('Image upload failed');
      return null;
    }
  }


  async function handleWishlist() {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  }

  function buyNow() {
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
      selectedPack: selectedPack,
    }];
    localStorage.setItem("fiveetatv-buy-now-items", JSON.stringify(buyNowItem));
    localStorage.setItem("fiveetatv-buy-now-address", JSON.stringify(buyDetails));
    setBuyNowOpen(false);
    router.push("/checkout");
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      toast.success(data.message || "Review submitted successfully!");
      if (data.review) {
        setReviewsList((prev) => [data.review, ...prev]);
      }
      router.refresh();
      setReviewOpen(false);
      setReviewData({ name: "", rating: 5, comment: "", title: "", imageFile: null });
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
    } catch (error) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="w-full bg-[#faf6ef] text-[#3d2e1a] pb-8 md:pb-12 pt-24 md:pt-32 lg:pt-36">
      <ProductStructuredData product={product} />
      
      {/* HERO SECTION */}
      <section className="relative w-full pb-8 md:pb-12 lg:pb-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* 1. IMAGES SECTION */}
            <div className="w-full flex flex-col gap-4">
              <div 
                className="relative aspect-square w-full max-w-[520px] mx-auto overflow-hidden bg-transparent rounded-2xl md:rounded-[2rem] shadow-[0_8px_30px_-12px_rgba(57,22,13,0.08)] select-none"
              >
                <AnimatePresence initial={false} custom={slideDirection} mode="popLayout">
                  <motion.div
                    key={activeIdx}
                    custom={slideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    drag={productImages.length > 1 ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_, { offset, velocity }) => {
                      const swipe = offset.x;
                      if (swipe < -40 || velocity.x < -350) {
                        nextSlide();
                      } else if (swipe > 40 || velocity.x > 350) {
                        prevSlide();
                      }
                    }}
                    className="absolute inset-0 w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
                  >
                    <Image 
                      src={productImages[activeIdx] || '/placeholder.png'} 
                      alt={`${product.name} - ${activeIdx + 1}`} 
                      fill 
                      quality={90}
                      draggable={false}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQCEAwEPwAB//9k="
                      className="object-contain select-none pointer-events-none p-0" 
                      priority={activeIdx === 0}
                      onError={(e) => {
                        e.target.src = '/placeholder.png';
                      }}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                {productImages.length > 1 && (
                  <div className="absolute inset-x-2 sm:inset-x-3 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-20">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        prevSlide();
                      }}
                      aria-label="Previous image"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-md border border-[#e3dac8] shadow-md text-[#3d2e1a] flex items-center justify-center pointer-events-auto hover:bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      <ChevronLeft size={20} className="text-[#3d2e1a]" />
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        nextSlide();
                      }}
                      aria-label="Next image"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-md border border-[#e3dac8] shadow-md text-[#3d2e1a] flex items-center justify-center pointer-events-auto hover:bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      <ChevronRight size={20} className="text-[#3d2e1a]" />
                    </button>
                  </div>
                )}

                {/* Progress Indicators */}
                {productImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#E8D9C5]/80 shadow-sm pointer-events-auto">
                    {productImages.map((_, i) => (
                      <button 
                        key={i} 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          slideTo(i);
                        }}
                        aria-label={`Go to slide ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          activeIdx === i ? 'w-5 bg-[#872B10]' : 'w-1.5 bg-[#3d2e1a]/30 hover:bg-[#3d2e1a]/60'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              {productImages.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-4 px-1 no-scrollbar scroll-smooth snap-x max-w-full mx-auto justify-start sm:justify-center">
                  {productImages.map((img, idx) => (
                    <button 
                      key={`${img}-${idx}`} 
                      type="button"
                      onClick={() => slideTo(idx)}
                      aria-label={`View image ${idx + 1}`}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-xl flex-shrink-0 snap-start transition-all border-2 bg-transparent cursor-pointer ${
                        activeIdx === idx 
                          ? 'border-[#872B10] shadow-sm scale-105' 
                          : 'border-[#E8D9C5]/80 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image 
                        src={img} 
                        alt={`${product.name} thumbnail ${idx + 1}`} 
                        fill 
                        quality={75} 
                        placeholder="blur" 
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQCEAwEPwAB//9k=" 
                        className="object-contain p-1.5 select-none pointer-events-none" 
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* 2. CONTENT SECTION */}
            <div className="flex flex-col gap-5 md:gap-6">
              {/* Product Badges, Title, Rating & Description */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#872B10]/10 border border-[#872B10]/20 text-[#872B10] text-xs font-bold uppercase tracking-wider">
                    <Leaf size={12} className="text-[#872B10]" />
                    {product.category || "100% Ayurvedic"}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#39160D]/5 border border-[#39160D]/10 text-[#39160D] text-xs font-semibold">
                    ✓ Lab Tested & Pure
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-serif font-medium tracking-tight text-[#39160D] leading-[1.25]">
                  {product.name}
                </h1>

                {/* Average Rating & Verified Reviews */}
                <div className="flex flex-wrap items-center gap-3 pt-0.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 shadow-sm">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          size={13} 
                          className={i < Math.round(product.rating || 4.8) ? "fill-amber-400 text-amber-400" : "text-amber-200"} 
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-[#39160D]">
                      {Number(product.rating || 4.8).toFixed(1)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-xs font-medium text-[#872B10] hover:text-[#39160D] hover:underline transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>({totalReviews > 0 ? totalReviews : (product.reviewsCount || 48)} reviews)</span>
                    <span className="text-[#39160D]/30">•</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={12} /> 98% Recommended
                    </span>
                  </button>
                </div>

                {/* Enhanced Product Description */}
                {product.description ? (
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-white/80 border border-[#E8D9C5] shadow-sm">
                    <p className={`text-xs sm:text-[13.5px] leading-relaxed text-[#39160D]/85 font-normal transition-all ${
                      !showFullDesc && product.description.length > 220 ? "line-clamp-3" : ""
                    }`}>
                      {product.description}
                    </p>
                    {product.description.length > 220 && (
                      <button 
                        type="button"
                        onClick={() => setShowFullDesc(!showFullDesc)}
                        className="mt-1 text-xs font-semibold text-[#872B10] hover:text-[#39160D] hover:underline transition-colors"
                      >
                        {showFullDesc ? "Read less" : "Read more..."}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-white/80 border border-[#E8D9C5] text-xs sm:text-[13.5px] leading-relaxed text-[#39160D]/75 italic shadow-sm">
                    Pure Ayurvedic formulation crafted with time-tested herbs for holistic wellness and fast, natural relief.
                  </div>
                )}
              </div>

              {/* KEY BENEFITS SECTION */}
              <div className="rounded-3xl border border-[#E8D9C5] bg-white p-4 sm:p-5 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between border-b border-[#39160D]/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#872B10]" />
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#39160D]">Key Benefits</h3>
                  </div>
                  <span className="text-[10px] font-semibold text-[#872B10] bg-[#872B10]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Herbal Efficacy
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  {benefitsList.map((item, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-[#FFF7EB]/70 border border-[#E8D9C5]/80 hover:bg-[#FFF7EB] hover:border-[#872B10]/40 transition-all group"
                    >
                      <div className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-gradient-to-br from-[#dfc77f] via-[#c9a84c] to-[#8e6b28] p-[1.5px] shadow-sm shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden relative">
                          <Image 
                            src={item.image} 
                            alt={item.text} 
                            fill 
                            className="object-contain" 
                          />
                        </div>
                      </div>
                      <span className="text-xs sm:text-[13px] font-semibold text-[#39160D] leading-snug line-clamp-2 capitalize">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PACK SELECTION */}
              {packs.length > 0 && (
                <div className="space-y-3">
                  <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(packs.length, 3)}, 1fr)` }}>
                    {packs.map((pack, idx) => {
                      const isSelected = selectedPack === pack;
                      const packSavings = pack.mrp - pack.price;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedPack(pack)}
                          className={`relative flex flex-col p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 transition-all duration-200 text-left ${
                            isSelected 
                              ? 'border-[#39160D] bg-white ring-2 ring-[#39160D]/10 shadow-lg shadow-[#39160D]/5' 
                              : 'border-[#E8D9C5] bg-white/70 hover:bg-white hover:border-[#39160D]/30'
                          }`}
                        >
                          {/* Most Popular / Save badge */}
                          {pack.mostPopular && (
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 bg-[#39160D] text-[#FFF7EB] text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md whitespace-nowrap">
                              ★ Most Popular
                            </span>
                          )}
                          {packSavings > 0 && !pack.mostPopular && (
                            <span className="absolute -top-3 right-4 px-2.5 py-0.5 bg-[#872B10] text-[#FFF7EB] text-[10px] font-bold rounded-full shadow-md uppercase tracking-wider">
                              Save ₹{packSavings}
                            </span>
                          )}

                          {/* Checkmark Radio */}
                          <div className={`absolute top-3.5 right-3.5 h-5 w-5 rounded-full flex items-center justify-center transition-all ${
                            isSelected ? 'bg-[#39160D] text-[#FFF7EB] shadow-sm' : 'border-2 border-[#E8D9C5] bg-white/80'
                          }`}>
                            {isSelected && <CheckCircle2 size={13} className="text-[#FFF7EB]" />}
                          </div>

                          {/* Pack Image */}
                          {pack.image && (
                            <div className="relative w-10 h-10 mb-2">
                              <Image src={pack.image} alt={pack.label} fill className="object-contain" />
                            </div>
                          )}

                          <span className="text-sm sm:text-base font-bold text-[#39160D] tracking-tight">{pack.label || `Pack of ${pack.packCount}`}</span>
                          <span className="text-xs text-[#39160D]/60 font-medium mt-0.5">Pack of {pack.packCount}{pack.sachets ? ` • ${pack.sachets} Sachets` : ''}</span>
                          
                          <div className="mt-3 pt-2.5 border-t border-[#39160D]/10">
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl sm:text-2xl font-bold text-[#39160D] tracking-tight">₹{pack.price}</span>
                              {pack.mrp > pack.price && (
                                <span className="text-xs text-[#39160D]/50 line-through">MRP: ₹{pack.mrp}</span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#39160D]/55 font-medium block mt-0.5">Inclusive of all taxes</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Delivery Countdown */}
              <div className="py-3 border-t border-b border-[#E8D9C5]">
                <DeliveryCountdown />
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  <button 
                    onClick={handleAddToCart}
                    className="h-12 sm:h-14 rounded-xl sm:rounded-full bg-[#FFFDF9] border border-[#39160D] sm:border-2 text-[#39160D] flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-[#39160D]/5 transition-all active:scale-[0.97] font-bold text-xs sm:text-sm uppercase tracking-tight sm:tracking-wider shadow-sm cursor-pointer"
                  >
                    <ShoppingBag size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span>Add to cart</span>
                  </button>
                  <button 
                    onClick={() => setBuyNowOpen(true)}
                    className="h-12 sm:h-14 rounded-xl sm:rounded-full bg-[#39160D] text-[#FFF7EB] flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-[#4E2014] transition-all active:scale-[0.97] font-bold text-xs sm:text-sm uppercase tracking-tight sm:tracking-wider shadow-md sm:shadow-lg shadow-[#39160D]/20 cursor-pointer"
                  >
                    <Zap size={16} fill="currentColor" className="sm:w-[18px] sm:h-[18px]" />
                    <span>BUY NOW</span>
                  </button>
                </div>

                {/* Online payment discount banner */}
                <div className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#872B10]/10 rounded-full border border-[#872B10]/20 text-center">
                  <Zap size={14} className="fill-[#872B10] text-[#872B10]" />
                  <span className="text-xs font-bold text-[#872B10]">Extra ₹100 Off On Online Payment (Prepaid UPI / Card)</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="relative w-full aspect-[5/1] overflow-hidden rounded-xl">
                <Image 
                  src="https://res.cloudinary.com/dqk8v040t/image/upload/v1778585412/pg_zs4xez.webp" 
                  alt="Payment Gateway Trust Badges" 
                  fill 
                  className="object-contain" 
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div className="flex items-center justify-center gap-3 py-2">
                <ShieldCheck size={16} className="text-[#a98235]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8a7b6b]">100% Secure Checkout & Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CERTIFIED NATURAL GOODNESS (2 by 2 on Mobile, 4 on Desktop) */}
      <section className="py-10 md:py-14 bg-[#faf6ef]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#39160D] tracking-tight">
              Certified Natural Goodness For You
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-sm sm:max-w-md md:max-w-4xl mx-auto">
            {[
              { image: "/certificate/1.svg", label: "Quality You\nCan Trust", sublabel: "Gluten Free" },
              { image: "/certificate/2.svg", label: "100% Pure\n& Vegan", sublabel: "Pure Natural" },
              { image: "/certificate/3.svg", label: "Clinical Tested\nIngredients", sublabel: "Expert Formulation" },
              { image: "/certificate/4.svg", label: "Certified Organic\n& GMO Free", sublabel: "GMO Free" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center gap-3 w-full"
              >
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden shadow-md border border-[#dfc77f]/50 bg-white transition-transform hover:scale-105 flex items-center justify-center">
                  <Image 
                    src={item.image} 
                    alt={item.label.replace('\n', ' ')} 
                    fill 
                    className="object-contain" 
                  />
                </div>
                <div className="text-center">
                  <p className="text-[11px] sm:text-xs font-bold text-[#3d2e1a] leading-tight whitespace-pre-line">{item.label}</p>
                  {item.sublabel && (
                    <span className="block text-[9px] uppercase tracking-wider text-[#8a7b6b] mt-0.5 font-medium">{item.sublabel}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INGREDIENTS */}
      {(product.ingredients || []).length > 0 && (
      <section className="py-14 md:py-20 bg-[#FFF7EB] border-t border-[#E8D9C5]/80 relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
          
          {/* Centered Luxury Header */}
          <motion.div {...fadeUp} className="text-center mb-10 md:mb-14 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#39160D]/5 border border-[#39160D]/10 text-[#872B10] text-[11px] font-bold uppercase tracking-widest">
              <Leaf size={12} className="text-[#872B10]" /> Pure Botanical Formula
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#39160D] font-medium tracking-tight mt-2.5">
              Key Natural Ingredients
            </h2>
            <p className="text-xs sm:text-sm text-[#39160D]/65 mt-2 max-w-lg mx-auto leading-relaxed">
              Rooted in authentic Ayurveda, carefully formulated with pure botanical extracts for natural balance and vitality.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {(() => {
              const getIngredientData = (name) => {
                const clean = String(name || "").toLowerCase().trim();
                const map = {
                  "ajwain": { img: "/ingredients/Carom_Seeds-English.webp", color: "bg-amber-700" },
                  "saunf": { img: "/ingredients/Saunf-eng.webp", color: "bg-amber-600" },
                  "hing": { img: "/ingredients/Hing-eng.webp", color: "bg-amber-600" },
                  "hing (asafoetida)": { img: "/ingredients/Hing-eng.webp", color: "bg-amber-600" },
                  "jeera": { img: "/ingredients/Jeera-eng.webp", color: "bg-amber-500" },
                  "sonth": { img: "/ingredients/Jeera-eng.webp", color: "bg-orange-400" },
                  "sonth (ginger)": { img: "/ingredients/Jeera-eng.webp", color: "bg-orange-400" },
                  "pippali": { img: "/ingredients/Pudina-Ind_20901f19-a6e7-4936-a78d-c4373c5282ab.webp", color: "bg-amber-600" },
                  "haritaki": { img: "/ingredients/Haritaki_4e781681-e0e8-490c-97fd-e0494b52cc5b.webp", color: "bg-yellow-600" },
                  "amla": { img: "/ingredients/Amla.webp", color: "bg-amber-600" },
                  "awala": { img: "/ingredients/Amla.webp", color: "bg-amber-600" },
                  "bahera": { img: "/ingredients/Bibhitaki.webp", color: "bg-amber-500" },
                  "bibhitaki": { img: "/ingredients/Bibhitaki.webp", color: "bg-amber-500" },
                  "kala namak": { img: "/ingredients/Kala_Namak-eng.webp", color: "bg-slate-400" },
                  "kali mirch": { img: "/ingredients/Kali_Mirch-eng.webp", color: "bg-slate-600" },
                  "neem": { img: "/ingredients/neem.webp", color: "bg-amber-800" },
                  "karela": { img: "/ingredients/karela.jpg", color: "bg-amber-700" },
                  "karela (bitter gourd)": { img: "/ingredients/karela.jpg", color: "bg-amber-700" },
                  "jamun": { img: "/ingredients/jamun.jpg", color: "bg-purple-800" },
                  "jamun (java plum)": { img: "/ingredients/jamun.jpg", color: "bg-purple-800" },
                  "gudmar": { img: "/ingredients/gurmar.webp", color: "bg-amber-700" },
                  "gurmar": { img: "/ingredients/gurmar.webp", color: "bg-amber-700" },
                  "gudmar (gymnema sylvestre)": { img: "/ingredients/gurmar.webp", color: "bg-amber-700" },
                  "paneer dodi": { img: "/ingredients/panner godi.jfif", color: "bg-amber-600" },
                  "vijaysar": { img: "/ingredients/vijaysar.jfif", color: "bg-amber-600" },
                  "vijaysar (indian kino tree)": { img: "/ingredients/vijaysar.jfif", color: "bg-amber-600" },
                  "methi": { img: "/ingredients/methi.jpg", color: "bg-amber-700" },
                  "triphala": { img: "/ingredients/triphala.jpg", color: "bg-amber-700" },
                  "pudina": { img: "/ingredients/Pudina-Ind_20901f19-a6e7-4936-a78d-c4373c5282ab.webp", color: "bg-emerald-700" },
                };
                return map[clean] || { img: null, color: "bg-amber-700" };
              };

              return (product.ingredients || []).slice(0, 10).map((ing, i) => {
                const rawName = typeof ing === 'string' ? ing : ing?.name || "";
                const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
                const ingData = getIngredientData(rawName);
                const ingredientImage = product.ingredientImages?.[rawName] || product.ingredientImages?.[displayName] || ingData.img;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="group flex flex-col items-center justify-between p-4 sm:p-5 rounded-2xl bg-white border border-[#E8D9C5] shadow-[0_4px_16px_-6px_rgba(57,22,13,0.06)] hover:shadow-[0_12px_24px_-8px_rgba(57,22,13,0.12)] hover:-translate-y-1 transition-all duration-300 text-center"
                  >
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 border-2 border-[#DFC77F]/60 bg-[#FFF7EB] shadow-inner mb-3 overflow-hidden flex items-center justify-center shrink-0">
                      {ingredientImage ? (
                        <div className="relative w-full h-full rounded-full overflow-hidden">
                          <Image 
                            src={ingredientImage} 
                            alt={displayName} 
                            fill 
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className={`relative w-full h-full rounded-full overflow-hidden ${ingData.color} flex items-center justify-center`}>
                          <span className="text-xl sm:text-2xl font-bold text-white uppercase">{displayName.charAt(0)}</span>
                        </div>
                      )}
                    </div>

                    <div className="w-full">
                      <h4 className="text-xs sm:text-sm font-bold text-[#39160D] capitalize tracking-tight group-hover:text-[#872B10] transition-colors line-clamp-1">
                        {displayName}
                      </h4>
                      <span className="inline-block mt-1 text-[9px] sm:text-[10px] font-semibold text-[#872B10] bg-[#872B10]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        100% Herbal
                      </span>
                    </div>
                  </motion.div>
                );
              });
            })()}
          </div>
        </div>
      </section>
      )}

      {/* HOW TO USE */}
      {(product.usage || []).length > 0 && (
        <section className="py-14 md:py-20 bg-[#FFFBF5] border-t border-[#E8D9C5]/80">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 md:px-8 lg:px-12">
            
            {/* Centered Luxury Header */}
            <motion.div {...fadeUp} className="text-center mb-10 md:mb-14 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#39160D]/5 border border-[#39160D]/10 text-[#872B10] text-[11px] font-bold uppercase tracking-widest">
                <Sparkles size={12} className="text-[#872B10]" /> Simple Daily Routine
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#39160D] font-medium tracking-tight mt-2.5">
                How to Use for Best Results
              </h2>
              <p className="text-xs sm:text-sm text-[#39160D]/65 mt-2 max-w-lg mx-auto leading-relaxed">
                Follow this simple daily ritual consistently to experience optimal Ayurvedic balance and vitality.
              </p>
            </motion.div>

            <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-[1100px] mx-auto">
              {product.usage.map((step, index) => {
                const stepTitles = [
                  "Measure & Scoop",
                  "Mix with Water",
                  "Consume Daily",
                  "Consistent Routine",
                  "Optimal Intake"
                ];
                const defaultTitle = stepTitles[index] || `Step ${index + 1}`;

                return (
                  <motion.article
                    key={`${index}-${step}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex flex-col rounded-3xl border border-[#E8D9C5] bg-white shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                  >
                    {/* Step Image */}
                    {product.usageImages?.[index] ? (
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF6EE]">
                        <Image 
                          src={product.usageImages[index]} 
                          alt={`Step ${index + 1}: ${step}`} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-700" 
                          sizes="(max-width: 768px) 100vw, 33vw" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
                        
                        {/* Floating Step Pill Badge */}
                        <div className="absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#39160D]/90 backdrop-blur-md text-[#FFF7EB] text-[11px] font-bold uppercase tracking-wider shadow-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#DFC77F]" />
                          Step {String(index + 1).padStart(2, "0")}
                        </div>
                      </div>
                    ) : (
                      <div className="h-28 bg-[#FFF7EB] border-b border-[#E8D9C5] flex items-center justify-between px-6">
                        <span className="text-3xl font-serif font-bold text-[#DFC77F]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-[#39160D] text-[#FFF7EB] text-xs font-bold uppercase tracking-wider">
                          Step {index + 1}
                        </span>
                      </div>
                    )}

                    {/* Step Text Info */}
                    <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 bg-white">
                      <div>
                        <h3 className="text-base font-bold text-[#39160D] mb-1.5 group-hover:text-[#872B10] transition-colors">
                          {defaultTitle}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#39160D]/75 leading-relaxed capitalize">
                          {step}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#39160D]/10 flex items-center justify-between text-xs text-[#872B10] font-semibold">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="text-[#872B10]" /> Daily Recommendation
                        </span>
                        <span className="text-[11px] text-[#39160D]/45 font-normal">
                          Step {index + 1} of {product.usage.length}
                        </span>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CUSTOMER REVIEWS */}
      <section id="reviews-section" className="py-14 md:py-20 bg-[#FFF7EB] border-t border-[#E8D9C5]/80">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-[#3d2e1a]">Customer Reviews</h2>
          </motion.div>

          {/* Rating Summary */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8 p-6 sm:p-8 bg-white rounded-3xl border border-[#E8D9C5] shadow-sm">
            {/* Left: Average Rating */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl sm:text-5xl font-serif font-bold text-[#39160D]">
                {Number(product.rating || 4.8).toFixed(1)}
              </span>
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} className={i < Math.round(product.rating || 4.8) ? "fill-amber-400 text-amber-400" : "text-[#E8D9C5]"} />
                ))}
              </div>
              <span className="text-xs text-[#39160D]/60 font-medium">
                Based on {totalReviews > 0 ? totalReviews : (product.reviewsCount || 48)} reviews
              </span>
            </div>

            {/* Center: Rating Bars */}
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
                    <div className="flex-1 h-2.5 bg-[#39160D]/10 rounded-full overflow-hidden">
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

            {/* Right: Write Review Button */}
            <div>
              <button 
                onClick={() => setReviewOpen(true)}
                className="px-6 py-3 bg-[#39160D] text-[#FFF7EB] rounded-full font-bold text-xs uppercase tracking-wider hover:bg-[#4E2014] transition-all shadow-md whitespace-nowrap active:scale-95"
              >
                Write a review
              </button>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-semibold text-[#39160D]/60 uppercase tracking-wider">
              Customer Feedback
            </span>
            <select
              value={reviewSort}
              onChange={(e) => setReviewSort(e.target.value)}
              className="text-xs sm:text-sm border border-[#E8D9C5] rounded-full px-3.5 py-1.5 bg-white text-[#39160D] outline-none shadow-sm font-medium cursor-pointer"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>

          {/* Review Cards */}
          <div className="space-y-6">
            {sortedReviews.map((review, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="pb-6 border-b border-[#E8D9C5]/80 last:border-0"
              >
                {/* Stars + Date */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} size={15} className={idx < (review.rating || 5) ? "fill-amber-400 text-amber-400" : "text-[#E8D9C5]"} />
                    ))}
                  </div>
                  {review.createdAt && (
                    <span className="text-xs text-[#39160D]/50 font-medium">
                      {new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  )}
                </div>

                {/* Reviewer info */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {review.image ? (
                      <img src={review.image} alt={review.name} className="w-8 h-8 rounded-full object-cover border border-[#E8D9C5]" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#39160D]/10 flex items-center justify-center text-[#872B10] font-bold text-xs border border-[#E8D9C5]">
                        {review.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <span className="text-sm font-bold text-[#39160D] capitalize">{review.name}</span>
                    {review.approved !== false && (
                      <span className="px-2 py-0.5 bg-[#872B10]/10 text-[#872B10] border border-[#872B10]/20 text-[10px] font-bold rounded-full">
                        ✓ Verified Buyer
                      </span>
                    )}
                  </div>
                </div>

                {/* Review title & content */}
                {review.title && (
                  <h4 className="font-bold text-sm text-[#39160D] mb-1">{review.title}</h4>
                )}
                <p className="text-sm text-[#39160D]/80 leading-relaxed font-normal">{review.comment}</p>
              </motion.div>
            ))}
          </div>

          {sortedReviews.length === 0 && (
            <div className="text-center py-10">
              <p className="text-[#8a7b6b]">No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-14 md:py-20 bg-[#FFF7EB] border-t border-[#E8D9C5]/80">
        <div className="max-w-[840px] mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center mb-10 md:mb-12">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#39160D]/5 border border-[#39160D]/10 text-[#872B10] text-[11px] font-bold uppercase tracking-widest">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#39160D] font-medium tracking-tight mt-2.5">
              Frequently Asked Questions
            </h2>
          </motion.div>
          <div className="space-y-3">
            {(product.faqs || [
              { question: "How do I use this product?", answer: "Follow the usage instructions provided on the packaging. Consult with an Ayurvedic practitioner for personalized guidance." },
              { question: "Is this product suitable for daily use?", answer: "Yes, all our products are formulated for daily use following Ayurvedic principles. However, we recommend consulting with an Ayurvedic practitioner for personalized dosage guidance." },
              { question: "Are there any side effects?", answer: "Our products are made from 100% natural ingredients and are generally safe for consumption. However, if you have any specific health conditions or are pregnant/nursing, please consult your healthcare provider before use." },
              { question: "How long does it take to see results?", answer: "Ayurvedic remedies work holistically and results may vary from person to person. Typically, consistent use for 4-6 weeks shows noticeable improvements in overall well-being." },
              { question: "Does this product provide long-lasting support?", answer: "Yes, with regular and consistent use, our Ayurvedic formulations are designed to provide sustained, long-lasting wellness benefits." }
            ]).map((faq, i) => (
              <motion.details 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group bg-white rounded-2xl border border-[#e3dac8] overflow-hidden shadow-sm [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center gap-3 p-5 cursor-pointer text-sm sm:text-base font-semibold text-[#3d2e1a]">
                  <span className="text-[#a98235] font-bold text-sm min-w-[28px]">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex-1">{faq.question}</span>
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#3d2e1a] flex items-center justify-center text-white transition-transform group-open:rotate-45">
                    <Plus size={14} />
                  </div>
                </summary>
                <div className="px-5 pb-5 pl-[60px] text-[#5a4730] font-light leading-relaxed text-sm">
                  {faq.answer}
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 mt-8">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-medium text-[#3d2e1a]">You May Also Like</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((item, i) => (
              <motion.div 
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={`/product/${item.slug}`} className="block group">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-transparent mb-4 border border-[#E8D9C5]/80 flex items-center justify-center p-3">
                    <Image src={item.images?.[0] || '/placeholder.png'} alt={item.name} fill className="object-contain p-2 group-hover:scale-[1.02] transition-transform duration-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-[#3d2e1a]">{item.name}</h3>
                    <p className="text-sm font-medium text-[#a98235]">₹{item.discountPrice}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* REVIEW MODAL */}
      <Modal 
        open={reviewOpen} 
        title="Write a Review" 
        subtitle={`Reviewing ${product.name}`}
        onClose={() => setReviewOpen(false)}
      >
        <div className="space-y-5">
          {/* Rating Stars with Hover & Dynamic Text */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#39160D]/80">
                Your Rating <span className="text-red-500">*</span>
              </label>
              <span className="text-xs font-semibold text-[#872B10]">
                {ratingLabels[hoverRating || reviewData.rating]}
              </span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-[#E8D9C5] shadow-sm">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating || reviewData.rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setReviewData((prev) => ({ ...prev, rating: star }))}
                    className="p-1 hover:scale-125 active:scale-95 transition-all duration-150 focus:outline-none"
                    aria-label={`Rate ${star} star`}
                  >
                    <Star 
                      size={28} 
                      fill={active ? "#E5A83B" : "none"} 
                      className={active ? "text-[#E5A83B] filter drop-shadow-sm" : "text-[#E8D9C5]"} 
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name & Title */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#39160D]/80">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={reviewData.name}
                onChange={(e) => setReviewData((prev) => ({ ...prev, name: e.target.value }))}
                className="h-11 sm:h-12 w-full rounded-xl border border-[#E8D9C5] bg-white px-4 text-sm text-[#39160D] outline-none transition placeholder:text-[#39160D]/35 focus:border-[#39160D] focus:ring-1 focus:ring-[#39160D]/20 shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#39160D]/80">
                Review Title <span className="text-[#39160D]/40 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Excellent Ayurvedic remedy!"
                value={reviewData.title}
                onChange={(e) => setReviewData((prev) => ({ ...prev, title: e.target.value }))}
                className="h-11 sm:h-12 w-full rounded-xl border border-[#E8D9C5] bg-white px-4 text-sm text-[#39160D] outline-none transition placeholder:text-[#39160D]/35 focus:border-[#39160D] focus:ring-1 focus:ring-[#39160D]/20 shadow-sm"
              />
            </div>

            {/* Photo Upload Dropzone */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#39160D]/80">
                Your Photo <span className="text-[#39160D]/40 font-normal">(Optional)</span>
              </label>
              
              {imagePreview ? (
                <div className="relative flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#E8D9C5] shadow-sm">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#E8D9C5]">
                    <Image src={imagePreview} alt="Review attachment" fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#39160D] truncate">
                      {reviewData.imageFile?.name || "Photo selected"}
                    </p>
                    <p className="text-[10px] text-[#39160D]/50 mt-0.5">
                      {reviewData.imageFile ? `${(reviewData.imageFile.size / 1024).toFixed(1)} KB` : "Ready"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-2 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                    title="Remove photo"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 p-4 sm:p-5 rounded-2xl border-2 border-dashed border-[#E8D9C5] hover:border-[#39160D]/40 bg-white/70 hover:bg-white cursor-pointer transition-all duration-300 group shadow-sm">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageSelect(e.target.files?.[0])}
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-full bg-[#FFF7EB] border border-[#E8D9C5] flex items-center justify-center text-[#872B10] group-hover:scale-110 transition-transform">
                    <Camera size={18} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-[#39160D] group-hover:text-[#872B10] transition-colors">
                      Click to upload a photo
                    </p>
                    <p className="text-[10px] text-[#39160D]/50 mt-0.5">
                      PNG, JPG or WEBP (Max 5MB)
                    </p>
                  </div>
                </label>
              )}
            </div>

            {/* Review Comment */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#39160D]/80">
                  Your Review <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-[#39160D]/45 font-medium">
                  {reviewData.comment.length} characters
                </span>
              </div>
              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData((prev) => ({ ...prev, comment: e.target.value }))}
                className="w-full px-4 py-3 rounded-2xl border border-[#E8D9C5] focus:outline-none focus:border-[#39160D] focus:ring-1 focus:ring-[#39160D]/20 min-h-[110px] bg-white text-sm text-[#39160D] placeholder:text-[#39160D]/35 shadow-sm resize-none transition-all"
                placeholder="Share your experience with this product... How did it help your health?"
                rows={4}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmitReview}
            disabled={uploading || !reviewData.name.trim() || !reviewData.comment.trim()}
            className="w-full h-12 rounded-full bg-[#39160D] text-[#FFF7EB] font-bold text-xs uppercase tracking-[0.16em] hover:bg-[#4E2014] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl transition-all duration-300 active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#FFF7EB]/30 border-t-[#FFF7EB] rounded-full animate-spin" />
                <span>Submitting Review...</span>
              </>
            ) : (
              <>
                <Sparkles size={15} />
                <span>Submit Review</span>
              </>
            )}
          </button>
        </div>
      </Modal>

      {/* BUY NOW MODAL */}
      <Modal open={buyNowOpen} title="Quick Checkout" subtitle="Complete your order details" onClose={() => setBuyNowOpen(false)}>
        <div className="space-y-5">
          {/* Show selected pack info */}
          {selectedPack && (
            <div className="flex items-center gap-3 p-3.5 bg-[#FFF7EB] rounded-2xl border border-[#E8D9C5] shadow-sm">
              {product.images?.[0] && (
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#E8D9C5]">
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#39160D] truncate">{product.name}</p>
                <p className="text-xs text-[#39160D]/60">{selectedPack.label || `Pack of ${selectedPack.packCount}`} × {quantity}</p>
              </div>
              <p className="text-base font-bold text-[#39160D]">₹{currentPrice * quantity}</p>
            </div>
          )}
          
          <div className="space-y-3.5">
            <Input label="Full Name" value={buyDetails.fullName} onChange={(e) => setBuyDetails((prev) => ({ ...prev, fullName: e.target.value }))} />
            <Input label="Phone Number" placeholder="e.g. 9220251059" value={buyDetails.phone} onChange={(e) => setBuyDetails((prev) => ({ ...prev, phone: e.target.value }))} />
            <Input label="Street Address" value={buyDetails.addressLine} onChange={(e) => setBuyDetails((prev) => ({ ...prev, addressLine: e.target.value }))} />
            <div className="grid gap-3 sm:grid-cols-3">
              <Input label="City" value={buyDetails.city} onChange={(e) => setBuyDetails((prev) => ({ ...prev, city: e.target.value }))} />
              <Input label="State" value={buyDetails.state} onChange={(e) => setBuyDetails((prev) => ({ ...prev, state: e.target.value }))} />
              <Input label="Pincode" value={buyDetails.pincode} onChange={(e) => setBuyDetails((prev) => ({ ...prev, pincode: e.target.value }))} />
            </div>
          </div>
          <button 
            onClick={buyNow}
            className="w-full h-12 rounded-full bg-[#39160D] text-[#FFF7EB] font-bold text-xs uppercase tracking-[0.16em] hover:bg-[#4E2014] shadow-xl transition-all duration-300"
          >
            Continue to Payment
          </button>
        </div>
      </Modal>

    </div>
  );
}
