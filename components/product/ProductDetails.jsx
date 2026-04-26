"use client";

import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import toast from "react-hot-toast";
import { CheckCircle2, Leaf, ShieldCheck, ShoppingBag, Star, Zap, Plus, Minus, ArrowRight, Quote, Heart, Award, ChevronLeft, ChevronRight, Phone } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import CertificateSlider from "../home/components/Certificate";
import FloatingLeaf from "@/components/ui/FloatingLeaf";
import DoctorConsultationModal from "@/components/ui/DoctorConsultationModal";

const ProductStructuredData = ({ product }) => {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images,
    "brand": {
      "@type": "Brand",
      "name": "Fiveetatv"
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
        "name": "Fiveetatv"
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

export default function ProductDetails({ product, relatedProducts }) {
  const [activeImg, setActiveImg] = useState(product.images[0]);
  const [isHovering, setIsHovering] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [buyNowOpen, setBuyNowOpen] = useState(false);
  const [buyDetails, setBuyDetails] = useState({ fullName: "", phone: "", addressLine: "", city: "", state: "", pincode: "" });
  const [reviewOpen, setReviewOpen] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [reviewData, setReviewData] = useState({ name: "", rating: 5, comment: "", imageFile: null });
  const [uploading, setUploading] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const router = useRouter();

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart`);
  }

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

  const handleDragChange = (e) => {
    if (!isHovering) return;
    
    // Accumulate movement
    const movementX = e.movementX;
    setDragOffset(prev => prev + movementX);
    
    // Higher sensitivity threshold (pixels) to prevent too fast changes
    const threshold = 120; 

    if (Math.abs(dragOffset) > threshold) {
      const currentIndex = product.images.indexOf(activeImg);
      
      // If current is video or not in images array, we go to first image on swipe
      if (currentIndex === -1) {
        if (product.images && product.images.length > 0) {
          setActiveImg(product.images[0]);
        }
        setDragOffset(0);
        return;
      }

      if (dragOffset > 0) {
        // Drag right -> previous image
        const prevIdx = (currentIndex - 1 + product.images.length) % product.images.length;
        setActiveImg(product.images[prevIdx]);
      } else {
        // Drag left -> next image
        const nextIdx = (currentIndex + 1) % product.images.length;
        setActiveImg(product.images[nextIdx]);
      }
      // Reset accumulator after a swap
      setDragOffset(0);
    }
  };

  const resetDrag = () => {
    setDragOffset(0);
    setIsHovering(false);
  };

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
      price: product.discountPrice,
      image: product.images?.[0],
      slug: product.slug,
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
        return; // handleImageUpload already toasts error
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
          image: imageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      toast.success(data.message || "Review submitted successfully!");
      setReviewOpen(false);
      setReviewData({ name: "", rating: 5, comment: "" });
    } catch (error) {
      toast.error(error.message || "Failed to submit review");
    }
  }

  return (
    <div className="w-full bg-white text-slate-900 pb-8 md:pb-12 pt-24 md:pt-32 lg:pt-36">
      <ProductStructuredData product={product} />
      
      {/* HERO SECTION */}
      <section className="relative w-full pb-8 md:pb-12 lg:pb-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* 1. IMAGES SECTION - MOBILE OPTIMIZED */}
            <div className="w-full flex flex-col gap-4">
              <div 
                className={`relative aspect-square w-full max-w-[500px] mx-auto overflow-hidden bg-slate-50 rounded-2xl md:rounded-[2.5rem] shadow-lg transition-all duration-300 ${isHovering ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={resetDrag}
                onMouseMove={handleDragChange}
                onMouseUp={() => setDragOffset(0)}
              >
                <motion.div
                  key={activeImg}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image 
                    src={activeImg || (product.images && product.images[0]) || '/placeholder.png'} 
                    alt={product.name} 
                    fill 
                    className="object-contain select-none pointer-events-none p-2 sm:p-0" 
                    priority 
                  />
                </motion.div>
                
                {/* Mobile Arrows */}
                {product.images?.length > 1 && (
                  <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-20">
                    <button 
                      onClick={(e) => {
                        e.preventDefault(); e.stopPropagation();
                        const images = product.images || [];
                        const idx = images.indexOf(activeImg);
                        const prevIdx = (idx <= 0) ? images.length - 1 : idx - 1;
                        setActiveImg(images[prevIdx]);
                      }}
                      className="group p-2.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-md pointer-events-auto active:scale-95 transition-all"
                    >
                      <ChevronLeft size={18} className="text-slate-700" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault(); e.stopPropagation();
                        const images = product.images || [];
                        const idx = images.indexOf(activeImg);
                        const nextIdx = (idx >= images.length - 1) ? 0 : idx + 1;
                        setActiveImg(images[nextIdx]);
                      }}
                      className="group p-2.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-md pointer-events-auto active:scale-95 transition-all"
                    >
                      <ChevronRight size={18} className="text-slate-700" />
                    </button>
                  </div>
                )}

                {/* Progress Indicators */}
                {product.images?.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/5 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                    {product.images.map((img, i) => (
                      <div 
                        key={i} 
                        className={`h-1 rounded-full transition-all duration-300 ${activeImg === img ? 'w-4 bg-accent' : 'w-1 bg-white/40'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-4 px-1 no-scrollbar scroll-smooth snap-x max-w-full mx-auto justify-start sm:justify-center">
                {product.images.map((img, idx) => (
                  <button 
                    key={`${img}-${idx}`} 
                    onClick={() => setActiveImg(img)}
                    className={`relative w-14 h-14 sm:w-20 sm:h-24 overflow-hidden rounded-xl flex-shrink-0 snap-start transition-all ${activeImg === img ? 'ring-2 ring-accent ring-offset-2' : 'opacity-60'}`}
                  >
                    <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
            
            {/* 2. CONTENT SECTION */}
            <div className="flex flex-col gap-6 md:gap-8">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wider">
                    Ayurvedic Excellence
                  </span>
                  {product.stock > 0 ? (
                    <span className="flex items-center gap-1 text-green-600 text-[10px] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                      In Stock
                    </span>
                  ) : (
                    <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider">Out of Stock</span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-light tracking-tight text-slate-900 leading-[1.15]">
                  {product.name}
                </h1>
                
                {/* Consultation Banner Trigger */}
                <button 
                  onClick={() => setConsultationOpen(true)}
                  className="w-full mt-4 flex items-center justify-between p-4 bg-green-50 border border-[#658518]/20 rounded-2xl group hover:bg-green-100 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#658518] shadow-sm">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#658518] uppercase tracking-widest">Limited Time Offer</p>
                      <p className="text-sm font-bold text-slate-800">Apply for Free Doctor Consultation</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-[#658518] group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} className="fill-current" />)}
                  </div>
                  <span className="text-xs text-slate-400">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-medium text-slate-900">₹{product.discountPrice}</span>
                  {product.price > product.discountPrice && (
                    <span className="text-lg sm:text-xl text-slate-300 line-through">₹{product.price}</span>
                  )}
                </div>
                <p className="text-xs text-green-600 font-medium">Save ₹{product.price - product.discountPrice} Today</p>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
                {product.description}
              </p>

              {/* FEATURES GRID */}
              <div className="grid grid-cols-2 gap-3 py-6 border-y border-slate-100">
                {[
                  { icon: "/feature/1.svg", label: "Reduces Gas and Bloating" },
                  { icon: "/feature/2.svg", label: "Supports Gut Health" },
                  { icon: "/feature/3.svg", label: "Relieves Constipation" },
                  { icon: "/feature/4.svg", label: "Promotes Healthy Digestion" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="relative h-9 w-9 flex-shrink-0 bg-accent/5 rounded-lg p-1.5">
                      <Image src={item.icon} alt={item.label} fill className="object-contain" />
                    </div>
                    <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-slate-700 leading-tight">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* PURCHASE CONTROLS - MOBILE OPTIMIZED */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quantity</span>
                    <div className="flex items-center gap-6">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-8 w-8 flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-200 active:bg-slate-50 transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="text-lg font-medium w-4 text-center">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="h-8 w-8 flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-200 active:bg-slate-50 transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="h-10 w-[1px] bg-slate-200" />
                  <div className="flex flex-col gap-1 text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Delivery</span>
                    <span className="text-sm font-medium">{product.deliveryDays || 5} Business Days</span>
                  </div>
                </div>

                <div className="grid grid-cols-[64px_1fr] gap-3">
                  <button 
                    onClick={handleWishlist}
                    className={`h-14 rounded-2xl border transition-all flex items-center justify-center ${
                      isInWishlist(product._id) ? 'border-red-100 bg-red-50 text-red-500' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <Heart size={20} fill={isInWishlist(product._id) ? "currentColor" : "none"} />
                  </button>
                  <button 
                    onClick={handleAddToCart}
                    className="h-14 rounded-2xl bg-[#2A3B32] text-white flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-[0.98] shadow-lg shadow-black/10"
                  >
                    <ShoppingBag size={20} />
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-widest">Add to Cart</span>
                  </button>
                </div>
                
                <div className="flex items-center justify-center gap-3 py-2">
                  <ShieldCheck size={16} className="text-slate-300" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">100% Secure Checkout & Quality Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="py-6 md:py-8 max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <motion.div {...fadeUp} className="text-center mb-6 md:mb-8 space-y-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light">Trust & Quality</h2>
          <p className="text-foreground/50 max-w-md mx-auto font-light text-sm sm:text-base">
            Every formulation undergoes rigorous testing to ensure purity and efficacy.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {[
            { icon: ShieldCheck, title: "Lab Tested", desc: "Quality verified" },
            { icon: Leaf, title: "Natural", desc: "Herbal ingredients" },
            { icon: Award, title: "Certified", desc: "Authentic Ayurveda" },
          ].map((item, i) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center space-y-4"
            >
              <div className="inline-flex h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-accent/10 items-center justify-center">
                <item.icon size={20} className="text-accent sm:size-24" />
              </div>
              <h3 className="text-base sm:text-lg font-light">{item.title}</h3>
              <p className="text-xs sm:text-sm text-foreground/50 font-light">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-6 md:py-8 max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <motion.div {...fadeUp} className="space-y-6 md:space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light">Benefits</h2>
            <p className="text-foreground/50 font-light text-sm sm:text-base">
              Time-tested Ayurvedic wisdom meets modern wellness.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {(product.benefits || []).map((benefit, i) => (
              <motion.div 
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start gap-4 p-4 md:p-6 bg-white/30 border border-foreground/5 rounded-2xl"
              >
                <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={16} className="text-accent" />
                </div>
                <p className="text-sm sm:text-base text-foreground/70 font-light leading-relaxed">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* HOW TO CONSUME */}
      <section className="py-12 md:py-20 bg-muted/20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-light italic font-display text-secondary">How to Consume</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
            {[
              { img: "/consume/1.webp", step: "Step 01" },
              { img: "/consume/2.webp", step: "Step 02" },
              { img: "/consume/3.webp", step: "Step 03" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative"
              >
                <div className="relative aspect-[4/5] shadow-2xl">
                  <Image src={item.img} alt={`Step ${i + 1}`} fill className="object-cover transition-transform duration-700" />
                  <div className="absolute top-6 left-6 bg-accent text-white text-xs uppercase tracking-[0.2em] font-medium px-6 py-2 rounded-full shadow-lg backdrop-blur-md">
                    {item.step}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT FORMULA SECTION (INFOGRAPHIC) */}
      {product.formulaimage && (
        <section className="py-20 md:py-32 bg-white overflow-hidden border-y border-slate-50">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              {...fadeUp}
              className="text-center space-y-6 mb-16 md:mb-24"
            >
              <span className="text-accent font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs opacity-60">The Fiveetatv Way</span>
              <h2 className="text-4xl md:text-7xl font-light text-slate-900 leading-tight">
                Your Formula for <span className="font-display italic text-accent block md:inline">
                  {product.category === 'diabetes' ? 'Balanced Blood Sugar' : 
                   product.category === 'digestion' ? 'Healthy Digestion' : 
                   'Better Health'}
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full"
            >
              {/* Ultra-clean presentation: No borders, just pure content with soft depth */}
              <div className="relative w-full overflow-hidden">
                <div className="relative w-full aspect-[16/9] md:aspect-[21/9] lg:aspect-[2.8/1]">
                  <Image 
                    src={product.formulaimage} 
                    alt="Product Formula Infographic" 
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              {...fadeUp}
              className="mt-16 md:mt-24 text-center"
            >
              <div className="w-16 h-px bg-accent/30 mx-auto mb-8" />
              <p className="text-slate-500 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed italic">
                "Our holistic approach ensures that your journey towards wellness is balanced, natural, and sustainable."
              </p>
            </motion.div>
          </div>
        </section>
      )}

      <CertificateSlider />

      {/* INGREDIENTS WITH IMAGES */}
      <section className="py-12 md:py-20 bg-[#EBF1E4]/30 relative overflow-hidden">
        <FloatingLeaf 
          type="single" 
          className="w-16 h-16 top-10 left-[10%] opacity-50 rotate-[30deg]" 
          delay={0.2} 
          parallaxSpeed={40} 
        />
        <FloatingLeaf 
          type="branch" 
          className="w-48 h-48 bottom-0 -right-10 opacity-20 rotate-[-45deg]" 
          delay={0.5} 
          parallaxSpeed={-30} 
          blur
        />
        
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-light text-slate-900 mb-4">Key Ingredients</h2>
            <p className="text-slate-600 max-w-2xl mx-auto font-light">
              Pure, potent, and ethically sourced. Discover the natural power behind our formulation.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {[
              { name: "Amla", img: "/ingredients/Amla.webp", desc: "Rich in Vitamin C, boosts immunity" },
              { name: "Haritaki", img: "/ingredients/Haritaki_4e781681-e0e8-490c-97fd-e0494b52cc5b.webp", desc: "Improves digestion & detoxification" },
              { name: "Bibhitaki", img: "/ingredients/Bibhitaki.webp", desc: "Supports respiratory & metabolic health" },
              { name: "Jeera", img: "/ingredients/Jeera-eng.webp", desc: "Enhances metabolism & relieves bloating" },
              { name: "Pudina", img: "/ingredients/Pudina-Ind_20901f19-a6e7-4936-a78d-c4373c5282ab.webp", desc: "Cools the stomach & aids digestion" },
              { name: "Saunf", img: "/ingredients/Saunf-eng.webp", desc: "Reduces acidity & freshens breath" },
              { name: "Kali Mirch", img: "/ingredients/Kali_Mirch-eng.webp", desc: "Improves nutrient absorption" },
              { name: "Hing", img: "/ingredients/Hing-eng.webp", desc: "Relieves gas and abdominal pain" },
              { name: "Carom Seeds", img: "/ingredients/Carom_Seeds-English.webp", desc: "Quick relief from indigestion" },
              { name: "Kala Namak", img: "/ingredients/Kala_Namak-eng.webp", desc: "Aids digestion and adds trace minerals" },
            ].map((ing, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex flex-col items-center text-center space-y-3"
              >
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-white shadow-md group-hover:shadow-xl transition-all duration-500 border border-slate-100 p-2">
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <Image 
                      src={ing.img} 
                      alt={ing.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm md:text-base font-semibold text-slate-800">{ing.name}</h4>
                  <p className="text-[10px] md:text-xs text-slate-500 mt-1 leading-tight">{ing.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO USE */}
      <section className="py-12 md:py-20 max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
        <motion.div {...fadeUp} className="space-y-6 md:space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light">How to Use</h2>
            <p className="text-foreground/60 font-light text-sm sm:text-base leading-relaxed max-w-md">
              For best results, follow the recommended dosage consistently.
            </p>
          </div>
          <div className="space-y-4 md:space-y-6">
            {(product.usage || [
              "Take 1-2 tablets twice daily.",
              "Consume with warm water after meals.",
              "For best results, use consistently for 3 months."
            ]).map((step, i) => (
              <div key={step} className="flex gap-3 md:gap-4">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 rounded-full border border-accent text-accent flex items-center justify-center text-xs font-medium">
                    {i + 1}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* WHY CHOOSE SECTION */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden border-t border-slate-100">
        <FloatingLeaf 
          type="single" 
          className="w-16 h-16 top-10 left-[5%] opacity-40 rotate-[15deg]" 
          delay={0.3} 
          parallaxSpeed={50} 
        />
        <FloatingLeaf 
          type="branch" 
          className="w-48 h-48 bottom-0 right-[2%] opacity-10 rotate-[-30deg]" 
          delay={0.6} 
          parallaxSpeed={-40} 
          blur
        />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content Left */}
            <motion.div {...fadeUp} className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-light text-slate-900 leading-tight">
                  Why choose <span className="font-medium">{product.name}</span>?
                </h2>
                <p className="text-lg text-slate-600 font-light">Because you deserve the best:</p>
              </div>
              
              <ul className="space-y-6">
                {[
                  "A time-tested Ayurvedic recipe, perfectly balanced in the right quantities to support your gut health.",
                  "Handpicked from India's jungles and Himalayas, with purity in every herb.",
                  "Clinically tested for safety and effectiveness you can trust."
                ].map((point, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                    className="flex items-start gap-4"
                  >
                    <div className="mt-1 bg-[#2A3B32] p-1 rounded-full text-white flex-shrink-0 shadow-md">
                      <CheckCircle2 size={16} />
                    </div>
                    <p className="text-slate-700 leading-relaxed font-light">{point}</p>
                  </motion.li>
                ))}
              </ul>

              <div className="pt-6 space-y-8">
                <p className="text-slate-900 font-medium italic border-l-2 border-[#2A3B32] pl-4 py-1">
                  No shortcuts. No compromises. Just real ingredients, for real results.
                </p>
                <Button 
                  onClick={handleAddToCart}
                  className="h-14 px-10 rounded-full bg-[#2A3B32] text-white hover:bg-black transition-all shadow-xl shadow-black/10 text-sm font-bold uppercase tracking-widest active:scale-[0.98]"
                >
                  Order Now
                </Button>
              </div>
            </motion.div>

            {/* Image Right */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-md mx-auto md:max-w-none"
            >
              <div className="text-center mb-6 space-y-1">
                <h3 className="text-sm md:text-base font-bold tracking-[0.2em] text-slate-500 uppercase">Loved & Trusted By</h3>
                <p className="text-3xl md:text-4xl font-bold text-[#4B3B32]">2 LAKHS + USERS</p>
              </div>
              <div className="relative aspect-square sm:aspect-[4/3] md:aspect-square rounded-3xl overflow-hidden shadow-2xl border border-slate-100 group">
                <Image 
                  src="/assets/whychose.webp" 
                  alt="Trusted by users" 
                  fill 
                  className="object-contain sm:object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-400 text-center mt-6 px-2 leading-relaxed">
                *These results are indicative and may vary for each individual due to differences in body mechanisms. This product does not guarantee any specific outcomes and should not be considered or used as a cure, remedy, or alternative medicine.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-12 md:py-16 max-w-[1500px] mx-auto px-6 md:px-12">
        <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
          <h3 className="text-[#1b3a27]/60 font-medium tracking-[0.2em] uppercase text-sm mb-4">Testimonials</h3>
          <Button 
            onClick={() => setReviewOpen(true)}
            className="px-6 py-3 rounded-full bg-accent text-background hover:bg-accent/90 transition-colors"
          >
            Write a Review
          </Button>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {(product.reviews || []).slice(0, 3).map((review, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative p-6 md:p-8 lg:p-10 rounded-[1.5rem] md:rounded-[2rem] bg-white/30 border border-border/50 flex flex-col h-full transition-all duration-500 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-2 hover:bg-white/40"
            >
              <div className="flex gap-1 mb-6 md:mb-8">
                {[...Array(review.rating || 5)].map((_, idx) => (
                  <Star key={idx} size={12} className="text-amber-500 sm:size-14" fill="#f59e0b" />
                ))}
              </div>

              <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed mb-8 md:mb-12 flex-grow font-light">
                "{review.comment}"
              </p>

              <div className="flex items-center gap-3 md:gap-4 pt-2 border-t border-border/50">
                <div className="relative flex-shrink-0">
                  {review.image ? (
                    <img 
                      src={review.image} 
                      alt={review.name} 
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover object-top shadow-lg border-2 border-white"
                    />
                  ) : (
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-accent/20 to-accent/40 flex items-center justify-center text-accent font-bold text-xs sm:text-sm shadow-md">
                      {review.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <h4 className="text-xs sm:text-sm font-medium text-foreground">{review.name}</h4>
                  <p className="text-[10px] sm:text-xs text-foreground/50">Verified Buyer</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 max-w-3xl mx-auto px-6">
        <motion.div {...fadeUp} className="text-center mb-12 space-y-4">
           <h2 className="text-3xl md:text-4xl font-light">Questions</h2>
        </motion.div>
        <div className="space-y-4">
          {(product.faqs || [
            { question: "Is this product suitable for daily use?", answer: "Yes, all our products are formulated for daily use following Ayurvedic principles. However, we recommend consulting with an Ayurvedic practitioner for personalized dosage guidance." },
            { question: "Are there any side effects?", answer: "Our products are made from 100% natural ingredients and are generally safe for consumption. However, if you have any specific health conditions or are pregnant/nursing, please consult your healthcare provider before use." },
            { question: "How long does it take to see results?", answer: "Ayurvedic remedies work holistically and results may vary from person to person. Typically, consistent use for 4-6 weeks shows noticeable improvements in overall well-being." },
            { question: "Can I take this with other medications?", answer: "While our products are natural, we recommend a gap of at least 2 hours between any allopathic medication and our Ayurvedic supplements. Please consult your doctor for specific interactions." },
            { question: "How should I store this product?", answer: "Store in a cool, dry place away from direct sunlight. Keep the container tightly closed when not in use to maintain freshness and potency." }
          ]).map((faq, i) => (
            <motion.details 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group bg-muted/30 border border-foreground/5 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex items-center justify-between p-5 cursor-pointer text-base font-medium">
                {faq.question}
                <Plus className="h-4 w-4 text-foreground/50 group-open:hidden" />
                <Minus className="h-4 w-4 text-foreground/50 hidden group-open:block" />
              </summary>
              <div className="p-5 pt-0 text-foreground/60 font-light leading-relaxed text-sm">
                {faq.answer}
              </div>
            </motion.details>
          ))}
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 border-t border-foreground/10 mt-8">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-light">You May Also Like</h2>
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
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-muted mb-4">
                    <Image src={item.images?.[0] || '/placeholder.png'} alt={item.name} fill className="object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-light">{item.name}</h3>
                    <p className="text-sm font-light tracking-tight">₹{item.discountPrice}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* REVIEW MODAL */}
      <Modal open={reviewOpen} title="Write a Review" onClose={() => setReviewOpen(false)}>
        <div className="space-y-6 mt-4">
          <div className="space-y-4">
            <Input label="Your Name" value={reviewData.name} onChange={(e) => setReviewData((prev) => ({ ...prev, name: e.target.value }))} />
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Photo (Optional)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setReviewData(prev => ({ ...prev, imageFile: e.target.files[0] }))}
                className="w-full text-sm text-foreground/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-accent/10 file:text-accent hover:file:bg-accent/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewData((prev) => ({ ...prev, rating: star }))}
                    className="text-2xl transition-colors"
                  >
                    <Star size={24} fill={reviewData.rating >= star ? "#f59e0b" : "none"} className={reviewData.rating >= star ? "text-amber-500" : "text-gray-300"} />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Review</label>
              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData((prev) => ({ ...prev, comment: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent min-h-[120px]"
                placeholder="Share your experience with this product..."
              />
            </div>
          </div>
          <Button onClick={handleSubmitReview} className="w-full" disabled={uploading}>
            {uploading ? "Uploading..." : "Submit Review"}
          </Button>
        </div>
      </Modal>

      {/* BUY NOW MODAL */}
      <Modal open={buyNowOpen} title="Quick Checkout" onClose={() => setBuyNowOpen(false)}>
        <div className="space-y-6 mt-4">
          <div className="space-y-4">
            <Input label="Full Name" value={buyDetails.fullName} onChange={(e) => setBuyDetails((prev) => ({ ...prev, fullName: e.target.value }))} />
            <Input label="Phone Number" value={buyDetails.phone} onChange={(e) => setBuyDetails((prev) => ({ ...prev, phone: e.target.value }))} />
            <Input label="Street Address" value={buyDetails.addressLine} onChange={(e) => setBuyDetails((prev) => ({ ...prev, addressLine: e.target.value }))} />
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="City" value={buyDetails.city} onChange={(e) => setBuyDetails((prev) => ({ ...prev, city: e.target.value }))} />
              <Input label="State" value={buyDetails.state} onChange={(e) => setBuyDetails((prev) => ({ ...prev, state: e.target.value }))} />
              <Input label="Pincode" value={buyDetails.pincode} onChange={(e) => setBuyDetails((prev) => ({ ...prev, pincode: e.target.value }))} />
            </div>
          </div>
          <button 
            onClick={buyNow}
            className="w-full h-11 rounded-full bg-accent text-background font-light uppercase tracking-[0.1em] text-xs hover:bg-accent/90 transition-colors duration-300"
          >
            Continue to Payment
          </button>
        </div>
      </Modal>

      <DoctorConsultationModal 
        isOpen={consultationOpen} 
        onClose={() => setConsultationOpen(false)} 
        productSlug={product.slug}
      />
    </div>
  );
}