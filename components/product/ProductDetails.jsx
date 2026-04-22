"use client";

import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import toast from "react-hot-toast";
import { CheckCircle2, Leaf, ShieldCheck, ShoppingBag, Star, Zap, Plus, Minus, ArrowRight, Quote, Heart, Award } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import CertificateSlider from "../home/components/Certificate";

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
      "url": `https://fiveetatva.com/product/${product.slug}`,
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
  const [quantity, setQuantity] = useState(1);
  const [buyNowOpen, setBuyNowOpen] = useState(false);
  const [buyDetails, setBuyDetails] = useState({ fullName: "", phone: "", addressLine: "", city: "", state: "", pincode: "" });
  const [reviewOpen, setReviewOpen] = useState(false);
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
    localStorage.setItem("fiveetatva-buy-now-items", JSON.stringify(buyNowItem));
    localStorage.setItem("fiveetatva-buy-now-address", JSON.stringify(buyDetails));
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
    <div className="w-full bg-background text-foreground pb-8 md:pb-12 pt-20 md:pt-24 lg:pt-28">
      <ProductStructuredData product={product} />
      {/* HERO SECTION */}
      <section className="relative w-full flex items-center pb-8 md:pb-12 lg:pb-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full grid lg:grid-cols-2 gap-6 md:gap-10 lg:gap-14 items-start">
          {/* Images */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-foreground/5 rounded-3xl shadow-2xl">
              {activeImg === 'video' ? (
                <video src={product.videoUrl} className="w-full h-full object-cover" controls autoPlay loop muted />
              ) : (
                <>
                  <Image src={activeImg} alt={product.name} fill className="object-cover" priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </>
              )}
            </div>
            <div className="flex gap-3 justify-center overflow-x-auto pb-2">
              {product.videoUrl && (
                <button 
                  onClick={() => setActiveImg('video')}
                  className={`relative w-24 h-32 overflow-hidden rounded-xl transition-all duration-300 flex-shrink-0 ${activeImg === 'video' ? 'opacity-100 ring-2 ring-accent ring-offset-2 ring-offset-background shadow-lg scale-105' : 'opacity-60 hover:opacity-100 hover:scale-105'} bg-foreground/5`}
                >
                  <div className="w-full h-full flex items-center justify-center bg-black/20">
                    <Zap size={24} className="text-accent" />
                  </div>
                </button>
              )}
              {product.images.map((img, idx) => (
                <button 
                  key={img} 
                  onClick={() => setActiveImg(img)}
                  className={`relative w-24 h-32 overflow-hidden rounded-xl transition-all duration-300 flex-shrink-0 ${activeImg === img ? 'opacity-100 ring-2 ring-accent ring-offset-2 ring-offset-background shadow-lg scale-105' : 'opacity-60 hover:opacity-100 hover:scale-105'} bg-foreground/5`}
                >
                  <Image src={img} alt={`Product image ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
          
          {/* Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="space-y-8 lg:sticky lg:top-40"
          >
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-light tracking-tight leading-[1.1]">{product.name}</h1>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex text-accent">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <span className="text-sm text-foreground/50">{product.rating} / 5.0 ({product.reviewsCount})</span>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-base text-foreground/60 leading-relaxed max-w-lg font-light">
                {product.description}
              </p>
              <div className="flex items-baseline gap-3 md:gap-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-light">₹{product.discountPrice}</h2>
                {product.price > product.discountPrice && (
                  <p className="text-base md:text-lg text-foreground/50 line-through font-light">₹{product.price}</p>
                )}
              </div>
            </div>

            {/* PRODUCT HIGHLIGHTS WITH ICONS */}
            <div className="pt-8 border-t border-border mt-8">
              <div className="grid grid-cols-2 gap-6 md:gap-8">
                {[
                  { icon: "/condi/1.svg", label: "Reduces Gas and Bloating" },
                  { icon: "/condi/2.svg", label: "Supports Gut Health" },
                  { icon: "/condi/3.svg", label: "Relieves Constipation" },
                  { icon: "/condi/4.svg", label: "Promotes Healthy Digestion" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 group">
                    <div className="relative h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 bg-accent/5 rounded-2xl p-3 group-hover:bg-accent/10 transition-all duration-300">
                      <Image src={item.icon} alt={item.label} fill className="object-contain p-2" />
                    </div>
                    <span className="text-xs sm:text-sm uppercase tracking-wider font-medium text-foreground/80 leading-snug">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center border border-border h-11 w-32 justify-between px-4 rounded-full">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="hover:text-accent transition-colors"><Minus size={16} strokeWidth={1.5} /></button>
                <span className="font-light text-base">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="hover:text-accent transition-colors"><Plus size={16} strokeWidth={1.5} /></button>
              </div>
              <p className="text-sm text-foreground/50 font-light">{product.stock} in stock</p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                <ShoppingBag size={16} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Estimated Delivery</p>
                <p className="text-xs text-foreground/60">{product.deliveryDays || 5} business days</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <button 
                onClick={handleWishlist}
                className={`h-11 rounded-full border transition-all px-4 duration-300 font-light uppercase tracking-[0.05em] text-[11px] sm:text-xs flex items-center justify-center gap-2 ${
                  isInWishlist(product._id) 
                    ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white' 
                    : 'border-foreground/20 text-foreground hover:bg-foreground hover:text-background'
                }`}
              >
                <Heart size={16} fill={isInWishlist(product._id) ? "currentColor" : "none"} />
                <span className="hidden sm:inline">Wishlist</span>
              </button>
              <button 
                onClick={handleAddToCart}
                className="h-11 rounded-full bg-foreground text-background transition-all px-6 sm:px-8 duration-300 font-light uppercase tracking-[0.05em] text-[11px] sm:text-xs hover:bg-accent hover:text-background flex-1"
              >
                Add to Cart
              </button>
            </div>

            <div className="pt-8 border-t border-border mt-6">
              <h4 className="text-xs uppercase tracking-[0.1em] font-medium text-foreground/50 mb-4">Trust & Quality</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {product.trustQuality?.naturalIngredients && (
                  <div className="flex items-center gap-2">
                    <Leaf size={16} className="text-accent" />
                    <span className="text-[10px] uppercase tracking-[0.05em] text-foreground/70">Natural Ingredients</span>
                  </div>
                )}
                {product.trustQuality?.labTested && (
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-accent" />
                    <span className="text-[10px] uppercase tracking-[0.05em] text-foreground/70">Lab Tested</span>
                  </div>
                )}
                {product.trustQuality?.noAddedSugar && (
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-accent" />
                    <span className="text-[10px] uppercase tracking-[0.05em] text-foreground/70">No Added Sugar</span>
                  </div>
                )}
                {product.trustQuality?.madeInIndia && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-accent" />
                    <span className="text-[10px] uppercase tracking-[0.05em] text-foreground/70">Made in India</span>
                  </div>
                )}
                {product.trustQuality?.ayurvedicFormulation && (
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={16} className="text-accent" />
                    <span className="text-[10px] uppercase tracking-[0.05em] text-foreground/70">Ayurvedic</span>
                  </div>
                )}
              </div>
            </div>

            {/* KEY BENEFITS - Moved here for better visibility */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="pt-8 border-t border-border mt-6">
                <h4 className="text-xs uppercase tracking-[0.1em] font-medium text-foreground/50 mb-4">Key Benefits</h4>
                <div className="grid gap-3">
                  {product.benefits.slice(0, 3).map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 size={12} className="text-accent" />
                      </div>
                      <span className="text-xs text-foreground/70 font-light">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
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
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-white shadow-2xl">
                  <Image src={item.img} alt={`Step ${i + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-6 left-6 bg-accent text-white text-xs uppercase tracking-[0.2em] font-medium px-6 py-2 rounded-full shadow-lg backdrop-blur-md">
                    {item.step}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CertificateSlider />

      {/* INGREDIENTS & USAGE */}
      <section className="py-8 md:py-12 max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 grid md:grid-cols-2 gap-6 md:gap-10 lg:gap-14 items-center">
        <motion.div {...fadeUp} className="space-y-6 md:space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light">Ingredients</h2>
            <p className="text-foreground/60 font-light text-sm sm:text-base leading-relaxed max-w-md">
              We source only the most potent botanicals, honoring traditional harvesting methods.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {(product.ingredients || []).map((ing, i) => (
              <motion.span 
                key={ing}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-accent/10 text-accent rounded-full text-[10px] sm:text-xs font-medium uppercase tracking-[0.05em]"
              >
                {ing}
              </motion.span>
            ))}
          </div>
        </motion.div>
        <motion.div {...fadeUp} className="space-y-6 md:space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light">How to Use</h2>
            <p className="text-foreground/60 font-light text-sm sm:text-base leading-relaxed max-w-md">
              For best results, follow the recommended dosage consistently.
            </p>
          </div>
          <div className="space-y-4 md:space-y-6">
            {(product.usage || []).map((step, i) => (
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
    </div>
  );
}