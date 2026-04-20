'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const reviews = [
  { 
    name: "Advocate Riya Sisodiya", 
    role: "Legal Consultant", 
    text: "Valtrix Studio transformed our digital presence. They built a professional, high-end landing page that captures leads effectively while maintaining the sophisticated look a legal firm requires.", 
    img: "data:image/jpeg;base64,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",
    initials: "RS"
  },
  { 
    name: "Vikash Mewada", 
    role: "Strategy Lead", 
    text: "A seamless professional experience. They didn't just build a site; they engineered a growth tool for us. The SEO-optimized architecture has significantly improved our organic reach.", 
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB4WG_UGv49cO2tHpvF0vOnqki9CI3j1_1Aw&s",
    initials: "VM" 
  },
  { 
    name: "Chandra Prakash Sahu", 
    role: "Tech Entrepreneur", 
    text: "Highly impressed with the attention to detail. The UI is clean, the animations are buttery smooth, and the performance is lightning-fast. These guys are the gold standard for MERN development.", 
    img: "https://karmaacademypublicschool.com/assets/team-1.jpg",
    initials: "CPS" 
  },
  { 
    name: "Garima Singh Rajput", 
    role: "Founder, GSR Media", 
    text: "The automation systems and AI features integrated into our workflow by the team have saved us countless hours. Their technical depth and creative execution are truly world-class.", 
    img: null, // Test for fallback
    initials: "GSR" 
  },
  { 
    name: "Nisha", 
    role: "Founder, SwiftShiftShine", 
    text: "Since the launch of our new website, our booking flow has become incredibly smooth. We've seen a massive jump in mobile inquiries, thanks to their mobile-first design approach.", 
    img: null,
    initials: "N" 
  },
  { 
    name: "Apex Global Tech", 
    role: "Director", 
    text: "The team's ability to grasp complex requirements and turn them into intuitive, bento-style designs is unmatched. Highly recommended for premium agency projects.", 
    img: null,
    initials: "AGT" 
  }
];

const Review = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(reviews.length / itemsPerPage);

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentPage((prev) => (prev + newDirection + totalPages) % totalPages);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 40 : -40,
      opacity: 0,
      filter: "blur(12px)",
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 40 : -40,
      opacity: 0,
      filter: "blur(12px)",
    })
  };

  return (
    <section className="py-6 px-6 overflow-hidden relative">
      {/* Subtle Light Blue/Purple background accents */}
      <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[120px] -z-10" />
      <div className="absolute -bottom-24 -left-24 w-[600px] h-[600px] bg-purple-50/50 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-6xl uppercase font-bold tracking-tighter text-slate-900 leading-[0.85]">
              Trusted by <br /> <span className="text-black">Visionary Leaders.</span>
            </h2>
          </div>
          
          <div className="flex gap-4">
            <button onClick={() => paginate(-1)} className="group w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center bg-white transition-all duration-300">
              <ChevronLeft size={20} className="text-slate-400  transition-colors" />
            </button>
            <button onClick={() => paginate(1)} className="group w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center bg-white transition-all duration-300">
              <ChevronRight size={20} className="text-slate-400   transition-colors" />
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="relative">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentPage}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {reviews.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((rev, index) => (
                <div
                  key={index}
                  className="group relative p-10 rounded-[2rem] bg-white border border-slate-100 flex flex-col h-full transition-all duration-500 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-2"
                >

                  <div className="flex gap-1 mb-8">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="#f59e0b" className="text-amber-500" />
                    ))}
                  </div>

                  <p className="text-lg text-slate-600 leading-relaxed mb-12 flex-grow font-medium">
                    "{rev.text}"
                  </p>

                  <div className="flex items-center gap-4 pt-8 border-t border-slate-50">
                    <div className="relative flex-shrink-0">
                        {rev.img ? (
                          <img 
                            src={rev.img} 
                            alt={rev.name} 
                            className="w-14 h-14 rounded-full object-cover shadow-lg border-2 border-white"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br  flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {rev.initials}
                          </div>
                        )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-md">{rev.name}</h4>
                      <p className="text-[10px] text-slate-900 font-black uppercase tracking-widest mt-0.5">
                        {rev.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Review;