"use client";

import React from "react";

// Crisp custom SVG icons matching the reference image, rendered in brand #39160D
function NaturalHealingIcon({ className = "w-12 h-12" }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M14 36C14 23 23 14 36 14C36 27 27 36 14 36Z"
        fill="#101D17"
        fillOpacity="0.14"
      />
      <path
        d="M14 36C14 23 23 14 36 14C36 27 27 36 14 36Z"
        stroke="#101D17"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 36C20 30 26 24 36 14"
        stroke="#101D17"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M20 18C17 19 13 22 10 27C12 32 16 35 22 36"
        stroke="#101D17"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CustomizedSolutionsIcon({ className = "w-12 h-12" }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Lightbulb shape */}
      <path
        d="M24 10C17.37 10 12 15.37 12 22C12 26.15 14.11 29.81 17.31 32H30.69C33.89 29.81 36 26.15 36 22C36 15.37 30.63 10 24 10Z"
        stroke="#101D17"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 36H29M21 40H27"
        stroke="#101D17"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Inner gear / cog */}
      <circle cx="24" cy="22" r="4.5" stroke="#101D17" strokeWidth="2" />
      <path
        d="M24 15V17M24 27V29M17 22H19M29 22H31M19.05 17.05L20.46 18.46M27.54 25.54L28.95 26.95M19.05 26.95L20.46 25.54M27.54 18.46L28.95 17.05"
        stroke="#101D17"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Small badge checkmark */}
      <circle cx="34" cy="30" r="4" fill="#101D17" />
      <path d="M32.5 30L33.7 31.2L35.8 28.8" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LongLastingWellnessIcon({ className = "w-12 h-12" }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Circular leaf wreath */}
      <path
        d="M24 8C15.16 8 8 15.16 8 24C8 32.84 15.16 40 24 40C32.84 40 40 32.84 40 24"
        stroke="#101D17"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Top right leaves */}
      <path
        d="M38 12C38 17 34 20 29 20C29 15 33 12 38 12Z"
        fill="#101D17"
      />
      <path
        d="M33 9C33 13 36 15 40 15C40 11 37 9 33 9Z"
        fill="#101D17"
      />
      {/* Person silhouette */}
      <circle cx="24" cy="19" r="3.5" fill="#101D17" />
      <path
        d="M17 32C17 27.5 20.13 24.5 24 24.5C27.87 24.5 31 27.5 31 32"
        stroke="#101D17"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HolisticHealthIcon({ className = "w-12 h-12" }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Person meditating / Lotus in hands */}
      <circle cx="24" cy="14" r="3.2" fill="#101D17" />
      <path
        d="M24 19C21 19 18 21.5 18 25C18 28 20.5 30 24 30C27.5 30 30 28 30 25C30 21.5 27 19 24 19Z"
        fill="#101D17"
        fillOpacity="0.15"
        stroke="#101D17"
        strokeWidth="2"
      />
      {/* Supporting lotus petals */}
      <path
        d="M18 23C15 21 13 23 14 26C15 29 19 29 20 29"
        stroke="#101D17"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M30 23C33 21 35 23 34 26C33 29 29 29 28 29"
        stroke="#101D17"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Cupped caring hand beneath */}
      <path
        d="M12 36C15 36 17 35 20 34L24 33L28 34C31 35 33 36 36 36C36 36 38 34 38 32C38 30 35 30 32 31L26 31L22 31C18 31 16 32 12 33"
        stroke="#101D17"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ICON_MAP = {
  natural: NaturalHealingIcon,
  solutions: CustomizedSolutionsIcon,
  wellness: LongLastingWellnessIcon,
  holistic: HolisticHealthIcon,
};

const DEFAULT_ICONS_BY_INDEX = [
  NaturalHealingIcon,
  CustomizedSolutionsIcon,
  LongLastingWellnessIcon,
  HolisticHealthIcon,
];

const fallbackBenefitsData = [
  {
    id: 1,
    title: "Natural Healing",
    description:
      "Floramade focuses on pure, plant-based herbs providing a holistic approach to health without harmful chemicals or synthetic additives.",
    icon: "natural",
  },
  {
    id: 2,
    title: "Customized Solutions",
    description:
      "Targeted Ayurvedic formulas for diabetes relief, liver detox, and digestion with tailored remedies for long-term results.",
    icon: "solutions",
  },
  {
    id: 3,
    title: "Long-Lasting Wellness",
    description:
      "Ayurvedic remedies promote lasting health by addressing root causes, ensuring sustainable vitality and daily wellness.",
    icon: "wellness",
  },
  {
    id: 4,
    title: "Holistic Health",
    description:
      "Following authentic Ayurveda principles, Floramade supports mind, body, and spirit to promote balance and well-being.",
    icon: "holistic",
  },
];

export default function BenefitsSection({ heading = "Benefits", benefits }) {
  const items = Array.isArray(benefits) && benefits.length > 0 ? benefits : fallbackBenefitsData;

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 bg-[#F8F4E9] relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Section Heading */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold tracking-tight text-[#171717]">
            {heading || "Benefits"}
          </h2>
        </div>

        {/* Cards Grid: Perfectly Balanced and Even Heights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6 lg:gap-7 items-stretch">
          {items.map((benefit, idx) => {
            const IconComponent =
              (typeof benefit.icon === "string" && ICON_MAP[benefit.icon]) ||
              DEFAULT_ICONS_BY_INDEX[idx % DEFAULT_ICONS_BY_INDEX.length] ||
              NaturalHealingIcon;

            return (
              <div
                key={benefit.id || idx}
                className="h-full flex flex-col justify-start bg-[#F8F4E9] rounded-2xl sm:rounded-[22px] p-4 sm:p-6 md:p-7 border border-[#DDD2BD] shadow-[0_4px_20px_rgba(18,61,43,0.03)] hover:shadow-[0_10px_30px_rgba(18,61,43,0.07)] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Icon */}
                <div className="mb-3 sm:mb-4 md:mb-5 shrink-0 flex items-center">
                  <IconComponent className="w-8 h-8 sm:w-11 sm:h-11 md:w-12 md:h-12" />
                </div>

                {/* Title (Consistent height ensures descriptions always align across row) */}
                <h3 className="text-[13.5px] sm:text-base md:text-lg font-bold tracking-tight text-[#171717] mb-2 leading-snug min-h-[38px] sm:min-h-[44px] flex items-center">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-[11.5px] sm:text-xs md:text-sm text-[#171717]/75 leading-relaxed tracking-tight font-normal flex-1">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

