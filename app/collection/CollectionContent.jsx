"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/product/ProductSkeleton";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

export default function CollectionContent({ products }) {
  return (
    <div className="min-h-screen bg-background text-foreground w-full pt-6 md:pt-10 pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 md:mb-12 text-center max-w-2xl mx-auto space-y-2"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight uppercase text-[#872B10]">
            Our Ayurvedic Collection
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#39160D]/70 font-normal">
            Meticulously crafted 100% natural formulations for holistic healing and balanced living.
          </p>
        </motion.div>

        {products && products.length > 0 ? (
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
          <ProductGridSkeleton count={8} />
        )}
      </div>
    </div>
  );
}
