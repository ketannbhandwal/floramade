"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PromoBanner({
  src,
  alt = "Floramade Ayurvedic Formulation",
  href = "/collection",
  width = 1024,
  height = 370,
  priority = false,
}) {
  return (
    <section className="w-full py-4 sm:py-6 md:py-8 bg-background">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-[#C5D5E8]/70 shadow-xs hover:shadow-md transition-shadow duration-300 bg-white"
        >
          <Link href={href} className="block relative w-full cursor-pointer group">
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1440px"
              quality={90}
              priority={priority}
              className="w-full h-auto object-cover select-none transition-transform duration-500 ease-out group-hover:scale-[1.01]"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
