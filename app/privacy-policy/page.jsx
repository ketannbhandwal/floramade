"use client";

import { motion } from "framer-motion";
import PolicyCTA from "@/components/policy/PolicyCTA";
import { ShieldCheck, Lock, Eye, FileText, Mail, Phone } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#39160D] pt-24 md:pt-32 pb-16 font-sans">
      {/* Hero Section */}
      <section className="px-6 py-12 md:py-16 text-center">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#872B10]/10 text-[#872B10] text-[11px] font-bold uppercase tracking-wider">
            <Lock size={13} />
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#39160D]">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#39160D]/65 max-w-xl mx-auto leading-relaxed">
            Your trust is our most valued element. Learn how we collect, protect, and handle your personal data.
          </p>
        </motion.div>
      </section>

      {/* Content Document Card */}
      <section className="px-4 sm:px-6 mb-16">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-[#E8D9C5] shadow-xs p-6 sm:p-10 md:p-14 space-y-8 leading-relaxed text-[#39160D]/85 text-xs sm:text-sm">
          
          <div className="border-b border-[#E8D9C5] pb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-[#39160D]/60">
            <div>
              <span className="font-semibold text-[#39160D]">Effective Date:</span> 17-April-2026
            </div>
            <div>
              <span className="font-semibold text-[#39160D]">Compliance:</span> Digital Personal Data Protection Act
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#39160D] tracking-tight">Introduction</h2>
            <p>At Floramade, we value your trust and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit or make a purchase from our website.</p>
          </div>

          <div className="space-y-3 pt-2 border-t border-[#E8D9C5]/60">
            <h3 className="text-base sm:text-lg font-bold text-[#39160D] tracking-tight">1. Information We Collect</h3>
            <p>When you use our website, we may collect the following information:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#39160D]/80">
              <li>Personal details such as your name, email address, phone number, and delivery address.</li>
              <li>Order details, purchased Ayurvedic formulations, and transaction history.</li>
              <li>Payment information (processed securely through certified third-party payment gateways like Razorpay; we never store your card PIN or CVV).</li>
              <li>Technical data such as IP address, browser type, device identifiers, and browser cookies.</li>
            </ul>
          </div>

          <div className="space-y-3 pt-2 border-t border-[#E8D9C5]/60">
            <h3 className="text-base sm:text-lg font-bold text-[#39160D] tracking-tight">2. How We Use Your Information</h3>
            <p>We use your information strictly for legitimate commercial and wellness service purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#39160D]/80">
              <li>To fulfill, dispatch, and track your product orders.</li>
              <li>To communicate order status updates, invoices, and customer care responses.</li>
              <li>To improve our formulation portfolio, website experience, and site performance.</li>
              <li>To send promotional updates and wellness ritual insights (only where you have explicitly opted in).</li>
              <li>To prevent fraudulent transactions and maintain platform security.</li>
            </ul>
          </div>

          <div className="space-y-3 pt-2 border-t border-[#E8D9C5]/60">
            <h3 className="text-base sm:text-lg font-bold text-[#39160D] tracking-tight">3. Sharing of Information</h3>
            <p>We never sell, rent, or trade your personal information to third-party data brokers. We share your data only with trusted operational partners:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#39160D]/80">
              <li>Certified payment gateway providers for encrypted transactions.</li>
              <li>Shipping and courier partners for door-to-door delivery.</li>
              <li>Cloud hosting and infrastructure services that maintain our secure servers.</li>
            </ul>
          </div>

          <div className="space-y-3 pt-2 border-t border-[#E8D9C5]/60">
            <h3 className="text-base sm:text-lg font-bold text-[#39160D] tracking-tight">4. Data Security & Storage</h3>
            <p>We implement appropriate technical and administrative safeguards (including HTTPS encryption, access controls, and firewall monitoring) to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          </div>

          <div className="space-y-3 pt-2 border-t border-[#E8D9C5]/60">
            <h3 className="text-base sm:text-lg font-bold text-[#39160D] tracking-tight">5. Cookies & Tracking</h3>
            <p>Our website uses essential cookies to remember your cart items, login sessions, and site preferences. You can disable non-essential cookies through your browser settings, though it may alter certain cart functions.</p>
          </div>

          <div className="space-y-3 pt-2 border-t border-[#E8D9C5]/60">
            <h3 className="text-base sm:text-lg font-bold text-[#39160D] tracking-tight">6. Your Rights</h3>
            <p>Under applicable Indian data privacy regulations, you have the right to request access to, correction of, or deletion of your stored personal information. You can also unsubscribe from promotional emails at any time.</p>
          </div>

          {/* Contact Details Box */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF6EE] border border-[#E8D9C5] space-y-3">
            <h3 className="font-bold text-sm text-[#39160D]">Contact Our Grievance Officer</h3>
            <p className="text-xs text-[#39160D]/75">
              For any privacy-related requests or questions regarding data handling, please write to us:
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
