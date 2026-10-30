"use client";

import { motion } from "framer-motion";
import PolicyCTA from "@/components/policy/PolicyCTA";
import { RefreshCcw, CheckCircle2, XCircle, Mail, Phone, Truck } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8F4E9] text-[#171717] pb-16 font-sans">
      {/* Hero Section */}
      <section className="px-6 pt-4 pb-6 md:pt-6 md:pb-8 text-center">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#101D17]/10 text-[#101D17] text-[11px] font-bold uppercase tracking-wider">
            <RefreshCcw size={13} />
            <span>Returns & Cancellations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#171717]">
            Refund & Cancellation Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#171717]/65 max-w-xl mx-auto leading-relaxed">
            Transparent, fair, and hassle-free returns for your peace of mind and wellness satisfaction.
          </p>
        </motion.div>
      </section>

      {/* Content Document Card */}
      <section className="px-4 sm:px-6 mb-16">
        <div className="max-w-4xl mx-auto bg-[#F8F4E9] rounded-2xl border border-[#E0D9C8] shadow-xs p-6 sm:p-10 md:p-14 space-y-8 leading-relaxed text-[#171717]/85 text-xs sm:text-sm">
          
          <div className="border-b border-[#E0D9C8] pb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-[#171717]/60">
            <div>
              <span className="font-semibold text-[#171717]">Window:</span> 7 Days from Delivery
            </div>
            <div>
              <span className="font-semibold text-[#171717]">Processing:</span> 5-7 Business Days
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#171717] tracking-tight">Our Quality Guarantee</h2>
            <p>At Floramade, your trust, wellness, and satisfaction are our top priorities. We are committed to providing high-quality Ayurvedic formulations and ensuring a reliable, supportive experience. If something is not right with your order, we are here to assist you.</p>
          </div>

          {/* Eligibility */}
          <div className="space-y-3 pt-2 border-t border-[#E0D9C8]/60">
            <h3 className="text-base sm:text-lg font-bold text-[#171717] tracking-tight">1. Return & Replacement Eligibility</h3>
            <p>We accept return or replacement requests within <strong>7 days of delivery</strong> under the following valid conditions:</p>
            <div className="grid sm:grid-cols-3 gap-3 pt-1">
              <div className="p-4 rounded-xl bg-[#F8F4E9] border border-[#E0D9C8] space-y-1">
                <CheckCircle2 size={16} className="text-[#101D17]" />
                <h4 className="font-bold text-xs text-[#171717]">Damaged / Defective</h4>
                <p className="text-[11px] text-[#171717]/70">Product arrived broken, unsealed, or leaked during transit.</p>
              </div>
              <div className="p-4 rounded-xl bg-[#F8F4E9] border border-[#E0D9C8] space-y-1">
                <CheckCircle2 size={16} className="text-[#101D17]" />
                <h4 className="font-bold text-xs text-[#171717]">Incorrect Item</h4>
                <p className="text-[11px] text-[#171717]/70">You received a different product or variant than ordered.</p>
              </div>
              <div className="p-4 rounded-xl bg-[#F8F4E9] border border-[#E0D9C8] space-y-1">
                <CheckCircle2 size={16} className="text-[#101D17]" />
                <h4 className="font-bold text-xs text-[#171717]">Overcharged Price</h4>
                <p className="text-[11px] text-[#171717]/70">You were mistakenly charged higher than the product MRP.</p>
              </div>
            </div>
          </div>

          {/* Non-returnable */}
          <div className="space-y-3 pt-2 border-t border-[#E0D9C8]/60">
            <h3 className="text-base sm:text-lg font-bold text-[#171717] tracking-tight">2. Non-Returnable Items</h3>
            <p>To preserve Ayurvedic hygiene standards and safety integrity, the following cannot be returned once delivered:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#171717]/80">
              <li>Opened or used bottles/jars where the protective inner seal has been tampered with or removed.</li>
              <li>Products returned without original packaging, product carton, and invoice.</li>
              <li>Damages caused by improper customer storage, moisture exposure, or mishandling.</li>
            </ul>
          </div>

          {/* Order Cancellations */}
          <div className="space-y-3 pt-2 border-t border-[#E0D9C8]/60">
            <h3 className="text-base sm:text-lg font-bold text-[#171717] tracking-tight">3. Order Cancellation Before Dispatch</h3>
            <p>
              If you wish to cancel an order, you can do so within <strong>24 hours of placing it</strong> or prior to courier handover by emailing us at <a href="mailto:floramade517@gmail.com" className="text-[#101D17] font-semibold underline">floramade517@gmail.com</a>.
            </p>
            <p>
              If the cancellation request is accepted before dispatch, 100% of the prepaid amount will be refunded to the original payment method within 5–7 business days.
            </p>
          </div>

          {/* Damage in Transit */}
          <div className="space-y-3 pt-2 border-t border-[#E0D9C8]/60">
            <h3 className="text-base sm:text-lg font-bold text-[#171717] tracking-tight">4. Damage During Transit</h3>
            <p>
              If you notice clear external carton damage or tampering at the time of delivery, please refuse delivery from the courier executive and take photos of the box. Notify our team immediately with photos, and we will dispatch a fresh replacement package right away.
            </p>
          </div>

          {/* Contact Details Box */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#F8F4E9] border border-[#E0D9C8] space-y-3">
            <h3 className="font-bold text-sm text-[#171717]">Initiate a Return or Refund Request</h3>
            <p className="text-xs text-[#171717]/75">
              Please email us your order number, invoice, and clear photos/unboxing video of the affected product:
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-xs font-semibold text-[#101D17]">
              <a href="mailto:floramade517@gmail.com" className="flex items-center gap-1.5 hover:underline">
                <Mail size={14} /> floramade517@gmail.com
              </a>
              <a href="tel:+919220251059" className="flex items-center gap-1.5 hover:underline">
                <Phone size={14} /> +91 9220251059
              </a>
            </div>
          </div>

        </div>
      </section>

      <PolicyCTA />
    </div>
  );
}
