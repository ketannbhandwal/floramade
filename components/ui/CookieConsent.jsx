"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cookie } from "lucide-react";
import Link from "next/link";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("floramade-cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("floramade-cookie-consent", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("floramade-cookie-consent", "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[95] max-w-sm sm:max-w-[400px] w-[calc(100vw-2rem)]"
        >
          <div className="bg-white text-[#123838] p-3.5 sm:p-4 rounded-2xl shadow-[0_12px_36px_rgba(18,103,104,0.18)] border border-[#DCE8E8] flex items-start gap-3">
            {/* Small Cookie Icon Bubble */}
            <div className="w-8 h-8 rounded-xl bg-[#126768]/10 text-[#126768] flex items-center justify-center shrink-0 mt-0.5">
              <Cookie size={17} />
            </div>

            {/* Content & Action Buttons */}
            <div className="flex-1 min-w-0 pr-0.5">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs sm:text-sm font-bold text-[#123838] tracking-tight">
                  Cookie Preferences
                </h4>
                <button
                  type="button"
                  onClick={handleDecline}
                  className="p-1 rounded-lg text-[#123838]/50 hover:text-[#123838] hover:bg-[#F4F8F8] transition-colors -mr-1"
                  aria-label="Dismiss cookie notice"
                >
                  <X size={15} />
                </button>
              </div>

              <p className="text-[11px] sm:text-xs text-[#123838]/75 leading-relaxed mb-3">
                We use cookies to optimize your browsing experience. By continuing, you agree to our{" "}
                <Link
                  href="/privacy-policy"
                  className="text-[#126768] font-semibold underline underline-offset-2 hover:text-[#FF8900] transition-colors"
                >
                  Privacy Policy
                </Link>.
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAccept}
                  className="px-4 py-1.5 rounded-xl bg-[#126768] text-white hover:bg-[#0D5253] transition-all font-bold text-[11px] uppercase tracking-tight shadow-xs cursor-pointer active:scale-95"
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={handleDecline}
                  className="px-3 py-1.5 rounded-xl bg-[#F4F8F8] text-[#123838] hover:bg-[#DCE8E8] transition-all font-semibold text-[11px] cursor-pointer"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
