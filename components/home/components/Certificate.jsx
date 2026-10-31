import React from 'react';
import Image from 'next/image';

const certificates = [
  { id: 1, title: 'Gluten Free', name: 'Gluten Free' },
  { id: 2, title: 'Pure, Natural', name: 'Vegan' },
  { id: 3, title: 'Clinical Tested', name: 'Ingredient' },
  { id: 4, title: 'GMO Free', name: 'GMO Free' },
];

function CertificateSlider() {
  return (
    <section className="py-20 overflow-hidden relative bg-[#F7F9FC]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
        <h2 className="text-center text-3xl md:text-4xl font-light text-[#1A2332] mb-16 tracking-tight">
          Certified by <span className="font-medium italic text-[#142B49]">Years of Trust</span>
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="group flex flex-col items-center gap-6 p-8 bg-[#F7F9FC] border border-[#C5D5E8] rounded-3xl hover:border-[#142B49]/30 transition-all duration-500 hover:shadow-xl hover:shadow-[#142B49]/5"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 relative grayscale group-hover:grayscale-0 transition-all duration-500">
                <Image 
                  src={`/certificate/${cert.id}.svg`} 
                  alt={cert.title} 
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-center space-y-1">
                <span className="block text-[#1A2332] font-semibold text-lg tracking-tight">
                  {cert.title}
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-[#1A2332]/50 font-bold">
                  {cert.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CertificateSlider;
