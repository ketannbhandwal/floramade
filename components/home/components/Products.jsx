"use client";

import React from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { motion } from 'framer-motion';

function Products({ products = [] }) {
  return (
    <section id="products" className="py-24 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header Section */}
        <div className="flex flex-col">
          <SectionHeader
            title="Shop Now"
            description="Balance Your Elements, Naturally."
          />
        </div>

        {/* 3-Column Grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
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
            <p className="text-foreground/30 col-span-full text-center py-24 font-light italic">
              New arrivals coming soon.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Products;