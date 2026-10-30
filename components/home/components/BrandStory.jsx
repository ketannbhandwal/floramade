"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Leaf, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";

export default function BrandStory() {
  return (
    <section className="relative overflow-hidden py-14 sm:py-18 lg:py-24 bg-gradient-to-b from-background via-[#FAF4E8]/60 to-background border-t border-[#E8D9C5]/50">
      
      {/* Delicate background decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden opacity-40">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[#DFC77F]/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-[#872B10]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Eyebrow Pill */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#39160D]/5 border border-[#39160D]/10 text-[#872B10] text-[11px] sm:text-xs font-semibold tracking-tight uppercase mb-4 sm:mb-5"
        >
          <Sparkles size={12} className="text-[#872B10]" />
          <span>The Essence of Pure Ayurveda</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold tracking-tight text-[#39160D] uppercase leading-tight max-w-3xl mx-auto"
        >
          Floramade: Nurturing Wellness, Naturally
        </motion.h2>

        {/* Decorative Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-3 my-5 sm:my-6"
        >
          <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#DFC77F]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#872B10]" />
          <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#DFC77F]" />
        </motion.div>

        {/* Brand Narrative Body */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="space-y-4 sm:space-y-5 text-sm sm:text-base md:text-[16.5px] leading-relaxed text-[#39160D]/80 font-normal tracking-tight max-w-3xl mx-auto"
        >
          <p>
            Welcome to <strong className="font-semibold text-[#39160D]">Floramade</strong>, your trusted partner on the journey to holistic well-being. Born out of a deep reverence for harnessing the ancient wisdom of Ayurveda and the restorative potency of authentic herbal supplements, Floramade stands tall as a beacon of purity, authenticity, and sustained health.
          </p>

          <p>
            At <strong className="font-semibold text-[#39160D]">Floramade</strong>, we believe the foundation of a healthy, vibrant life lies in the absolute purity of what we consume. Every product in our expansive range is a testament to our unwavering commitment to genuine formulations. Our Ayurvedic and herbal remedies are 100% natural, lab-tested, and ethically sourced from the lap of nature, crafted with profound care.
          </p>

          <p className="text-[#39160D]/90 font-medium">
            Choose <strong className="font-semibold text-[#872B10]">Floramade</strong>—where nature meets nurture, and well-being becomes an effortless way of life. Embark on your personal journey to vitality with certified organic and Ayurvedic excellence.
          </p>
        </motion.div>

        {/* 4 Trust Value Badges */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 my-8 sm:my-10 max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/70 border border-[#E8D9C5] shadow-xs text-[11px] sm:text-xs font-semibold text-[#39160D] tracking-tight">
            <Leaf size={14} className="text-[#2C4436]" />
            <span>100% Pure Herbs</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/70 border border-[#E8D9C5] shadow-xs text-[11px] sm:text-xs font-semibold text-[#39160D] tracking-tight">
            <ShieldCheck size={14} className="text-[#872B10]" />
            <span>Lab Tested</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/70 border border-[#E8D9C5] shadow-xs text-[11px] sm:text-xs font-semibold text-[#39160D] tracking-tight">
            <Sparkles size={14} className="text-[#DFC77F]" />
            <span>Zero Chemicals</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/70 border border-[#E8D9C5] shadow-xs text-[11px] sm:text-xs font-semibold text-[#39160D] tracking-tight">
            <HeartHandshake size={14} className="text-[#39160D]" />
            <span>Made in India</span>
          </div>
        </motion.div>

        {/* Call to Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center"
        >
          <Link
            href="/collection"
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#39160D] hover:bg-[#872B10] text-[#FFF7EB] px-8 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-tight shadow-md hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <span>Browse Products</span>
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}

