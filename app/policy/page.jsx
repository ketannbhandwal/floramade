"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, FileText, RefreshCcw, Truck, ChevronRight } from "lucide-react";

const policies = [
  {
    title: "Terms & Conditions",
    description: "The rules and regulations for using our website and services.",
    href: "/terms",
    icon: FileText,
  },
  {
    title: "Privacy Policy",
    description: "How we collect, use, and protect your personal information.",
    href: "/privacy-policy",
    icon: ShieldCheck,
  },
  {
    title: "Refund Policy",
    description: "Our policy on returns, exchanges, and refund eligibility.",
    href: "/refund-policy",
    icon: RefreshCcw,
  },
  {
    title: "Shipping Policy",
    description: "Delivery timelines, shipping methods, and tracking information.",
    href: "/shipping-policy",
    icon: Truck,
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <motion.div {...fadeUp} className="max-w-3xl mb-16">
          <h4 className="text-accent text-xs font-medium uppercase tracking-[0.2em] mb-4">Support Center</h4>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-8">
            Policies & <span className="text-accent italic">Guidelines</span>
          </h1>
          <p className="text-foreground/60 text-lg font-light leading-relaxed">
            We believe in transparency and trust. Please review our policies to understand how we operate and how we protect your interests.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {policies.map((policy, i) => (
            <motion.div
              key={policy.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={policy.href}
                className="group block p-8 rounded-3xl bg-white/30 border border-border/50 hover:border-accent/30 hover:bg-white/50 transition-all duration-500 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-accent/5 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-500">
                    <policy.icon size={24} strokeWidth={1.5} />
                  </div>
                  <ChevronRight size={20} className="text-foreground/20 group-hover:text-accent group-hover:translate-x-1 transition-all duration-300" />
                </div>
                <h3 className="text-xl font-medium mb-3 group-hover:text-accent transition-colors">
                  {policy.title}
                </h3>
                <p className="text-foreground/50 font-light leading-relaxed">
                  {policy.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-20 p-12 rounded-[2.5rem] bg-[#1b3a27] text-white overflow-hidden relative"
        >
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-light mb-4">Have questions?</h2>
            <p className="text-white/70 font-light text-lg mb-8">
              If you need clarification on any of our policies, our support team is here to help.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1b3a27] rounded-full text-sm font-medium hover:bg-accent hover:text-white transition-all duration-300"
            >
              Contact Support Center
            </Link>
          </div>
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full scale-150">
              <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.5,-0.9C87,14.5,81.4,29.1,72.3,41.4C63.2,53.7,50.7,63.7,37.1,71.1C23.5,78.5,8.8,83.3,-5,81.9C-18.8,80.5,-37.6,73,-52.3,62.2C-67.1,51.4,-77.8,37.3,-82.7,21.5C-87.6,5.7,-86.7,-11.9,-80.4,-27.4C-74.1,-42.8,-62.4,-56,-48.8,-63.5C-35.1,-71.1,-17.6,-73,-0.4,-72.3C16.8,-71.6,30.6,-83.5,44.7,-76.4Z" transform="translate(100 100)" />
            </svg>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
