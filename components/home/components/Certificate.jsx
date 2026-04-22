import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import FloatingLeaf from '@/components/ui/FloatingLeaf';

const certificates = [
  { id: 1, title: 'Gultun Free', name: 'Gultun Free' },
  { id: 2, title: 'Pure, Natural', name: 'Vegan' },
  { id: 3, title: 'Clinical Tested', name: 'Ingredient' },
  { id: 4, title: 'GMO Free', name: 'GMO Free' },
];

function CertificateSlider() {
  return (
    <section className="py-16 mt-10 overflow-hidden relative">
      {/* Decorative Leaves */}
      <FloatingLeaf 
        type="single" 
        className="w-16 h-16 md:w-20 md:h-20 top-0 left-[10%] opacity-70 rotate-[20deg]" 
        delay={0.3} 
        parallaxSpeed={60} 
      />
      <FloatingLeaf 
        type="double" 
        className="w-20 h-20 md:w-28 md:h-28 bottom-0 right-[5%] opacity-50 rotate-[-120deg]" 
        delay={0.7} 
        parallaxSpeed={-50} 
        blur
      />

      <h2 className="text-center text-4xl font-extrabold text-[#1b3a27] mb-16 relative z-10">
        Certified by Years of Trust
      </h2>
      
      <div className="relative flex overflow-x-hidden">
        <motion.div
          className="flex gap-10 pr-10"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            duration: 40, // Slower for a premium feel
            ease: "linear",
          }}
        >
          {[...certificates, ...certificates].map((cert, index) => (
            <div
              key={`${cert.id}-${index}`}
              className="flex-shrink-0 flex items-center gap-6 bg-transparent border-2 border-[#1b3a27]/10 rounded-full py-5 px-10 hover:border-[#1b3a27]/30 transition-colors duration-300"
            >
              <div className="w-14 h-14 relative">
                <Image 
                  src={`/certificate/${cert.id}.svg`} 
                  alt={cert.title} 
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[#1b3a27] font-semibold text-lg whitespace-nowrap">
                {cert.title}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default CertificateSlider;