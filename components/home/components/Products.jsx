"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";

export default function Products({ products = [], heading = "Featured Best Products" }) {
  const visibleProducts = products.slice(0, 4);

  return (
    <section id="products" className="relative overflow-hidden py-14 sm:py-16 lg:py-20 bg-background">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12">
        {/* Clean Heading - Sans Bold, Tracking Tight, No Subtitle */}
        <div className="mb-8 sm:mb-10 md:mb-12 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-[32px] font-bold tracking-tight text-[#39160D]">
            {heading}
          </h2>
        </div>

        {/* Product Cards Layout: Centered when 1 or 2 items, 4-col grid when 4 items */}
        {visibleProducts.length > 0 ? (
          <div>
            <div
              className={`w-full ${visibleProducts.length === 1
                ? "max-w-[320px] mx-auto"
                : visibleProducts.length === 2
                  ? "max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6"
                  : visibleProducts.length === 3
                    ? "max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
                    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
                }`}
            >
              {visibleProducts.map((product, index) => (
                <motion.div
                  key={product._id || product.id || index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className="h-full"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* Bottom "View Complete Collection" CTA */}
            <div className="mt-9 sm:mt-12 flex justify-center">
              <Link
                href="/collection"
                className="group inline-flex items-center gap-2 rounded-full border border-[#39160D]/20 bg-transparent px-6 py-2.5 text-xs sm:text-sm font-semibold text-[#39160D] tracking-tight transition-all hover:bg-[#39160D] hover:text-[#FFF7EB] hover:border-[#39160D] cursor-pointer"
              >
                View Complete Collection
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid overflow-hidden rounded-3xl border border-[#39160D]/15 bg-[#F5EADB] md:grid-cols-[.8fr_1.2fr]">
            <div className="relative min-h-52 md:min-h-64">
              <Image src="/assets/about.jpg" alt="Traditional herbs and ingredients" fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#39160D]/40 to-transparent" />
            </div>
            <div className="flex flex-col items-start justify-center p-7 sm:p-10 lg:p-14">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#39160D]/10 text-[#39160D]"><Leaf size={20} /></span>
              <h3 className="text-2xl font-medium text-[#39160D] sm:text-3xl">A thoughtful collection is taking shape.</h3>
              <p className="mt-3 max-w-lg text-sm leading-6 text-[#39160D]/65 sm:text-base">Our products will appear here as soon as they’re added to the Floramade catalogue.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
