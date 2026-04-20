import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

const certificates = [
  { id: 1, title: 'ISO 9001', desc: 'Quality Management' },
  { id: 2, title: 'Organic', desc: 'Pure Extracts' },
  { id: 3, title: 'GMP', desc: 'Pharma Grade' },
  { id: 4, title: 'AYUSH', desc: 'Tradition' },
]

function Certificate() {
  return (
    <section className="py-20 md:py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* Left Side: Sticky/Fixed on Desktop */}
        <div className="lg:w-1/3 flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="text-[#c5a059] font-medium tracking-[0.2em] uppercase text-xs mb-6">Accreditation</h4>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-[#1b3a27] leading-[0.9]">Trusted <br/>Standards</h2>
            <div className="w-16 h-px bg-[#c5a059] my-8" />
            <p className="text-[#1b3a27]/60 leading-relaxed max-w-md">
              We uphold the highest levels of purity and safety. Every product we craft meets rigorous international standards.
            </p>
          </motion.div>
        </div>

        {/* Right Side: Responsive Grid */}
        <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          {certificates.map((cert, index) => (
            <motion.div 
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              // Only apply the staggered vertical shift on tablets and up
              className={`relative aspect-[5/4] sm:aspect-[4/5] bg-[#f5f2ed] rounded-2xl p-6 lg:p-8 flex flex-col justify-between group 
                ${index === 1 || index === 3 ? 'md:translate-y-12' : ''}`}
            >
              <div className="flex-grow flex items-center justify-center">
                <div className="w-20 h-20 lg:w-24 lg:h-24 relative transition-transform duration-700 group-hover:scale-110">
                   <Image 
                     src={`/certificate/${cert.id}.svg`} 
                     alt={cert.title} 
                     fill 
                     sizes="(max-width: 768px) 100vw, 25vw"
                     className="object-contain mix-blend-multiply" 
                   />
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-[#1b3a27] font-serif text-lg lg:text-xl">{cert.title}</h3>
                <p className="text-[#1b3a27]/50 text-[10px] lg:text-xs tracking-[0.2em] uppercase mt-1">{cert.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Certificate