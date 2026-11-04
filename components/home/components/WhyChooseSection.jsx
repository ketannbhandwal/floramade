"use client";

import Image from "next/image";
import { Leaf, FlaskConical, Award, Truck, ShieldCheck, HeartHandshake, CheckCircle2 } from "lucide-react";

const WHY_CHOOSE_ITEMS = [
  {
    id: "100-natural",
    title: "100% Natural",
    description: "All our products are made from pure, organic herbs sourced directly from nature.",
    icon: Leaf,
    image: "/assets/why-choose/100-natural.jpg",
    alt: "100% Natural Pure Botanical Herbs",
  },
  {
    id: "lab-tested",
    title: "Lab Tested",
    description: "Every batch is rigorously tested for purity, potency, and safety in certified labs.",
    icon: FlaskConical,
    image: "/assets/why-choose/lab-tested.jpg",
    alt: "Certified Laboratory Testing and Quality Assurance",
  },
  {
    id: "gmp-certified",
    title: "GMP Certified",
    description: "Our manufacturing follows Good Manufacturing Practices for highest quality standards.",
    icon: Award,
    image: "/assets/why-choose/gmp-certified.jpg",
    alt: "GMP Certified Ayurvedic Manufacturing Standards",
    badges: ["Quality Control", "High Standards", "Safety First"],
  },
  {
    id: "fast-delivery",
    title: "Fast Delivery",
    description: "Free shipping across India with express doorstep delivery options available.",
    icon: Truck,
    image: "/assets/why-choose/fast-delivery.jpg",
    alt: "Express Fast Shipping Across India",
  },
  {
    id: "secure-payments",
    title: "Secure Payments",
    description: "Multiple payment options with 100% secure transactions and data protection.",
    icon: ShieldCheck,
    image: "/assets/why-choose/secure-payments.jpg",
    alt: "100% Secure Encrypted Online Payment",
  },
  {
    id: "expert-support",
    title: "Expert Support",
    description: "Our Ayurveda experts are available to guide you on your wellness journey.",
    icon: HeartHandshake,
    image: "/assets/why-choose/expert-support.jpg",
    alt: "Ayurvedic Doctor Consultation and Expert Support",
  },
];

export default function WhyChooseSection() {
  return (
    <section className="w-full py-12 sm:py-16 md:py-20 bg-[#F7F9FC] relative select-none">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-14 space-y-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold tracking-tight text-[#142B49] leading-tight">
            Why Choose <span className="text-[#142B49]">Floramade</span>?
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#1A2332]/75 leading-relaxed font-normal">
            We&apos;re committed to bringing you the finest Ayurvedic products, crafted with ancient wisdom and modern science.
          </p>
        </div>

        {/* 6 Feature Cards Grid (2 rows x 3 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {WHY_CHOOSE_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group relative h-[220px] sm:h-[240px] md:h-[250px] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#C5D5E8]/80 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Background Image with slight zoom on hover */}
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={85}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />

                {/* Dark Contrast Gradient Overlay for crystal-clear readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/35 group-hover:via-black/50 transition-colors" />

                {/* Card Content Stage */}
                <div className="relative z-10 h-full p-5 sm:p-6 flex flex-col justify-between">
                  
                  {/* Top Bar: Icon + Optional Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-black/40 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-xs group-hover:border-[#D9A441] group-hover:scale-105 transition-all">
                      <Icon size={20} className="text-white" />
                    </div>

                    {item.badges && (
                      <div className="flex flex-col items-end gap-1">
                        {item.badges.map((badge, bIdx) => (
                          <span
                            key={bIdx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/45 backdrop-blur-xs border border-white/20 text-[10px] font-semibold text-white/95 tracking-tight shadow-2xs"
                          >
                            <CheckCircle2 size={11} className="text-[#D9A441]" />
                            <span>{badge}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Bar: Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight leading-snug drop-shadow-xs">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-white/85 leading-relaxed font-normal drop-shadow-2xs line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

