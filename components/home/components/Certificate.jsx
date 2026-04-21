import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const certificates = [
  { id: 1, title: 'ISO Certified', name: 'ISO 9001' },
  { id: 2, title: 'DSIR Recognised', name: 'DSIR' },
  { id: 3, title: 'Kerala Govt. Approved Centre', name: 'Kerala' },
  { id: 4, title: 'NABH Accredited', name: 'NABH' },
];

function CertificateSlider() {
  return (
    <section className="py-16 mt-10 overflow-hidden">
      <h2 className="text-center text-4xl font-bold text-[#1b3a27] mb-16">
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