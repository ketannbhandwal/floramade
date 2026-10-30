"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";

export default function Products({ 
  products = [], 
  heading = "Featured Best Products",
  subheading = "Browse complete range of 100% organic & approved products."
}) {
  // Show up to 8 products in a clean 4-col (desktop) / 2-col (mobile) grid
  const visibleProducts = products.slice(0, 8);

  return (
    <section id="products" className="relative overflow-hidden py-12 sm:py-16 lg:py-20 bg-background">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12">
        
        {/* Header - Bold, Tight Tracking, Authentic Brown */}
        <div className="mb-8 sm:mb-10 md:mb-12 text-center max-w-2xl mx-auto space-y-1.5 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold tracking-tight text-[#171717]">
            {heading}
          </h2>
          {subheading && (
            <p className="text-xs sm:text-sm md:text-[15px] text-[#171717]/70 font-normal tracking-tight">
              {subheading}
            </p>
          )}
        </div>

        {/* Product Cards Layout: 2 cols on mobile, 4 cols on desktop */}
        {visibleProducts.length > 0 ? (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 md:gap-6">
              {visibleProducts.map((product, index) => (
                <motion.div
                  key={product._id || product.id || index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="h-full"
                >
                  <ProductCard product={product} index={index} />
                </motion.div>
              ))}
            </div>

            {/* Bottom "View Complete Collection" CTA */}
            <div className="mt-9 sm:mt-12 flex justify-center">
              <Link
                href="/collection"
                className="group inline-flex items-center gap-2 rounded-xl border border-[#101D17]/20 bg-transparent px-6 py-2.5 text-xs sm:text-sm font-semibold text-[#171717] tracking-tight transition-all hover:bg-[#101D17] hover:text-white hover:border-[#101D17] cursor-pointer"
              >
                View Complete Collection
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid overflow-hidden rounded-3xl border border-[#101D17]/15 bg-[#F8F4E9] md:grid-cols-[.8fr_1.2fr]">
            <div className="relative min-h-52 md:min-h-64">
              <Image src="/assets/about.jpg" alt="Traditional herbs and ingredients" fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#39160D]/40 to-transparent" />
            </div>
            <div className="flex flex-col items-start justify-center p-7 sm:p-10 lg:p-14">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#101D17]/10 text-[#171717]"><Leaf size={20} /></span>
              <h3 className="text-2xl font-medium text-[#171717] sm:text-3xl tracking-tight">A thoughtful collection is taking shape.</h3>
              <p className="mt-3 max-w-lg text-sm leading-6 text-[#171717]/65 sm:text-base tracking-tight">Our products will appear here as soon as they’re added to the Floramade catalogue.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
