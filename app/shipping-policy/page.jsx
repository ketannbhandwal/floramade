"use client";

import { motion } from "framer-motion";
import PolicyCTA from "@/components/policy/PolicyCTA";
import { Truck, Clock, ShieldCheck, MapPin, Mail, Phone } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#39160D] pb-16 font-sans">
      {/* Hero Section */}
      <section className="px-6 pt-4 pb-6 md:pt-6 md:pb-8 text-center">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#872B10]/10 text-[#872B10] text-[11px] font-bold uppercase tracking-wider">
            <Truck size={13} />
            <span>Pan-India Logistics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#39160D]">
            Shipping & Delivery Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#39160D]/65 max-w-xl mx-auto leading-relaxed">
            Delivering authentic Ayurvedic formulations with care, speed, and precision across all pin codes in India.
          </p>
        </motion.div>
      </section>

      {/* Content Document Card */}
      <section className="px-4 sm:px-6 mb-16">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-[#E8D9C5] shadow-xs p-6 sm:p-10 md:p-14 space-y-8 leading-relaxed text-[#39160D]/85 text-xs sm:text-sm">
          
          <div className="border-b border-[#E8D9C5] pb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-[#39160D]/60">
            <div>
              <span className="font-semibold text-[#39160D]">Free Shipping:</span> Orders above ₹600
            </div>
            <div>
              <span className="font-semibold text-[#39160D]">Transit Time:</span> 2 to 7 Business Days
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#39160D] tracking-tight">Reliable Dispatch & Tracking</h2>
            <p>At Floramade, we are committed to providing a smooth, reliable, and hassle-free shopping experience. This policy outlines our packaging standards, shipping charges, delivery timelines, and transit protocols.</p>
          </div>

          {/* Shipping Highlights Grid */}
          <div className="grid sm:grid-cols-3 gap-3.5 pt-2 border-t border-[#E8D9C5]/60">
            <div className="p-4 rounded-xl bg-[#FAF6EE] border border-[#E8D9C5] space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-[#872B10]/10 text-[#872B10] flex items-center justify-center">
                <Truck size={15} />
              </div>
              <h3 className="font-bold text-xs uppercase tracking-tight text-[#39160D]">Shipping Charges</h3>
              <p className="text-[11px] text-[#39160D]/75 leading-relaxed">
                Free standard shipping across India on all orders of ₹600 or above. A flat nominal shipping fee of ₹50 applies on orders below ₹600.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF6EE] border border-[#E8D9C5] space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-[#872B10]/10 text-[#872B10] flex items-center justify-center">
                <Clock size={15} />
              </div>
              <h3 className="font-bold text-xs uppercase tracking-tight text-[#39160D]">Order Processing</h3>
              <p className="text-[11px] text-[#39160D]/75 leading-relaxed">
                Orders are dispatched within 24 to 48 hours of verification. Orders placed on Sundays or gazetted holidays are processed next business morning.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF6EE] border border-[#E8D9C5] space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-[#872B10]/10 text-[#872B10] flex items-center justify-center">
                <MapPin size={15} />
              </div>
              <h3 className="font-bold text-xs uppercase tracking-tight text-[#39160D]">Delivery Timelines</h3>
              <p className="text-[11px] text-[#39160D]/75 leading-relaxed">
                Metro cities usually arrive in 2–4 business days. Other states and remote rural pin codes generally arrive within 4–7 business days.
              </p>
            </div>
          </div>

          {/* Courier Partners */}
          <div className="space-y-3 pt-2 border-t border-[#E8D9C5]/60">
            <h3 className="text-base sm:text-lg font-bold text-[#39160D] tracking-tight">1. Trusted Courier Partners</h3>
            <p>
              We partner with India’s leading logistics providers (Delhivery, Blue Dart, DTDC, Xpressbees, and India Post) to ensure tamper-proof packaging and safe delivery to your doorstep.
            </p>
          </div>

          {/* Tracking */}
          <div className="space-y-3 pt-2 border-t border-[#E8D9C5]/60">
            <h3 className="text-base sm:text-lg font-bold text-[#39160D] tracking-tight">2. Shipment Tracking</h3>
            <p>
              As soon as your package is dispatched from our warehouse, you will receive an SMS and email notification containing your AWB tracking number and direct live tracking link.
            </p>
          </div>

          {/* Non Delivery */}
          <div className="space-y-3 pt-2 border-t border-[#E8D9C5]/60">
            <h3 className="text-base sm:text-lg font-bold text-[#39160D] tracking-tight">3. Failed Delivery Attempts</h3>
            <p>
              Our courier partners attempt delivery up to 3 times. If delivery fails due to an incorrect address, wrong mobile number, or recipient unavailability, the parcel returns to our warehouse. Re-dispatch requests may incur additional courier costs.
            </p>
          </div>

          {/* Contact Details Box */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF6EE] border border-[#E8D9C5] space-y-3">
            <h3 className="font-bold text-sm text-[#39160D]">Need Urgent Help with Your Shipment?</h3>
            <p className="text-xs text-[#39160D]/75">
              Our dispatch team is available to assist you with address corrections, tracking updates, and delivery inquiries:
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-xs font-semibold text-[#872B10]">
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
