"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Eye, Lock, FileText, Database, ShieldAlert } from "lucide-react";
import PolicyCTA from "@/components/policy/PolicyCTA";
import CouponSection from "@/components/policy/CouponSection";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8F5EF] pt-24 md:pt-32">
      {/* Hero Section */}
      <section className="px-6 py-20 text-center relative overflow-hidden">
        <motion.div {...fadeUp} className="max-w-4xl mx-auto space-y-6 relative z-10">
          <h1 className="text-5xl md:text-7xl font-light italic font-display text-[#2F3E36]">Privacy Policy</h1>
          <p className="text-[#2F3E36]/60 font-light text-lg max-w-2xl mx-auto uppercase tracking-[0.1em]">
            Your trust is our most valued element.
          </p>
        </motion.div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[#7A9E7E]/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Data Collection - Section (Light) */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-light italic font-display text-[#2F3E36]">Information We Collect</h2>
                <p className="text-[#2F3E36]/60 font-light leading-relaxed">
                  To provide you with a premium Ayurvedic experience, we collect essential information during your journey with us.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { icon: FileText, title: "Personal Details", text: "Name, email address, and phone number for account creation and communication." },
                  { icon: Database, title: "Order Information", text: "Shipping address and purchase history to fulfill your wellness requirements." },
                  { icon: Eye, title: "Usage Data", text: "Browsing behavior and preferences to personalize your experience on our website." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 items-start">
                    <div className="h-10 w-10 rounded-full bg-[#7A9E7E]/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <item.icon size={18} className="text-[#7A9E7E]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-[#2F3E36]">{item.title}</h4>
                      <p className="text-sm text-[#2F3E36]/50 font-light">{item.text}</p>
                    </div>
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
              <div className="space-y-8 relative z-10">
                <ShieldCheck size={100} className="mx-auto text-[#7A9E7E]/30" />
                <h3 className="text-3xl font-light italic text-white/90">Data Protection</h3>
                <p className="text-white/40 font-light text-sm max-w-xs mx-auto uppercase tracking-widest">Industry standard encryption</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Security - Section (Dark) */}
      <section className="py-24 px-6 bg-[#2F3E36] text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Lock,
              title: "Payment Security",
              desc: "We do not store your credit card or payment information. All transactions are handled via secure, PCI-compliant payment gateways."
            },
            {
              icon: ShieldAlert,
              title: "Third-Party Sharing",
              desc: "We never sell your data. Information is only shared with trusted logistics partners to ensure your order reaches you safely."
            },
            {
              icon: Eye,
              title: "Transparency",
              desc: "You have the right to access, modify, or request deletion of your personal data at any time through your account settings."
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-10 rounded-[2.5rem] border border-white/10 bg-white/5 space-y-6"
            >
              <item.icon size={28} className="text-[#7A9E7E]" />
              <h3 className="text-2xl font-light font-display">{item.title}</h3>
              <p className="text-sm text-white/50 font-light leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <CouponSection />
      <PolicyCTA />
    </div>
  );
}

