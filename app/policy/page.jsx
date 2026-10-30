"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, FileText, RefreshCcw, Truck, ChevronRight } from "lucide-react";
import PolicyCTA from "@/components/policy/PolicyCTA";

const policies = [
  {
    title: "Terms & Conditions",
    description: "The ethical guidelines and legal framework for our trusted wellness partnership.",
    href: "/terms",
    icon: FileText,
  },
  {
    title: "Privacy Policy",
    description: "How we collect, protect, and handle your personal data and digital privacy.",
    href: "/privacy-policy",
    icon: ShieldCheck,
  },
  {
    title: "Refund Policy",
    description: "Our commitment to transparent, fair, and hassle-free returns and cancellations.",
    href: "/refund-policy",
    icon: RefreshCcw,
  },
  {
    title: "Shipping Policy",
    description: "Reliable logistics, order tracking, and transparent delivery timelines across India.",
    href: "/shipping-policy",
    icon: Truck,
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
};

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8F4E9] text-[#171717] pb-16 font-sans">
      {/* Hero Section */}
      <section className="px-6 pt-4 pb-6 md:pt-6 md:pb-8 text-center">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#123D2B]/10 text-[#123D2B] text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck size={13} />
            <span>Store Standards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#171717]">
            Our Policies
          </h1>
          <p className="text-xs sm:text-sm text-[#171717]/65 max-w-xl mx-auto leading-relaxed">
            Clarity, ethics, and transparency in every step of your Ayurvedic wellness journey.
          </p>
        </motion.div>
      </section>

      {/* Policies Grid */}
      <section className="px-4 sm:px-6 mb-16">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-5 md:gap-6">
          {policies.map((policy, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
            >
              <Link href={policy.href} className="group block h-full">
                <div className="p-7 sm:p-8 rounded-2xl bg-white border border-[#E0D9C8] shadow-xs h-full flex flex-col justify-between hover:border-[#123D2B]/50 hover:shadow-md transition-all duration-300">
                  <div className="space-y-4">
                    <div className="h-12 w-12 rounded-xl bg-[#123D2B]/10 text-[#123D2B] flex items-center justify-center group-hover:bg-[#123D2B] group-hover:text-white transition-colors duration-300">
                      <policy.icon size={22} strokeWidth={2} />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold text-[#171717] tracking-tight">{policy.title}</h3>
                      <p className="text-xs sm:text-sm text-[#171717]/70 leading-relaxed">{policy.description}</p>
                    </div>
                  </div>
                  <div className="pt-6 flex items-center gap-1.5 text-[#123D2B] font-bold text-xs uppercase tracking-wider">
                    <span>Read Document</span> 
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <PolicyCTA />
    </div>
  );
}
