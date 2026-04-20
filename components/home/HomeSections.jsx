"use client";

import Landing from "./components/Landing";
import Products from "./components/Products";
import Philosophy from "./components/Philosophy";
import Why from "./components/Why";
import Review from "./components/Review";
import Certificate from "./components/Certificate";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

export default function HomeSections({ products }) {
  return (
    <div className="bg-background text-foreground w-full">
      <Landing />
      <Certificate />
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-24 md:py-32 space-y-32">
        <Products products={products} />
      </div>
      <Philosophy />
      <Why />
      <Review />
    </div>
  );
}
