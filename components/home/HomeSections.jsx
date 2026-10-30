"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import Landing from "./components/Landing";
import BetterThanSection from "./components/BetterThanSection";
import BrandStory from "./components/BrandStory";
import BenefitsSection from "./components/BenefitsSection";
import FlagshipProducts from "./components/FlagshipProducts";
import ProductSpotlight from "./components/ProductSpotlight";

const Products = dynamic(() => import("./components/Products"), { ssr: true });
const Review = dynamic(() => import("./components/Review"), { ssr: true });

export default function HomeSections({ 
  products, 
  banners, 
  concerns, 
  productHeading, 
  productSubheading,
  benefitsHeading,
  benefits,
  testimonialsPretitle,
  testimonialsTitle,
  testimonialsSubtitle,
  testimonials,
  spotlightProductId
}) {
  return (
    <div className="bg-background text-foreground w-full">
      <Landing banners={banners} />
      <BetterThanSection />
      <Products 
        products={products} 
        heading={productHeading} 
        subheading={productSubheading} 
      />
      <BrandStory />
      <BenefitsSection 
        heading={benefitsHeading}
        benefits={benefits}
      />
      <FlagshipProducts products={products} />
      <ProductSpotlight products={products} selectedId={spotlightProductId} />
      <Suspense fallback={null}>
        <Review 
          pretitle={testimonialsPretitle}
          title={testimonialsTitle}
          subtitle={testimonialsSubtitle}
          testimonials={testimonials}
        />
      </Suspense>
    </div>
  );
}
