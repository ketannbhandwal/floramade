"use client";

import { motion } from "framer-motion";
import PolicyCTA from "@/components/policy/PolicyCTA";
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Truck, 
  Headphones, 
  Eye, 
  FileText, 
  Building2,
  Mail, 
  Phone,
  MapPin,
  Cookie
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#1A2332] pb-16 font-sans">
      {/* Hero Section */}
      <section className="px-6 pt-4 pb-6 md:pt-6 md:pb-8 text-center">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#142B49]/10 text-[#142B49] text-[11px] font-bold uppercase tracking-wider">
            <Lock size={13} />
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1A2332]">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#1A2332]/75 max-w-xl mx-auto leading-relaxed">
            Floramade Healthcare respects your privacy and is committed to protecting your personal information.
          </p>
        </motion.div>
      </section>

      {/* Content Document Card */}
      <section className="px-4 sm:px-6 mb-16">
        <div className="max-w-4xl mx-auto bg-[#F7F9FC] rounded-2xl border border-[#C5D5E8] shadow-xs p-6 sm:p-10 md:p-14 space-y-10 leading-relaxed text-[#1A2332]/85 text-xs sm:text-sm">
          
          {/* Metadata */}
          <div className="border-b border-[#C5D5E8] pb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-[#1A2332]/60">
            <div>
              <span className="font-semibold text-[#1A2332]">Entity:</span> Floramade Healthcare
            </div>
            <div>
              <span className="font-semibold text-[#1A2332]">Last Updated:</span> October 2026
            </div>
          </div>

          {/* Intro Paragraph */}
          <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#C5D5E8] text-xs text-[#1A2332]/80 leading-relaxed">
            <strong>Floramade Healthcare</strong> (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your information when you access our website or purchase our products including <strong>MadhuCurex Diabetes Pro</strong>, <strong>Piles Curex Capsule</strong>, and our herbal wellness formulations. By using our website, you agree to the practices described in this policy.
          </div>

          {/* 1. Information We Collect */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#142B49]/10 text-[#142B49] font-bold text-sm flex items-center justify-center shrink-0">
                1
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#1A2332] tracking-tight">Information We Collect</h2>
            </div>
            
            <div className="space-y-3 pl-0 sm:pl-11">
              {/* a. Personal Information */}
              <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#C5D5E8] space-y-2">
                <h3 className="font-bold text-xs uppercase tracking-tight text-[#142B49]">a. Personal Information</h3>
                <p>When you place an order or contact us, we may collect:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {["Full name", "Phone number", "Email address", "Shipping & billing address"].map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-[#F7F9FC] border border-[#C5D5E8] text-[11px] font-semibold text-[#1A2332] text-center">
                      {item}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-[#1A2332]/70 pt-1">
                  This information is required to process and deliver your order accurately.
                </p>
              </div>

              {/* b. Payment Information */}
              <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#C5D5E8] space-y-2">
                <h3 className="font-bold text-xs uppercase tracking-tight text-[#142B49]">b. Payment Information</h3>
                <p>
                  We do <strong>NOT</strong> store your card or bank details. All payments are securely processed through certified third-party payment gateways such as:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {["Razorpay", "Cashfree", "PCI-DSS Compliant Gateways"].map((gateway, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-md bg-[#F7F9FC] border border-[#C5D5E8] text-xs font-semibold text-[#1A2332]">
                      {gateway}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-[#1A2332]/70">
                  These providers handle your payment data using bank-grade encrypted systems.
                </p>
              </div>
            </div>
          </div>

          {/* 2. How We Use Your Information */}
          <div className="space-y-4 pt-6 border-t border-[#C5D5E8]/60">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#142B49]/10 text-[#142B49] font-bold text-sm flex items-center justify-center shrink-0">
                2
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#1A2332] tracking-tight">How We Use Your Information</h2>
            </div>
            <p>We use your data only for legitimate business purposes:</p>
            <ul className="list-disc pl-5 space-y-2 text-[#1A2332]/80">
              <li>To confirm and deliver your orders safely to your doorstep.</li>
              <li>To send order updates via SMS, WhatsApp, or email.</li>
              <li>To provide dedicated customer support and address any concerns.</li>
              <li>To improve our products, customer experience, and formulations.</li>
              <li>To prevent fraud, misuse, or unauthorized transactions.</li>
            </ul>
            <p className="text-xs font-semibold text-[#142B49]">
              We do not sell or rent your personal information to third parties.
            </p>
          </div>

          {/* 3. Data Security */}
          <div className="space-y-4 pt-6 border-t border-[#C5D5E8]/60">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#142B49]/10 text-[#142B49] font-bold text-sm flex items-center justify-center shrink-0">
                3
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#1A2332] tracking-tight">Data Security</h2>
            </div>
            <p>We implement industry-standard security measures including:</p>
            <div className="grid sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-[#F7F9FC] border border-[#C5D5E8] space-y-1">
                <span className="font-bold text-xs text-[#1A2332]">SSL Encryption</span>
                <p className="text-[11px] text-[#1A2332]/75">256-bit encrypted data transit</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F7F9FC] border border-[#C5D5E8] space-y-1">
                <span className="font-bold text-xs text-[#1A2332]">Secure Gateways</span>
                <p className="text-[11px] text-[#1A2332]/75">PCI-DSS certified payment hubs</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F7F9FC] border border-[#C5D5E8] space-y-1">
                <span className="font-bold text-xs text-[#1A2332]">Restricted Access</span>
                <p className="text-[11px] text-[#1A2332]/75">Strict internal authentication controls</p>
              </div>
            </div>
            <p className="text-[11px] text-[#1A2332]/75 pt-1">
              Your information is protected from unauthorized access, disclosure, or alteration.
            </p>
          </div>

          {/* 4. Data Sharing */}
          <div className="space-y-4 pt-6 border-t border-[#C5D5E8]/60">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#142B49]/10 text-[#142B49] font-bold text-sm flex items-center justify-center shrink-0">
                4
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#1A2332] tracking-tight">Data Sharing</h2>
            </div>
            <p>We may share limited information only with trusted service providers:</p>
            <div className="grid sm:grid-cols-3 gap-3 pt-1">
              <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#C5D5E8] space-y-1 text-center">
                <Truck size={20} className="text-[#142B49] mx-auto" />
                <h4 className="font-bold text-xs text-[#1A2332]">Delivery Partners</h4>
                <p className="text-[11px] text-[#1A2332]/70">(for shipping orders)</p>
              </div>
              <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#C5D5E8] space-y-1 text-center">
                <CreditCard size={20} className="text-[#142B49] mx-auto" />
                <h4 className="font-bold text-xs text-[#1A2332]">Payment Gateways</h4>
                <p className="text-[11px] text-[#1A2332]/70">(for transactions)</p>
              </div>
              <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#C5D5E8] space-y-1 text-center">
                <Headphones size={20} className="text-[#142B49] mx-auto" />
                <h4 className="font-bold text-xs text-[#1A2332]">Customer Support</h4>
                <p className="text-[11px] text-[#1A2332]/70">(for assistance)</p>
              </div>
            </div>
            <p className="text-xs text-[#1A2332]/75 pt-1">
              They are authorized to use your data only for completing the requested service.
            </p>
          </div>

          {/* 5. Cookies & Tracking */}
          <div className="space-y-4 pt-6 border-t border-[#C5D5E8]/60">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#142B49]/10 text-[#142B49] font-bold text-sm flex items-center justify-center shrink-0">
                5
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#1A2332] tracking-tight">Cookies & Tracking</h2>
            </div>
            <p>Our website may use cookies to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#1A2332]/80">
              <li>Improve user experience</li>
              <li>Remember preferences & cart items</li>
              <li>Analyze website performance</li>
            </ul>
            <p className="text-xs text-[#1A2332]/75">
              You may disable cookies in your browser settings at any time.
            </p>
          </div>

          {/* 6. Your Rights */}
          <div className="space-y-4 pt-6 border-t border-[#C5D5E8]/60">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#142B49]/10 text-[#142B49] font-bold text-sm flex items-center justify-center shrink-0">
                6
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#1A2332] tracking-tight">Your Rights</h2>
            </div>
            <p>You may request to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#1A2332]/80">
              <li>Update your personal information</li>
              <li>Delete your account data</li>
              <li>Stop promotional communication</li>
            </ul>
            <div className="pt-1 text-xs">
              Contact us at: <a href="mailto:floramade517@gmail.com" className="font-semibold text-[#142B49] underline">floramade517@gmail.com</a>
            </div>
          </div>

          {/* 7. Policy Updates */}
          <div className="space-y-4 pt-6 border-t border-[#C5D5E8]/60">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#142B49]/10 text-[#142B49] font-bold text-sm flex items-center justify-center shrink-0">
                7
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#1A2332] tracking-tight">Policy Updates</h2>
            </div>
            <p>
              We may update this policy when required. Updated versions will always be available on this page with the latest effective date.
            </p>
          </div>

          {/* Contact Details Box */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#F7F9FC] border border-[#C5D5E8] space-y-3">
            <div className="font-bold text-sm text-[#1A2332] flex items-center gap-2">
              <Building2 size={16} className="text-[#142B49]" />
              <span>Floramade Healthcare</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-[#1A2332]/80">
              <MapPin size={15} className="text-[#142B49] shrink-0 mt-0.5" />
              <span>Rohini Sector 21, New Delhi - 110086, India</span>
            </div>
            <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold text-[#142B49]">
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
