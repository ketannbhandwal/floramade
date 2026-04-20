'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const reviews = [
  { 
    name: "Mr. Birender Kumar", 
    role: "Verified Customer", 
    text: "I've been using Fiveetatva products for 3 months now and my blood sugar levels have stabilized remarkably. The natural ingredients give me peace of mind, and I no longer experience those mid-day energy crashes. Highly recommend for anyone looking for a natural approach to wellness.", 
    img: "/review/15.jpeg",
    initials: "BK"
  },
  { 
    name: "Mr. Jamuna Bhardwaj", 
    role: "Verified Customer", 
    text: "Good results after 2 weeks of use. My sugar cravings have reduced significantly and I feel more energetic throughout the day. The products are easy to use and don't have any unpleasant aftertaste. Will continue using this product.", 
    img: "/review/14.jpeg",
    initials: "JB" 
  },
  { 
    name: "Mrs. Indra Devi", 
    role: "Verified Customer", 
    text: "Very effective and natural. My doctor recommended trying Ayurvedic support for my metabolic health, and these products have been a game-changer. Love that they're made in India with pure ingredients. The quality is evident in the results.", 
    img: "/review/13.jpeg",
    initials: "ID" 
  },
  { 
    name: "Mr. Amarnath", 
    role: "Verified Customer", 
    text: "Great products for daily use. Easy to consume and I've noticed a significant improvement in my sugar levels after using this for 6 weeks. The herbal blend makes it feel comprehensive and effective.", 
    img: "/review/12.jpeg",
    initials: "A" 
  },
  { 
    name: "Mrs. Chanda Devi", 
    role: "Verified Customer", 
    text: "Good quality and effective. The products have a pleasant natural taste. My post-meal sugar spikes have reduced considerably since I started using this. Trust the Ayurvedic formulation completely.", 
    img: "/review/11.jpeg",
    initials: "CD" 
  },
  { 
    name: "Rakesh Divakar", 
    role: "Verified Customer", 
    text: "Best Ayurvedic products I've used. The combination of traditional herbs works synergistically to support metabolic health. Made in India with authentic ingredients - that's what convinced me to try it, and it delivers.", 
    img: "/review/10.jpeg",
    initials: "RD" 
  },
  { 
    name: "Mr. Rajneesh", 
    role: "Verified Customer", 
    text: "Excellent for digestion. No more bloating! I've struggled with digestive issues for years, and these products have been a lifesaver. Feel lighter and more comfortable after every meal now.", 
    img: "/review/9.jpeg",
    initials: "R" 
  },
  { 
    name: "Mr. Surender Kumar", 
    role: "Verified Customer", 
    text: "Very effective for acidity relief. I used to rely on antacids regularly, but since starting these products, my acidity has reduced dramatically. Love that it's made with traditional Ayurvedic herbs. A must-have for anyone with digestive concerns.", 
    img: "/review/8.jpeg",
    initials: "SK" 
  },
  { 
    name: "Amarjit", 
    role: "Verified Customer", 
    text: "Best digestive products available. The taste is mild and pleasant, unlike some other products that can be harsh. The herbal combination is perfect for overall gut health. Highly recommend for daily use.", 
    img: "/review/7.jpeg",
    initials: "A" 
  },
  { 
    name: "Mrs. Sarita Devi", 
    role: "Verified Customer", 
    text: "Amazing results! I've tried many Ayurvedic products before, but Fiveetatva stands out. The quality is exceptional and the results speak for themselves. My family and I are now regular customers.", 
    img: "/review/6.jpeg",
    initials: "SD" 
  },
  { 
    name: "Mr. Nand Kishor Poddar", 
    role: "Verified Customer", 
    text: "Truly authentic Ayurvedic formulation. The attention to detail in the ingredients selection is evident. These products have helped me maintain balanced health naturally. Highly recommend to everyone looking for genuine Ayurvedic solutions.", 
    img: "/review/5.jpeg",
    initials: "NKP" 
  },
  { 
    name: "Virender", 
    role: "Verified Customer", 
    text: "Outstanding quality and effectiveness. The products are exactly what I was looking for - natural, potent, and made with care. The delivery was prompt and the packaging is excellent. Will definitely order again.", 
    img: "/review/3.jpeg",
    initials: "V" 
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
                            className="w-14 h-14 rounded-full object-cover object-top shadow-lg border-2 border-white"
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