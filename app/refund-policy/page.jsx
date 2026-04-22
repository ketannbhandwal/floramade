"use client";

import { motion } from "framer-motion";
import { RefreshCcw, ShieldCheck, FileCheck, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import PolicyCTA from "@/components/policy/PolicyCTA";
import CouponSection from "@/components/policy/CouponSection";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8F5EF] pt-24 md:pt-32">
      {/* Hero Section */}
      <section className="px-6 py-20 text-center relative overflow-hidden">
        <motion.div {...fadeUp} className="max-w-4xl mx-auto space-y-6 relative z-10">
          <h1 className="text-5xl md:text-7xl font-light italic font-display text-[#2F3E36]">Refund Policy</h1>
          <p className="text-[#2F3E36]/60 font-light text-lg max-w-2xl mx-auto uppercase tracking-[0.1em]">
            Transparent and fair returns for your peace of mind.
          </p>
        </motion.div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[#7A9E7E]/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Eligible Cases - Section (Light) */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-light italic font-display text-[#2F3E36]">Eligible Cases</h2>
                <p className="text-[#2F3E36]/60 font-light leading-relaxed">
                  We stand by the quality of our products. Refunds and replacements are applicable in the following circumstances:
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: AlertCircle, text: "Product received is damaged or broken." },
                  { icon: ShieldCheck, text: "Incorrect product delivered to the customer." },
                  { icon: FileCheck, text: "Manufacturing defects or quality issues." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center p-4 rounded-2xl bg-white border border-[#2F3E36]/5 shadow-sm">
                    <item.icon size={20} className="text-[#7A9E7E]" />
                    <p className="text-sm text-[#2F3E36]/70 font-light">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-[3rem] overflow-hidden bg-[#2F3E36] flex items-center justify-center p-12 text-center"
            >
              <div className="space-y-6">
                <RefreshCcw size={80} className="mx-auto text-[#7A9E7E]/40 animate-spin-slow" />
                <h3 className="text-3xl font-light italic text-white/90">Hassle-Free Returns</h3>
                <p className="text-white/50 font-light text-sm max-w-xs mx-auto">Focused on bringing you the most authentic Ayurvedic experience.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Conditions - Section (Dark) */}
      <section className="py-24 px-6 bg-[#2F3E36] text-white">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-light italic font-display">Essential Conditions</h2>
            <p className="text-white/40 font-light uppercase tracking-widest text-xs">Please follow these guidelines for a smooth process</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-[2.5rem] border border-white/10 bg-white/5 space-y-6"
            >
              <div className="h-12 w-12 rounded-2xl bg-[#7A9E7E]/10 flex items-center justify-center text-[#7A9E7E]">
                <Clock size={24} />
              </div>
              <h3 className="text-2xl font-light font-display">7-Day Window</h3>
              <p className="text-sm text-white/50 font-light leading-relaxed">
                Requests for refunds or replacements must be raised within 7 days of order delivery. Requests after this period will not be entertained.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-10 rounded-[2.5rem] border border-white/10 bg-white/5 space-y-6"
            >
              <div className="h-12 w-12 rounded-2xl bg-[#7A9E7E]/10 flex items-center justify-center text-[#7A9E7E]">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-2xl font-light font-display">Verification Proof</h3>
              <p className="text-sm text-white/50 font-light leading-relaxed">
                Proof of damage or defect is required. Please provide clear images or videos of the product and packaging for our review team.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Refund Process - Section (Light) */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-light italic font-display text-[#2F3E36]">The Process</h2>
            <p className="text-[#2F3E36]/60 font-light leading-relaxed">
              Our dedicated support team ensures every request is handled with care and transparency.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: "01", title: "Contact Support", desc: "Reach out via email with your Order ID." },
              { step: "02", title: "Verification", desc: "Our team will review your proof within 48 hours." },
              { step: "03", title: "Approval", desc: "If approved, we initiate replacement or refund." },
              { step: "04", title: "Completion", desc: "Refunds reflect in 5–7 working days." }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-[2rem] bg-[#F8F5EF] border border-[#2F3E36]/5 hover:bg-[#7A9E7E]/5 transition-colors duration-500 text-center space-y-4"
              >
                <span className="text-4xl font-light italic font-display text-[#7A9E7E]/20">{item.step}</span>
                <h4 className="text-lg font-medium text-[#2F3E36]">{item.title}</h4>
                <p className="text-xs text-[#2F3E36]/50 font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CouponSection />
      <PolicyCTA />
    </div>
  );
}

