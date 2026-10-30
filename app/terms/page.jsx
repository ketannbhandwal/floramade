"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import PolicyCTA from "@/components/policy/PolicyCTA";
import { 
  FileText, 
  ShieldCheck, 
  Check, 
  X, 
  CreditCard, 
  AlertTriangle, 
  UserCheck, 
  Mail, 
  Phone,
  MapPin,
  Building2
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8F4E9] text-[#171717] pb-16 font-sans">
      {/* Top Header */}
      <section className="px-6 pt-4 pb-6 md:pt-6 md:pb-8 text-center">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#123D2B]/10 text-[#123D2B] text-[11px] font-bold uppercase tracking-wider">
            <FileText size={13} />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#171717]">
            Terms & Conditions
          </h1>
          <p className="text-xs sm:text-sm text-[#171717]/75 max-w-xl mx-auto leading-relaxed">
            Floramade Healthcare Pvt. Ltd. — By using this website and purchasing products, you agree to the following terms.
          </p>
        </motion.div>
      </section>

      {/* Main Document Paper Container */}
      <section className="px-4 sm:px-6 mb-16">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-[#E0D9C8] shadow-xs p-6 sm:p-10 md:p-14 space-y-10 leading-relaxed text-[#171717]/85 text-xs sm:text-sm">

          {/* Meta Info Strip */}
          <div className="border-b border-[#E0D9C8] pb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-[#171717]/60">
            <div>
              <span className="font-semibold text-[#171717]">Entity:</span> Floramade Healthcare Pvt. Ltd.
            </div>
            <div>
              <span className="font-semibold text-[#171717]">Jurisdiction:</span> New Delhi, India
            </div>
          </div>

          {/* 1. Ownership */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#123D2B]/10 text-[#123D2B] font-bold text-sm flex items-center justify-center shrink-0">
                1
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#171717] tracking-tight">Ownership</h2>
            </div>
            <p>
              This website and all its content are the intellectual property of <strong>Floramade Healthcare Pvt. Ltd.</strong>, including:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {["Product names", "Logos", "Images", "Text", "Formulations", "Descriptions"].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#F8F4E9] border border-[#E0D9C8] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#123D2B]" />
                  <span className="text-xs font-semibold text-[#171717]">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-[#123D2B] font-semibold text-xs pt-1">
              Unauthorized use, copying, or redistribution is strictly prohibited.
            </p>
          </div>

          {/* 2. Eligibility */}
          <div className="space-y-4 pt-6 border-t border-[#E0D9C8]/60">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#123D2B]/10 text-[#123D2B] font-bold text-sm flex items-center justify-center shrink-0">
                2
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#171717] tracking-tight">Eligibility</h2>
            </div>
            <p>By placing an order on our platform, you confirm:</p>
            <div className="grid sm:grid-cols-2 gap-3.5 pt-1">
              <div className="p-4 rounded-xl bg-[#F8F4E9] border border-[#E0D9C8] space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#123D2B]/15 text-[#123D2B] text-[11px] font-bold">18+</span>
                <h3 className="font-bold text-xs text-[#171717]">Age Confirmation</h3>
                <p className="text-[11px] text-[#171717]/75">You are 18 years or older.</p>
              </div>
              <div className="p-4 rounded-xl bg-[#F8F4E9] border border-[#E0D9C8] space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#123D2B]/15 text-[#123D2B] text-[11px] font-bold">OR Supervised</span>
                <h3 className="font-bold text-xs text-[#171717]">Adult Guidance</h3>
                <p className="text-[11px] text-[#171717]/75">You are using this website under active adult supervision.</p>
              </div>
            </div>
          </div>

          {/* 3. Medical Disclaimer */}
          <div className="space-y-4 pt-6 border-t border-[#E0D9C8]/60">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#123D2B]/10 text-[#123D2B] font-bold text-sm flex items-center justify-center shrink-0">
                3
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#171717] tracking-tight">Medical Disclaimer</h2>
            </div>
            <p>
              Our products are Ayurvedic wellness products. The information provided on this website:
            </p>
            <div className="space-y-2.5 pt-1">
              <div className="p-3.5 rounded-xl bg-[#2E7D32]/5 border border-[#2E7D32]/20 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#2E7D32]/15 text-[#2E7D32] flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={12} strokeWidth={3} />
                </div>
                <p className="text-xs text-[#2E7D32] font-semibold leading-relaxed">
                  Is for educational and informational purposes only.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#C62828]/5 border border-[#C62828]/20 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#C62828]/15 text-[#C62828] flex items-center justify-center shrink-0 mt-0.5">
                  <X size={12} strokeWidth={3} />
                </div>
                <p className="text-xs text-[#C62828] font-semibold leading-relaxed">
                  Is NOT a substitute for professional medical advice.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#C62828]/5 border border-[#C62828]/20 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#C62828]/15 text-[#C62828] flex items-center justify-center shrink-0 mt-0.5">
                  <X size={12} strokeWidth={3} />
                </div>
                <p className="text-xs text-[#C62828] font-semibold leading-relaxed">
                  Does NOT replace consultation with a qualified doctor.
                </p>
              </div>
            </div>
            <p className="text-xs text-[#171717]/80 font-medium pt-1">
              Always consult a healthcare professional for serious medical conditions.
            </p>
          </div>

          {/* 4. Pricing & Orders */}
          <div className="space-y-4 pt-6 border-t border-[#E0D9C8]/60">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#123D2B]/10 text-[#123D2B] font-bold text-sm flex items-center justify-center shrink-0">
                4
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#171717] tracking-tight">Pricing & Orders</h2>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-[#171717]/80 text-xs sm:text-sm">
              <li>Prices may change without prior notice.</li>
              <li>Orders depend on product availability.</li>
              <li>In case of out-of-stock items, a full refund will be issued promptly.</li>
              <li>We reserve the right to cancel suspicious or fraudulent orders.</li>
            </ul>
          </div>

          {/* 5. Payments */}
          <div className="space-y-4 pt-6 border-t border-[#E0D9C8]/60">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#123D2B]/10 text-[#123D2B] font-bold text-sm flex items-center justify-center shrink-0">
                5
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#171717] tracking-tight">Payments</h2>
            </div>
            <p>
              All payments are processed securely through certified third-party payment providers (Razorpay, Cashfree, and other PCI-DSS compliant gateways).
            </p>
            <div className="p-4 rounded-xl bg-[#F8F4E9] border border-[#E0D9C8] flex items-center gap-3 text-xs">
              <CreditCard size={18} className="text-[#123D2B] shrink-0" />
              <span className="text-[#171717]/80 font-medium">
                The company does not store sensitive card, CVV, or banking details on its servers.
              </span>
            </div>
          </div>

          {/* 6. Limitation of Liability */}
          <div className="space-y-4 pt-6 border-t border-[#E0D9C8]/60">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#123D2B]/10 text-[#123D2B] font-bold text-sm flex items-center justify-center shrink-0">
                6
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#171717] tracking-tight">Limitation of Liability</h2>
            </div>
            <p>The company shall not be held liable for:</p>
            <ul className="list-disc pl-5 space-y-2 text-[#171717]/80 text-xs sm:text-sm">
              <li>Incorrect product usage or dosage deviations.</li>
              <li>Allergic reactions due to undisclosed personal medical conditions.</li>
              <li>Misinterpretation of product information or traditional claims.</li>
            </ul>
            <p className="text-xs font-semibold text-[#123D2B]">
              Users are solely responsible for proper usage as per packaging instructions.
            </p>
          </div>

          {/* 7. Contact Information */}
          <div className="space-y-4 pt-6 border-t border-[#E0D9C8]/60">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#123D2B]/10 text-[#123D2B] font-bold text-sm flex items-center justify-center shrink-0">
                7
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#171717] tracking-tight">Contact Information</h2>
            </div>
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

        </div>
      </section>

      {/* Warm Policy Contact Section */}
      <PolicyCTA />
    </div>
  );
}
