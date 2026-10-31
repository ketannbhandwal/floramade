"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function PolicyCTA() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto rounded-3xl bg-[#142B49] text-white p-8 sm:p-12 md:p-14 text-center relative overflow-hidden shadow-md">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 space-y-6"
        >
          <div className="space-y-2.5">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
              Still have questions?
            </h2>
            <p className="text-white/70 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Our practitioners and support team are here to help you with any queries regarding our policies or rituals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 max-w-2xl mx-auto">
            <a 
              href="mailto:floramade517@gmail.com" 
              className="p-4 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/20 transition-colors flex flex-col items-center gap-2 text-center"
            >
              <div className="h-10 w-10 rounded-full bg-[#D9A441]/20 text-[#D9A441] flex items-center justify-center">
                <Mail className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-white truncate max-w-[190px]">floramade517@gmail.com</span>
              <span className="text-[10px] text-white/50">Email Support</span>
            </a>

            <a 
              href="tel:+919220251059" 
              className="p-4 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/20 transition-colors flex flex-col items-center gap-2 text-center"
            >
              <div className="h-10 w-10 rounded-full bg-[#D9A441]/20 text-[#D9A441] flex items-center justify-center">
                <Phone className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-white">+91 9220251059</span>
              <span className="text-[10px] text-white/50">Mon - Sat (10am - 7pm)</span>
            </a>

            <Link 
              href="/contact" 
              className="p-4 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/20 transition-colors flex flex-col items-center gap-2 text-center sm:col-span-2 md:col-span-1"
            >
              <div className="h-10 w-10 rounded-full bg-[#D9A441]/20 text-[#D9A441] flex items-center justify-center">
                <MessageSquare className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-white">Contact Desk</span>
              <span className="text-[10px] text-white/50">Reach Out Instantly</span>
            </Link>
          </div>
        </motion.div>

        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D9A441]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#142B49]/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />
      </div>
    </section>
  );
}
