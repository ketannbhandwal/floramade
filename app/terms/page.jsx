"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import PolicyCTA from "@/components/policy/PolicyCTA";
import { 
  FileText, 
  ShieldCheck, 
  Scale, 
  UserCheck, 
  AlertCircle, 
  Landmark, 
  Tag, 
  Mail, 
  Phone 
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#39160D] pb-16 font-sans">
      {/* Top Header */}
      <section className="px-6 pt-4 pb-6 md:pt-6 md:pb-8 text-center">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#872B10]/10 text-[#872B10] text-[11px] font-bold uppercase tracking-wider">
            <FileText size={13} />
            <span>Legal Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#39160D]">
            Terms & Conditions
          </h1>
          <p className="text-xs sm:text-sm text-[#39160D]/65 max-w-xl mx-auto leading-relaxed">
            Please read these terms and conditions carefully before using the Floramade website or purchasing our Ayurvedic formulations.
          </p>
        </motion.div>
      </section>

      {/* Main Document Paper Container */}
      <section className="px-4 sm:px-6 mb-16">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-[#E8D9C5] shadow-xs p-6 sm:p-10 md:p-14 space-y-10 leading-relaxed text-[#39160D]/85 text-xs sm:text-sm">

          {/* Meta Info */}
          <div className="border-b border-[#E8D9C5] pb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-[#39160D]/60">
            <div>
              <span className="font-semibold text-[#39160D]">Effective Date:</span> October 2026
            </div>
            <div>
              <span className="font-semibold text-[#39160D]">Governing Law:</span> Republic of India
            </div>
          </div>

          {/* 1. Agreement to Terms */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#39160D]">
              <div className="w-7 h-7 rounded-lg bg-[#872B10]/10 text-[#872B10] flex items-center justify-center shrink-0">
                <FileText size={15} />
              </div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">1. Agreement to Terms</h2>
            </div>
            <p>
              By accessing, browsing, or purchasing from the Floramade website, you confirm that you have read, understood, and agreed to be legally bound by these Terms and Conditions, along with our <Link href="/privacy-policy" className="text-[#872B10] font-semibold underline underline-offset-2">Privacy Policy</Link> and <Link href="/refund-policy" className="text-[#872B10] font-semibold underline underline-offset-2">Refund Policy</Link>.
            </p>
            <p>
              If you do not agree with any part of these terms, please discontinue using our website and services immediately.
            </p>
          </div>

          {/* 2. Eligibility & Account Responsibilities */}
          <div className="space-y-4 pt-2 border-t border-[#E8D9C5]/60">
            <div className="flex items-center gap-2.5 text-[#39160D]">
              <div className="w-7 h-7 rounded-lg bg-[#872B10]/10 text-[#872B10] flex items-center justify-center shrink-0">
                <UserCheck size={15} />
              </div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">2. Eligibility & Account Responsibility</h2>
            </div>
            <p>
              To place orders or register an account with Floramade, you must be at least 18 years of age or be using the platform under the active guidance and consent of a parent or legal guardian.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#39160D]/80">
              <li><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.</li>
              <li><strong>Accurate Details:</strong> You agree to provide accurate, current, and complete personal and delivery details during registration and checkout.</li>
              <li><strong>Account Suspension:</strong> Floramade reserves the right to terminate accounts or refuse service if fraudulent or abusive activity is detected.</li>
            </ul>
          </div>

          {/* 3. Product & Pricing Clarity */}
          <div className="space-y-4 pt-2 border-t border-[#E8D9C5]/60">
            <div className="flex items-center gap-2.5 text-[#39160D]">
              <div className="w-7 h-7 rounded-lg bg-[#872B10]/10 text-[#872B10] flex items-center justify-center shrink-0">
                <AlertCircle size={15} />
              </div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">3. Products, Pricing & Availability</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-3.5 pt-1">
              <div className="p-4 rounded-xl bg-[#FAF6EE] border border-[#E8D9C5] space-y-1.5">
                <h3 className="font-bold text-xs uppercase tracking-tight text-[#39160D]">Visual Accuracy</h3>
                <p className="text-[11px] text-[#39160D]/75 leading-relaxed">
                  Actual product packaging, label designs, or colors may vary slightly from online representations due to lighting and screen calibrations.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#FAF6EE] border border-[#E8D9C5] space-y-1.5">
                <h3 className="font-bold text-xs uppercase tracking-tight text-[#39160D]">Stock Availability</h3>
                <p className="text-[11px] text-[#39160D]/75 leading-relaxed">
                  Prices and stock availability are subject to change without prior notice. Floramade reserves the right to limit order quantities per household.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#FAF6EE] border border-[#E8D9C5] space-y-1.5">
                <h3 className="font-bold text-xs uppercase tracking-tight text-[#39160D]">Pricing Errors</h3>
                <p className="text-[11px] text-[#39160D]/75 leading-relaxed">
                  In case of an accidental typographical pricing error, we reserve the right to cancel the order and provide a full prompt refund.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Ayurvedic Disclaimers & Usage */}
          <div className="space-y-4 pt-2 border-t border-[#E8D9C5]/60">
            <div className="flex items-center gap-2.5 text-[#39160D]">
              <div className="w-7 h-7 rounded-lg bg-[#872B10]/10 text-[#872B10] flex items-center justify-center shrink-0">
                <ShieldCheck size={15} />
              </div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">4. Ayurvedic Formulation Disclaimer</h2>
            </div>
            <p>
              All products offered by Floramade are proprietary Ayurvedic wellness formulations prepared with botanical herbs. They are formulated to promote holistic health and vitality according to traditional principles.
            </p>
            <div className="p-4 rounded-xl bg-[#872B10]/5 border border-[#872B10]/20 space-y-1.5 text-xs">
              <p className="font-semibold text-[#872B10]">Important Medical Disclaimer:</p>
              <p className="text-[#39160D]/80 leading-relaxed">
                Floramade products are not intended to diagnose, cure, mitigate, or replace certified allopathic emergency care. Individual results may vary based on bodily constitution, lifestyle, and consistency. Pregnant or nursing mothers and individuals with known medical conditions should consult an Ayurvedic practitioner or physician before use.
              </p>
            </div>
          </div>

          {/* 5. Promotional Codes & Coupons */}
          <div className="space-y-4 pt-2 border-t border-[#E8D9C5]/60">
            <div className="flex items-center gap-2.5 text-[#39160D]">
              <div className="w-7 h-7 rounded-lg bg-[#872B10]/10 text-[#872B10] flex items-center justify-center shrink-0">
                <Tag size={15} />
              </div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">5. Discount Codes & Offers</h2>
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-[#39160D]/80">
              <li>Only one promotional code or coupon may be redeemed per order.</li>
              <li>Discount coupons cannot be clubbed with certain pre-discounted combo packs unless specified.</li>
              <li>Coupons are non-transferable and cannot be exchanged for cash.</li>
              <li>Floramade reserves the right to withdraw or modify promotional discounts at any time without prior liability.</li>
            </ul>
          </div>

          {/* 6. Limitation of Liability */}
          <div className="space-y-3 pt-2 border-t border-[#E8D9C5]/60">
            <div className="flex items-center gap-2.5 text-[#39160D]">
              <div className="w-7 h-7 rounded-lg bg-[#872B10]/10 text-[#872B10] flex items-center justify-center shrink-0">
                <Scale size={15} />
              </div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">6. Limitation of Liability</h2>
            </div>
            <p>
              To the maximum extent permitted by applicable Indian law, Floramade, its directors, employees, and herbalists shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from product misuse, failure to heed usage instructions, or delivery delays caused by third-party logistics partners or natural disruptions.
            </p>
          </div>

          {/* 7. Governing Law & Jurisdiction */}
          <div className="space-y-3 pt-2 border-t border-[#E8D9C5]/60">
            <div className="flex items-center gap-2.5 text-[#39160D]">
              <div className="w-7 h-7 rounded-lg bg-[#872B10]/10 text-[#872B10] flex items-center justify-center shrink-0">
                <Landmark size={15} />
              </div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">7. Governing Law & Dispute Resolution</h2>
            </div>
            <p>
              These Terms and Conditions shall be governed by, interpreted, and construed in accordance with the substantive laws of the Republic of India. In the event of any dispute, controversy, or claim arising out of or relating to these terms, the competent courts in Delhi, India, shall hold exclusive jurisdiction.
            </p>
          </div>

          {/* 8. Contact Information */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF6EE] border border-[#E8D9C5] space-y-3">
            <h3 className="font-bold text-sm text-[#39160D]">Have questions regarding our terms?</h3>
            <p className="text-xs text-[#39160D]/75">
              Our customer care practitioners are available Monday to Saturday (10:00 AM – 7:00 PM IST) to assist with any clarifications.
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

      {/* Warm Policy Contact Section */}
      <PolicyCTA />
    </div>
  );
}
