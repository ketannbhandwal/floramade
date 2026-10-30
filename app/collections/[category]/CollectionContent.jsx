"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/product/ProductSkeleton";
import { ArrowRight } from "lucide-react";

export default function CollectionContent({ products, category }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, [products]);

  const categoryTitle = category ? category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "Collection";

  return (
    <div className="min-h-screen bg-background text-foreground w-full pt-6 md:pt-10 pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 md:mb-12 text-center max-w-2xl mx-auto space-y-2"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight uppercase text-[#123D2B]">
            {categoryTitle}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#171717]/70 font-normal">
            Meticulously crafted formulations for balanced living and holistic wellness.
          </p>
        </motion.div>

        {/* Products Grid: 2 cols on mobile, 4 cols on desktop */}
        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 md:gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <ProductCard product={product} index={i} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="py-16 border border-[#123D2B]/10 rounded-2xl bg-white/40 flex flex-col items-center justify-center text-center space-y-6"
          >
            <p className="text-base font-light text-[#171717]/70">
              Products for this collection are coming soon.
            </p>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 h-10 px-6 rounded-full bg-[#123D2B] text-white hover:bg-[#123D2B] transition-colors duration-300 font-semibold uppercase tracking-wider text-xs"
            >
              Back to Home
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
