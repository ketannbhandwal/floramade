"use client";

import { Award, ShieldCheck, Headphones, Truck, CheckCircle2 } from "lucide-react";

const MortarIcon = ({ className = "w-4 h-4 shrink-0" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M4 11a8 8 0 0 0 16 0H4Z" />
    <path d="m8 11 3.5-8 3 1.5-2.5 6.5" />
    <path d="M7 19h10" />
  </svg>
);

const MARQUEE_ITEMS = [
  { icon: MortarIcon, text: "100% Ayurvedic" },
  { icon: Award, text: "Certified & Trusted" },
  { icon: ShieldCheck, text: "Safe Payment" },
  { icon: Headphones, text: "Online Support" },
  { icon: Truck, text: "Free Express Shipping" },
  { icon: CheckCircle2, text: "Lab Tested & Pure" },
];

export default function BetterThanSection() {
  // Duplicate list 4 times to guarantee a seamless, infinite loop on any screen width
  const displayItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <section 
      aria-label="Store benefits marquee" 
      className="relative w-full overflow-hidden bg-[#126768] text-white border-y border-[#126768]/20 py-3 sm:py-3.5 select-none"
    >
      <div className="flex w-max animate-marquee items-center gap-8 sm:gap-12 lg:gap-16">
        {displayItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx} 
              className="flex items-center gap-2.5 text-xs sm:text-sm font-medium tracking-tight text-white/90 hover:text-white transition-colors shrink-0"
            >
              <span className="text-[#FF8900] flex items-center justify-center">
                <Icon className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0" />
              </span>
              <span>{item.text}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
