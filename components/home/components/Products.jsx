"use client";

import React from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { motion } from 'framer-motion';
import FloatingLeaf from '@/components/ui/FloatingLeaf';

function Products({ products = [] }) {
  return (
    <section id="products" className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Dynamic Leaf Decorations */}
      <FloatingLeaf 
        type="branch" 
        className="w-48 h-48 md:w-64 md:h-64 -top-10 -right-20 md:-top-16 md:-right-24 opacity-40 rotate-[135deg]" 
        delay={0.2} 
        parallaxSpeed={80}
        blur 
      />
      <FloatingLeaf 
        type="double" 
        className="w-24 h-24 md:w-32 md:h-32 top-[40%] -left-10 md:-left-12 opacity-60 rotate-[-45deg]" 
        delay={0.5} 
        parallaxSpeed={-40}
      />
      
      <div className="max-w-7xl mx-auto space-y-12 md:space-y-16 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col">
          <SectionHeader
            title="Shop Now"
            description="Balance Your Elements, Naturally."
          />
        </div>

        {/* 3-Column Grid */}
        <div className="grid gap-6 md:gap-8 lg:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {products.length > 0 ? (
            products.slice(0, 3).map((p, i) => (
              <motion.div 
                key={p._id || i} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.215, 0.61, 0.355, 1] }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))
          ) : (
            <p className="text-foreground/30 col-span-full text-center py-16 md:py-24 font-light italic text-sm sm:text-base">
              New arrivals coming soon.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Products;