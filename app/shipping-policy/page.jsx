"use client";

import { motion } from "framer-motion";
import { Truck, Clock, AlertTriangle, XCircle, RefreshCw, Mail, Phone } from "lucide-react";
import PolicyCTA from "@/components/policy/PolicyCTA";
import CouponSection from "@/components/policy/CouponSection";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8F5EF] pt-24 md:pt-32">
      {/* Hero Section */}
      <section className="px-6 py-20 text-center relative overflow-hidden">
        <motion.div {...fadeUp} className="max-w-4xl mx-auto space-y-6 relative z-10">
          <h1 className="text-5xl md:text-7xl font-light italic font-display text-[#2F3E36]">Shipping & Returns</h1>
          <p className="text-[#2F3E36]/60 font-light text-lg max-w-2xl mx-auto uppercase tracking-[0.1em]">
            Transparent logistics for your Ayurvedic wellness journey.
          </p>
        </motion.div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[#7A9E7E]/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Shipping Details - Alternating Section (Light) */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Truck,
              title: "Shipping Fees",
              details: "Enjoy FREE shipping on all orders above ₹600. For orders below ₹600, a minimal shipping fee will be calculated at checkout."
            },
            {
              icon: Clock,
              title: "Processing Time",
              details: "We value your time. All orders are processed within 1–3 working days from our fulfillment center."
            },
            {
              icon: Clock,
              title: "Delivery Timeline",
              details: "Expect delivery within 2–7 working days. Note that remote or high-altitude areas may take slightly longer."
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-10 rounded-[2rem] bg-white border border-[#2F3E36]/5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] space-y-6 hover:-translate-y-2 transition-transform duration-500"
            >
              <div className="h-14 w-14 rounded-2xl bg-[#7A9E7E]/10 flex items-center justify-center text-[#7A9E7E]">
                <item.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-light font-display text-[#2F3E36]">{item.title}</h3>
              <p className="text-sm text-[#2F3E36]/60 font-light leading-relaxed">{item.details}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cancellation - Alternating Section (Dark) */}
      <section className="py-24 px-6 bg-[#2F3E36] text-white overflow-hidden relative">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-light italic font-display">Cancellation Policy</h2>
              <p className="text-white/60 font-light leading-relaxed">
                We strive to fulfill your orders as quickly as possible. Please review our cancellation guidelines.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-6 items-start">
                <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <XCircle size={18} className="text-[#7A9E7E]" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Before Dispatch</h4>
                  <p className="text-sm text-white/50 font-light">Cancellations are allowed only before the order has been dispatched from our facility.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <AlertTriangle size={18} className="text-[#7A9E7E]" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Company Cancellation</h4>
                  <p className="text-sm text-white/50 font-light">Fiveetatv reserves the right to cancel orders due to stock issues or logistics. A full refund will be processed in such cases.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square rounded-[3rem] overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-12"
          >
            <div className="text-center space-y-4">
              <AlertTriangle size={64} className="mx-auto text-[#7A9E7E] opacity-20" />
              <p className="text-xl font-light italic text-white/40">Reliable & Ethical Support</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Replacement - Alternating Section (Light) */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-4xl md:text-5xl font-light italic font-display text-[#2F3E36]">Replacement & Refunds</h2>
            <p className="text-[#2F3E36]/60 font-light uppercase tracking-widest text-xs">When things don't go as planned</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-12 rounded-[2.5rem] bg-[#F8F5EF] space-y-6"
            >
              <RefreshCw className="text-[#7A9E7E]" size={32} />
              <h3 className="text-2xl font-light font-display text-[#2F3E36]">Eligibility</h3>
              <ul className="space-y-4 text-sm text-[#2F3E36]/70 font-light">
                <li className="flex gap-3"><span className="text-[#7A9E7E]">•</span> Damaged product upon receipt</li>
                <li className="flex gap-3"><span className="text-[#7A9E7E]">•</span> Wrong item delivered</li>
                <li className="flex gap-3"><span className="text-[#7A9E7E]">•</span> Manufacturing or packaging defects</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-12 rounded-[2.5rem] bg-[#F8F5EF] space-y-6"
            >
              <Clock className="text-[#7A9E7E]" size={32} />
              <h3 className="text-2xl font-light font-display text-[#2F3E36]">Process</h3>
              <ul className="space-y-4 text-sm text-[#2F3E36]/70 font-light">
                <li className="flex gap-3"><span className="text-[#7A9E7E]">•</span> Report issue within 7 days of delivery</li>
                <li className="flex gap-3"><span className="text-[#7A9E7E]">•</span> Refund processed within 5–7 working days</li>
                <li className="flex gap-3"><span className="text-[#7A9E7E]">•</span> Valid proof (images) required for approval</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <CouponSection />
      <PolicyCTA />
    </div>
  );
}

