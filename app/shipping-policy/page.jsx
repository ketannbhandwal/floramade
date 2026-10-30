"use client";

import { motion } from "framer-motion";
import PolicyCTA from "@/components/policy/PolicyCTA";
import { 
  Truck, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Package, 
  Lock, 
  Scale, 
  Building2,
  Mail, 
  Phone,
  MapPin
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8F4E9] text-[#171717] pb-16 font-sans">
      {/* Hero Section */}
      <section className="px-6 pt-4 pb-6 md:pt-6 md:pb-8 text-center">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#123D2B]/10 text-[#123D2B] text-[11px] font-bold uppercase tracking-wider">
            <Truck size={13} />
            <span>Shipping & Delivery Policy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#171717]">
            Shipping & Delivery Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#171717]/75 max-w-xl mx-auto leading-relaxed">
            Floramade Healthcare Pvt. Ltd. is committed to delivering your order in good condition and on time.
          </p>
        </motion.div>
      </section>

      {/* Content Document Card */}
      <section className="px-4 sm:px-6 mb-16">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-[#E0D9C8] shadow-xs p-6 sm:p-10 md:p-14 space-y-9 leading-relaxed text-[#171717]/85 text-xs sm:text-sm">
          
          {/* Top Quick Facts */}
          <div className="border-b border-[#E0D9C8] pb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-[#171717]/60">
            <div>
              <span className="font-semibold text-[#171717]">Processing:</span> 24-48 Hours
            </div>
            <div>
              <span className="font-semibold text-[#171717]">Delivery Window:</span> 5-7 Business Days
            </div>
          </div>

          {/* Key Shipping Highlights */}
          <div className="grid sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-xl bg-[#F8F4E9] border border-[#E0D9C8] space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-[#123D2B]/10 text-[#123D2B] flex items-center justify-center">
                <Clock size={15} />
              </div>
              <h3 className="font-bold text-xs uppercase tracking-tight text-[#171717]">Shipping Timelines</h3>
              <p className="text-[11px] text-[#171717]/75 leading-relaxed">
                All orders are processed within 24-48 hours. Depending on your location, delivery usually takes 5-7 business days.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8F4E9] border border-[#E0D9C8] space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-[#123D2B]/10 text-[#123D2B] flex items-center justify-center">
                <ShieldCheck size={15} />
              </div>
              <h3 className="font-bold text-xs uppercase tracking-tight text-[#171717]">Hidden Charges</h3>
              <p className="text-[11px] text-[#171717]/75 leading-relaxed">
                There are no hidden charges. The price you see at checkout is final (inclusive of all applicable GST).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8F4E9] border border-[#E0D9C8] space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-[#123D2B]/10 text-[#123D2B] flex items-center justify-center">
                <Package size={15} />
              </div>
              <h3 className="font-bold text-xs uppercase tracking-tight text-[#171717]">Order Tracking</h3>
              <p className="text-[11px] text-[#171717]/75 leading-relaxed">
                Once your order is shipped, you will receive a tracking ID via SMS/Email to monitor your package in real-time.
              </p>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="space-y-4 pt-4 border-t border-[#E0D9C8]/60">
            <h2 className="text-base sm:text-lg font-bold text-[#171717] tracking-tight">Cancellation Policy</h2>
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-[#F8F4E9] border border-[#E0D9C8] space-y-1.5">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#2E7D32]/10 text-[#2E7D32] text-[11px] font-bold">
                  Before Dispatch
                </span>
                <p className="text-xs text-[#171717]/80 leading-relaxed">
                  You can cancel your order within <strong>12 hours</strong> of placing it by contacting our support team via email or WhatsApp/phone.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F4E9] border border-[#E0D9C8] space-y-1.5">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#123D2B]/10 text-[#123D2B] text-[11px] font-bold">
                  After Dispatch
                </span>
                <p className="text-xs text-[#171717]/80 leading-relaxed">
                  Once the order has been handed over to the courier partner, it cannot be cancelled. If you refuse delivery, a shipping penalty may apply to future orders.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Policy (Summary) */}
          <div className="space-y-4 pt-4 border-t border-[#E0D9C8]/60">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#123D2B]/10 text-[#123D2B] flex items-center justify-center">
                <Lock size={15} />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#171717] tracking-tight">Privacy Policy (Summary)</h2>
            </div>
            <p>Your privacy is our priority. <strong>Floramade Healthcare Pvt. Ltd.</strong> ensures:</p>
            <ul className="list-disc pl-5 space-y-2 text-[#171717]/80">
              <li>We only collect necessary data (Name, Address, Phone) required to deliver your products safely.</li>
              <li>Your payment details are processed through encrypted, secure gateways and are never stored on our servers.</li>
              <li>We do not sell or share your personal information with third-party marketing agencies.</li>
            </ul>
          </div>

          {/* Terms of Service */}
          <div className="space-y-4 pt-4 border-t border-[#E0D9C8]/60">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#123D2B]/10 text-[#123D2B] flex items-center justify-center">
                <Scale size={15} />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#171717] tracking-tight">Terms of Service</h2>
            </div>
            <p>By using the Floramade website, you agree to the following:</p>
            <div className="space-y-2.5">
              <div className="p-3.5 rounded-xl bg-[#F8F4E9] border border-[#E0D9C8] space-y-1">
                <span className="font-bold text-xs text-[#171717]">Information Accuracy:</span>
                <p className="text-[11px] text-[#171717]/75">The content on this site is for informational purposes only.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F8F4E9] border border-[#E0D9C8] space-y-1">
                <span className="font-bold text-xs text-[#171717]">Product Usage:</span>
                <p className="text-[11px] text-[#171717]/75">Always follow the dosage instructions on the packaging.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F8F4E9] border border-[#E0D9C8] space-y-1">
                <span className="font-bold text-xs text-[#171717]">Jurisdiction:</span>
                <p className="text-[11px] text-[#171717]/75">Any legal disputes will be subject to the jurisdiction of the competent courts in New Delhi, India.</p>
              </div>
            </div>
          </div>

          {/* Medical Disclaimer */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#123D2B]/5 border border-[#123D2B]/20 space-y-2">
            <div className="flex items-center gap-2 text-[#123D2B] font-bold text-xs uppercase tracking-wider">
              <AlertCircle size={15} />
              <span>Medical Disclaimer</span>
            </div>
            <p className="text-xs text-[#171717]/85 leading-relaxed italic">
              &ldquo;The results of Ayurvedic treatments can vary from person to person. While our MadhuCurex Diabetes Pro, Piles Curex Capsule, and wellness formulations are made with high-quality herbs, they are not intended to diagnose, treat, or cure any chronic disease without proper consultation. If you have a serious medical history, please consult an Ayurvedic practitioner.&rdquo;
            </p>
          </div>

          {/* Contact Details Box */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#F8F4E9] border border-[#E0D9C8] space-y-3">
            <div className="font-bold text-sm text-[#171717] flex items-center gap-2">
              <Building2 size={16} className="text-[#123D2B]" />
              <span>Floramade Healthcare Pvt. Ltd.</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-[#171717]/80">
              <MapPin size={15} className="text-[#123D2B] shrink-0 mt-0.5" />
              <span>Rohini Sector 21, New Delhi - 110086, India</span>
            </div>
            <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold text-[#123D2B]">
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
