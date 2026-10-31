"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ open, title, subtitle, onClose, children, maxWidth = "max-w-lg" }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#17140f]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div 
        className={`relative w-full ${maxWidth} rounded-3xl border border-[#C5D5E8] bg-[#FFFFFF] shadow-2xl overflow-hidden z-10 transition-all duration-300 my-auto`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#C5D5E8]/80 px-6 py-4 sm:px-7 sm:py-5 bg-white">
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#1A2332] tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-[#1A2332]/60 mt-0.5 font-normal">
                {subtitle}
              </p>
            )}
          </div>
          <button 
            onClick={onClose} 
            className="rounded-full p-2 text-[#1A2332]/60 hover:text-[#1A2332] hover:bg-[#142B49]/10 transition-all active:scale-95 border border-[#142B49]/10"
            aria-label="Close"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7 max-h-[calc(85vh-80px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
