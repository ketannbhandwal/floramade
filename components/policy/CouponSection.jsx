"use client";

import { motion } from "framer-motion";
import { Ticket } from "lucide-react";

export default function CouponSection() {
  return (
    <section className="py-20 px-6 bg-[#f7f4ed]">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#b18a3b]/10 text-[#b18a3b] text-[10px] uppercase tracking-widest font-bold">
            <Ticket size={14} />
            Exclusive Offers
          </div>
          <h2 className="text-4xl md:text-5xl font-light italic font-display text-[#17140f]">Promo Code Terms</h2>
          <p className="text-[#17140f]/60 font-light leading-relaxed">
            Enhance your wellness journey with our special offers. Please note the following terms for coupon usage.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid gap-4"
        >
          {[
            "Only one coupon code can be applied per order.",
            "Coupons are valid for a limited time as specified.",
            "Offer is only valid for purchases made on our official website.",
            "Coupon value will be adjusted in case of returns or refunds.",
            "Valid till stocks last. Floramade reserves the right to modify offers."
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="p-6 rounded-2xl bg-white border border-[#17140f]/5 shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-4"
            >
              <div className="h-6 w-6 rounded-full bg-[#b18a3b]/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-[#b18a3b] text-xs font-bold">{idx + 1}</span>
              </div>
              <p className="text-sm text-[#17140f]/70 font-light">{item}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
