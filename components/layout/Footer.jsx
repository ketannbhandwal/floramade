"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Leaf, CreditCard, Lock, Headphones } from "lucide-react";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative bg-[#F8F4E9] text-[#171717] overflow-hidden mt-16 md:mt-24">
      {/* =========================================================================
          0. STAY CONNECTED WITH FLORAMADE (Theme Reference Design Strip)
          ========================================================================= */}
      <div className="py-12 sm:py-16 bg-[#F8F4E9] border-t border-[#E0D9C8] text-center">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-xl mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#171717] tracking-tight">
              Stay Connected With Floramade
            </h3>
            <p className="text-xs sm:text-sm text-[#171717]/75 font-normal">
              हमारे नए प्रोडक्ट्स और ऑफर्स की जानकारी पाएं।
            </p>
            
            {/* Newsletter Subscription Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you for subscribing to Floramade!");
              }}
              className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto"
            >
              <input 
                type="email" 
                placeholder="Enter your email address" 
                required
                className="w-full sm:flex-1 px-4 py-2.5 rounded-full bg-white border border-[#E0D9C8] text-xs sm:text-sm text-[#171717] placeholder-[#171717]/40 focus:outline-none focus:border-[#D4AF55]"
              />
              <button 
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#D4AF55] hover:bg-[#C49B3D] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm active:scale-95 shrink-0"
              >
                Subscribe
              </button>
            </form>

            {/* Follow Us Strip */}
            <div className="pt-4 flex items-center justify-center gap-3">
              <span className="text-xs font-semibold text-[#171717]/70">Follow Us</span>
              <div className="flex items-center gap-2">
                <a 
                  href="https://www.facebook.com/share/1HuEXx3gQh/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-full bg-[#101D17] text-white hover:bg-[#D4AF55] transition-colors flex items-center justify-center text-xs"
                  aria-label="Facebook"
                >
                  <FaFacebookF size={11} />
                </a>
                <a 
                  href="https://www.instagram.com/floramadeofficial/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-full bg-[#101D17] text-white hover:bg-[#D4AF55] transition-colors flex items-center justify-center text-xs"
                  aria-label="Instagram"
                >
                  <FaInstagram size={12} />
                </a>
                <a 
                  href="https://wa.me/919220251059" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-full bg-[#101D17] text-white hover:bg-[#25D366] transition-colors flex items-center justify-center text-xs"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp size={13} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* =========================================================================
          1. 4 TRUST BADGES STRIP (Cream Background with #D4AF55 Gold Icons)
          ========================================================================= */}
      <div className="border-t border-b border-[#E0D9C8] py-8 sm:py-10 bg-[#F8F4E9]">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            
            {/* 1. 100% Natural Products */}
            <div className="flex flex-col items-center text-center space-y-2 group">
              <div className="w-12 h-12 flex items-center justify-center text-[#D4AF55] transition-transform duration-300 group-hover:scale-110">
                <Leaf size={32} strokeWidth={1.8} />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-[#101D17] tracking-tight">100% Natural Products</h4>
              <p className="text-xs text-[#171717]/70">Proven Ayurvedic products</p>
            </div>

            {/* 2. Easy Payment Methods */}
            <div className="flex flex-col items-center text-center space-y-2 group">
              <div className="w-12 h-12 flex items-center justify-center text-[#D4AF55] transition-transform duration-300 group-hover:scale-110">
                <CreditCard size={32} strokeWidth={1.8} />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-[#101D17] tracking-tight">Easy Payment Methods</h4>
              <p className="text-xs text-[#171717]/70">Pay Through Net-Banking, Cards, UPI or COD</p>
            </div>

            {/* 3. Secure Website */}
            <div className="flex flex-col items-center text-center space-y-2 group">
              <div className="w-12 h-12 flex items-center justify-center text-[#D4AF55] transition-transform duration-300 group-hover:scale-110">
                <Lock size={32} strokeWidth={1.8} />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-[#101D17] tracking-tight">Secure Website</h4>
              <p className="text-xs text-[#171717]/70">SSL Secured Website, Order With Confidence</p>
            </div>

            {/* 4. 24/7 Customer Support */}
            <div className="flex flex-col items-center text-center space-y-2 group">
              <div className="w-12 h-12 flex items-center justify-center text-[#D4AF55] transition-transform duration-300 group-hover:scale-110">
                <Headphones size={32} strokeWidth={1.8} />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-[#101D17] tracking-tight">24/7 Customer Support</h4>
              <p className="text-xs text-[#171717]/70">Got Questions? Just Email, WhatsApp or Call Us</p>
            </div>

          </div>
        </div>
      </div>

      {/* =========================================================================
          2. SOCIAL MEDIA STRIP (Deep Teal Bar)
          ========================================================================= */}
      <div className="bg-[#101D17] text-white py-4 px-4 sm:px-6 md:px-8 lg:px-12 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <a 
              href="https://www.facebook.com/share/1HuEXx3gQh/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white hover:text-[#101D17] transition-all flex items-center justify-center"
              aria-label="Facebook"
            >
              <FaFacebookF size={13} />
            </a>
            <a 
              href="https://www.instagram.com/floramadeofficial/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white hover:text-[#101D17] transition-all flex items-center justify-center"
              aria-label="Instagram"
            >
              <FaInstagram size={14} />
            </a>
          </div>
          <span className="font-semibold text-white tracking-wide">Follow-us on social media!</span>
        </div>
      </div>

      {/* =========================================================================
          3. MAIN FOOTER CONTENT (Dark Green #101D17)
          ========================================================================= */}
      <div className="bg-[#101D17] text-white pt-16 pb-12">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 mb-16">
            
            {/* Column 1: Brand Info */}
            <div className="md:col-span-5 space-y-6">
              <div className="flex items-center justify-start">
                <Link href="/" className="inline-block group focus:outline-none">
                  <Image 
                    src="/floramade-logo-gold.png" 
                    alt="Floramade Logo" 
                    width={200} 
                    height={58} 
                    className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
                  />
                </Link>
              </div>
              <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed max-w-md">
                Premium Ayurvedic wellness inspired by the five natural elements. Formulated with authentic botanical extracts for balanced health and vitality.
              </p>
              <div className="flex gap-2.5 pt-2">
                <a 
                  href="https://www.instagram.com/floramadeofficial/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="h-9 w-9 rounded-full bg-white/10 hover:bg-white hover:text-[#101D17] transition-all flex items-center justify-center text-white"
                  aria-label="Instagram"
                >
                  <FaInstagram size={14} />
                </a>
                <a 
                  href="https://www.facebook.com/share/1HuEXx3gQh/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="h-9 w-9 rounded-full bg-white/10 hover:bg-white hover:text-[#101D17] transition-all flex items-center justify-center text-white"
                  aria-label="Facebook"
                >
                  <FaFacebookF size={12} />
                </a>
                <a 
                  href="https://wa.me/919220251059" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="h-9 w-9 rounded-full bg-white/10 hover:bg-[#25D366] hover:text-white transition-all flex items-center justify-center text-white"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp size={15} />
                </a>
                <a 
                  href="mailto:floramade517@gmail.com" 
                  className="h-9 w-9 rounded-full bg-white/10 hover:bg-white hover:text-[#101D17] transition-all flex items-center justify-center text-white"
                  aria-label="Email"
                >
                  <Mail size={14} />
                </a>
              </div>
            </div>

            {/* Column 2: Navigate */}
            <div className="md:col-span-2 space-y-4">
              <p className="text-[11px] uppercase tracking-[0.14em] font-bold text-[#D4AF55]">Navigate</p>
              <ul className="flex flex-col gap-3 text-xs sm:text-sm font-light text-white/85">
                <li><Link href="/" className="hover:text-[#D4AF55] transition-colors duration-300">Home</Link></li>
                <li><Link href="/collection" className="hover:text-[#D4AF55] transition-colors duration-300">All Products</Link></li>
                <li><Link href="/about" className="hover:text-[#D4AF55] transition-colors duration-300">About Our Founder</Link></li>
                <li><Link href="/contact" className="hover:text-[#D4AF55] transition-colors duration-300">Contact Us</Link></li>
              </ul>
            </div>

            {/* Column 3: Policy */}
            <div className="md:col-span-2 space-y-4">
              <p className="text-[11px] uppercase tracking-[0.14em] font-bold text-[#D4AF55]">Policy</p>
              <ul className="flex flex-col gap-3 text-xs sm:text-sm font-light text-white/85">
                <li><Link href="/terms" className="hover:text-[#D4AF55] transition-colors duration-300">Terms & Conditions</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-[#D4AF55] transition-colors duration-300">Privacy Policy</Link></li>
                <li><Link href="/refund-policy" className="hover:text-[#D4AF55] transition-colors duration-300">Refund Policy</Link></li>
                <li><Link href="/shipping-policy" className="hover:text-[#D4AF55] transition-colors duration-300">Shipping Policy</Link></li>
              </ul>
            </div>

            {/* Column 4: Contact Us */}
            <div className="md:col-span-3 space-y-4">
              <p className="text-[11px] uppercase tracking-[0.14em] font-bold text-[#D4AF55]">Contact Us</p>
              <div className="space-y-3 text-xs sm:text-sm text-white/85">
                <div>
                  <p className="font-semibold text-white">Email</p>
                  <a href="mailto:floramade517@gmail.com" className="hover:text-[#D4AF55] transition-colors">floramade517@gmail.com</a>
                </div>
                <div>
                  <p className="font-semibold text-white">Phone Helpline</p>
                  <a href="tel:+919220251059" className="hover:text-[#D4AF55] transition-colors">+91 9220251059</a>
                </div>
                <div>
                  <p className="font-semibold text-white">Location</p>
                  <p className="text-white/80">Rohini Sector 21, New Delhi - 110086, India</p>
                </div>
                <div>
                  <p className="font-semibold text-white">Timings</p>
                  <p className="text-white/70 text-xs">Mon - Sat: 10:00 AM - 07:00 PM</p>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-white/15 text-xs text-white/70">
            <p>© {new Date().getFullYear()} Floramade Healthcare Pvt. Ltd. All rights reserved.</p>
            <p className="text-[#D4AF55] font-medium">100% Certified Ayurvedic Formulations</p>
          </div>

        </div>
      </div>
    </footer>
  );
}
