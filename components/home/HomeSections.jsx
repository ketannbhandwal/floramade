"use client";

import dynamic from 'next/dynamic';
import Landing from "./components/Landing";
import BetterThanSection from "./components/BetterThanSection";

// Lazy load sections below the fold
const Products = dynamic(() => import("./components/Products"), { ssr: true });
const Philosophy = dynamic(() => import("./components/Philosophy"), { ssr: true });
const Why = dynamic(() => import("./components/Why"), { ssr: true });
const Review = dynamic(() => import("./components/Review"), { ssr: true });
const Certificate = dynamic(() => import("./components/Certificate"), { ssr: true });
const Story = dynamic(() => import("./components/Story"), { ssr: true });

export default function HomeSections({ products }) {
  return (
    <div className="bg-background text-foreground w-full">
      <Landing />
      <BetterThanSection />
      <Certificate />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-12 lg:py-16 space-y-16 md:space-y-24 lg:space-y-32">
        <Products products={products} />
      </div>
      <Philosophy />
      <Story />
      <Why />
      <Review />
    </div>
  );
}
