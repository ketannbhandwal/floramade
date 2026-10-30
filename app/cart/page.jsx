"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import PageTransition from "@/components/ui/PageTransition";
import CartItem from "@/components/cart/CartItem";
import { ArrowRight, ShieldCheck, Truck, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, total } = useCart();
  const shipping = cartItems.length ? (total > 1500 ? 0 : 99) : 0;
  const grandTotal = total + shipping;

  return (
    <PageTransition>
      <div className="min-h-[80vh] bg-[#F8F4E9] w-full pt-6 md:pt-10 pb-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 md:mb-12"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="h-[1px] w-8 bg-[#101D17]" />
              <span className="text-[10px] uppercase tracking-[0.08em] text-[#171717]/50 font-semibold">Shopping Bag</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#171717]">
              Your Cart
            </h1>
          </motion.div>

          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="py-16 sm:py-20 rounded-2xl bg-[#F8F4E9] border border-[#E0D9C8] flex flex-col items-center justify-center text-center space-y-5"
            >
              <div className="w-16 h-16 rounded-full bg-[#101D17]/8 flex items-center justify-center">
                <ShoppingBag size={28} className="text-[#101D17]/40" />
              </div>
              <div className="space-y-1.5">
                <p className="text-base font-semibold text-[#171717]/80 tracking-tight">Your cart is empty</p>
                <p className="text-sm text-[#171717]/50 tracking-tight">Explore our Ayurvedic wellness collection</p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 h-11 px-7 rounded-full bg-[#101D17] text-white hover:bg-[#101D17] transition-colors duration-300 text-xs font-bold uppercase tracking-[0.06em]"
              >
                Shop Now <ArrowRight size={14} strokeWidth={2} />
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">
              {/* Cart Items */}
              <div>
                {/* Table Header - Desktop */}
                <div className="hidden md:grid grid-cols-[auto_1fr_auto_auto] gap-8 pb-4 border-b border-[#E0D9C8] text-[10px] uppercase tracking-[0.08em] text-[#171717]/40 font-bold">
                  <span className="w-24">Product</span>
                  <span>Details</span>
                  <span className="w-28 text-center">Quantity</span>
                  <span className="w-20 text-right">Total</span>
                </div>

                <div className="divide-y divide-[#E8D9C5]/60">
                  {cartItems.map((item, i) => (
                    <motion.div
                      key={item.cartItemKey || `${item.productId}-${item.packId || i}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                    >
                      <CartItem item={item} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <motion.aside
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="h-fit rounded-2xl border border-[#E0D9C8] bg-[#F8F4E9] p-6 sm:p-7 lg:sticky lg:top-32 space-y-5"
              >
                <h2 className="text-lg font-bold tracking-tight text-[#171717]">Order Summary</h2>

                <div className="space-y-3 text-sm text-[#171717]/70 tracking-tight">
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#171717]">₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "font-bold text-[#101D17] text-xs uppercase tracking-[0.04em]" : "font-semibold text-[#171717]"}>
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-[#101D17]/70 tracking-tight">Add ₹{1500 - total} more for free shipping</p>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-[#E0D9C8]">
                    <span className="font-bold text-[#171717] text-base tracking-tight">Total</span>
                    <span className="font-bold text-[#171717] text-xl tracking-tight">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full h-12 rounded-full bg-[#D4AF55] text-white flex items-center justify-center gap-2.5 hover:bg-[#C49B3D] transition-colors duration-300 text-xs font-bold uppercase tracking-[0.06em]"
                >
                  Checkout <ArrowRight size={14} strokeWidth={2} />
                </Link>

                <div className="space-y-2.5 pt-4 border-t border-[#E0D9C8]">
                  <div className="flex items-center gap-2.5 text-xs text-[#171717]/50 tracking-tight">
                    <ShieldCheck size={15} className="text-[#101D17]/60 flex-shrink-0" />
                    <span>Secure encrypted checkout</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#171717]/50 tracking-tight">
                    <Truck size={15} className="text-[#101D17]/60 flex-shrink-0" />
                    <span>Free shipping over ₹1,500</span>
                  </div>
                </div>
              </motion.aside>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
