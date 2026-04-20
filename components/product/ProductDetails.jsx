"use client";

import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import toast from "react-hot-toast";
import { CheckCircle2, Leaf, ShieldCheck, ShoppingBag, Star, Zap, Plus, Minus, ArrowRight, Quote, Heart } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Certificate from "../home/components/Certificate";

const ProductStructuredData = ({ product }) => {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images,
    "brand": {
      "@type": "Brand",
      "name": "Fiveetatva"
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
        "name": "Fiveetatva"
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
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const router = useRouter();

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart`);
  }

  function handleWishlist() {
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

  return (
    <div className="w-full bg-background text-foreground pb-20 pt-24 md:pt-32">
      <ProductStructuredData product={product} />
      {/* HERO SECTION */}
      <section className="relative w-full flex items-center pb-16 md:pb-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 w-full grid lg:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Images */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-foreground/5 rounded-3xl shadow-2xl">
              <Image src={activeImg} alt={product.name} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
            <div className="flex gap-3 justify-center overflow-x-auto pb-2">
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
              <div className="flex items-end gap-6 pt-4 border-t border-border">
                <p className="text-2xl font-light">₹{product.discountPrice}</p>
                <p className="text-lg text-foreground/40 line-through mb-1 font-light">₹{product.price}</p>
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
                className={`h-11 rounded-full border transition-all px-4 duration-300 font-light uppercase tracking-[0.1em] text-xs flex items-center justify-center gap-2 ${
                  isInWishlist(product._id) 
                    ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white' 
                    : 'border-foreground/20 text-foreground hover:bg-foreground hover:text-background'
                }`}
              >
                <Heart size={16} fill={isInWishlist(product._id) ? "currentColor" : "none"} />
                {isInWishlist(product._id) ? 'Wishlisted' : 'Wishlist'}
              </button>
              <button 
                onClick={handleAddToCart}
                className="flex-1 h-11 rounded-full border border-foreground/20 text-foreground hover:bg-foreground hover:text-background transition-all duration-300 py-2 font-light uppercase tracking-[0.1em] text-xs"
              >
                Add to Cart
              </button>
              <button 
                onClick={() => setBuyNowOpen(true)}
                className="flex-1 h-11 rounded-full bg-accent py-2 text-background hover:bg-accent/90 transition-colors duration-300 font-light uppercase tracking-[0.1em] text-xs"
              >
                Buy Now
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
          </motion.div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="py-20 bg-muted text-foreground mx-auto">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-light">Benefits</h2>
            <p className="text-foreground/60 max-w-xl mx-auto font-light text-base">Every element is meticulously balanced to restore your body's natural intelligence.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(product.benefits || []).map((b, i) => (
              <motion.div 
                key={b}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex gap-3"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-accent mt-2 shrink-0"></div>
                <p className="text-base font-light leading-relaxed text-foreground/70">{b}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificate */}
      <Certificate />

      {/* INGREDIENTS & USAGE */}
      <section className="py-20 max-w-[1200px] mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <motion.div {...fadeUp} className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-light">Ingredients</h2>
            <p className="text-foreground/60 font-light text-base leading-relaxed max-w-md">
              We source only the most potent botanicals, honoring traditional harvesting methods.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {(product.ingredients || []).map((ing, i) => (
              <motion.span 
                key={ing}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="px-4 py-2 rounded-full border border-foreground/10 bg-white/50 text-xs uppercase tracking-[0.05em] hover:border-accent transition-colors cursor-default"
              >
                {ing}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="bg-muted/50 border border-foreground/5 rounded-2xl p-8">
          <h3 className="text-2xl font-display italic text-accent mb-8">How to Use</h3>
          <div className="space-y-6">
            {(product.usage || []).map((step, i) => (
              <div key={step} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 rounded-full border border-accent text-accent flex items-center justify-center text-xs font-medium">
                    {i+1}
                  </div>
                </div>
                <p className="text-base text-foreground/70 font-light leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* REVIEWS */}
      <section className="py-20 md:py-24 max-w-[1500px] mx-auto px-10 md:px-16">
        <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
          <h3 className="text-[#1b3a27]/60 font-medium tracking-[0.2em] uppercase text-sm mb-4">Testimonials</h3>
          <h2 className="text-4xl md:text-5xl font-serif text-[#1b3a27]">Voices of Harmony</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {(product.reviews || [
            { name: "Ananya Sharma", role: "Verified Customer", text: "The MadhuCurex has completely transformed my energy levels. I feel more balanced than ever." },
            { name: "Dr. Rajesh Mehta", role: "Ayurvedic Expert", text: "As an Ayurvedic practitioner, I'm impressed by the purity of Fiveetatva's extracts." },
            { name: "Vikram Singh", role: "Verified Customer", text: "Paachan Sathi is now a staple in my daily routine. My digestive health has improved." }
          ]).map((review, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative p-10 rounded-[2rem] bg-white/30 border border-border/50 flex flex-col h-full transition-all duration-500 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-2 hover:bg-white/40"
            >
              <div className="flex gap-1 mb-8">
                {[...Array(review.rating || 5)].map((_, idx) => (
                  <Star key={idx} size={14} fill="#f59e0b" className="text-amber-500" />
                ))}
              </div>

              <p className="text-sm text-foreground/70 leading-relaxed mb-12 flex-grow font-light">
                "{review.comment}"
              </p>

              <div className="flex items-center gap-4 pt-2 border-t border-border/50">
                <div className="relative flex-shrink-0">
                  {review.image ? (
                    <img 
                      src={review.image} 
                      alt={review.name} 
                      className="w-14 h-14 rounded-full object-cover shadow-lg border-2 border-white"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent/20 to-accent/40 flex items-center justify-center text-accent font-bold text-sm shadow-md">
                      {review.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-foreground text-sm">{review.name}</h4>
                  <p className="text-[10px] text-foreground/50 font-black uppercase tracking-widest mt-0.5">
                    {review.role || "Verified Customer"}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 max-w-3xl mx-auto px-6">
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
        <section className="py-20 max-w-[1200px] mx-auto px-6 md:px-12 border-t border-foreground/10 mt-12">
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