"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  ShieldCheck, 
  Leaf, 
  Sparkles, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Quote, 
  Globe, 
  HeartHandshake, 
  FlaskConical, 
  Check, 
  Phone,
  Building2
} from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

const certificates = [
  { id: 1, title: "Gluten Free", subtitle: "Zero fillers & gluten" },
  { id: 2, title: "100% Natural", subtitle: "Pure vegan botanical extracts" },
  { id: 3, title: "Clinical Tested", subtitle: "Standardized active herbs" },
  { id: 4, title: "Non-GMO", subtitle: "Zero genetically modified inputs" },
];

const pillars = [
  {
    icon: Leaf,
    title: "Uncompromising Purity",
    description: "Every formulation is crafted from 100% pure, sustainably harvested whole botanical herbs—free from harmful chemicals, parabens, and synthetic additives."
  },
  {
    icon: FlaskConical,
    title: "Shastra & Modern Science",
    description: "We merge time-tested classical Ayurvedic scriptures (Charaka & Sushruta Samhita) with contemporary standardized testing protocols for proven efficacy."
  },
  {
    icon: ShieldCheck,
    title: "Certified & Lab-Verified",
    description: "Manufactured in licensed GMP-compliant facilities with rigorous heavy metal screening, microbial testing, and batch-wise quality assurance."
  },
  {
    icon: HeartHandshake,
    title: "Root-Cause Healing",
    description: "Rather than providing temporary quick fixes, our Ayurvedic formulations balance bodily doshas to target the root cause of metabolic & lifestyle imbalances."
  }
];

export default function AboutContent() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F7F9FC] text-[#1A2332] font-sans pb-20 selection:bg-[#142B49] selection:text-white">
        
        {/* --- 1. HERO HEADER --- */}
        <section className="px-4 sm:px-6 pt-6 pb-12 md:pt-10 md:pb-16 text-center max-w-4xl mx-auto space-y-6">
          <motion.div {...fadeUp} className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#142B49]/10 text-[#142B49] text-[11px] font-bold uppercase tracking-wider">
              <Sparkles size={13} />
              <span>Our Heritage & Philosophy</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#1A2332] leading-[1.15]">
              Rooted in Ancient Wisdom, <br className="hidden sm:inline" />
              <span className="font-serif italic text-[#142B49] font-normal">Refined for Modern Living.</span>
            </h1>

            <p className="text-xs sm:text-base text-[#1A2332]/75 max-w-2xl mx-auto leading-relaxed font-normal">
              Founded in Delhi by Suraj Gaur, <strong>Floramade</strong> bridges classical Ayurvedic science with botanical purity—formulating high-potency herbal remedies that nurture daily balance, sugar metabolism, and long-term vitality.
            </p>
          </motion.div>

          {/* Quick Trust Pills Strip */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2 text-[11px] sm:text-xs font-semibold text-[#1A2332]"
          >
            {[
              "100% Botanical Extracts",
              "GMP Certified Manufacturing",
              "Zero Heavy Metals",
              "Ethically Made in India"
            ].map((pill, i) => (
              <div 
                key={i} 
                className="px-3.5 py-1.5 rounded-full bg-[#F7F9FC] border border-[#C5D5E8] shadow-2xs flex items-center gap-1.5"
              >
                <Check size={13} className="text-[#142B49] stroke-[2.5]" />
                <span>{pill}</span>
              </div>
            ))}
          </motion.div>
        </section>


        {/* --- 2. OUR STORY & PHILOSOPHY (Editorial 2-Column) --- */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Visual Frame */}
            <motion.div {...fadeUp} className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                <Image 
                  src="/assets/aboutus2.webp" 
                  alt="Floramade Ayurvedic Heritage" 
                  fill 
                  priority
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1F36]/40 via-transparent to-transparent" />
                
                {/* Floating Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#F7F9FC] backdrop-blur-md border border-[#C5D5E8] flex items-center justify-between shadow-lg">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-[#142B49]">Established in Delhi</p>
                    <p className="text-xs font-semibold text-[#1A2332]">Pure Botanical Wellness</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#F7F9FC] text-[#142B49] flex items-center justify-center shrink-0">
                    <Leaf size={18} />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Story Content */}
            <motion.div {...fadeUp} className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#142B49]">
                  <Globe size={14} />
                  <span>The Floramade Story</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#1A2332] tracking-tight leading-snug">
                  Harmonizing the Five Sacred Elements of Nature
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#1A2332]/80 leading-relaxed font-normal">
                <p>
                  At <strong>Floramade</strong>, our formulations are deeply anchored in the timeless Ayurvedic doctrine of the <em>Pancha Mahabhutas</em>—Akasha (Space), Vayu (Air), Agni (Fire), Jala (Water), and Prithvi (Earth). When these primordial forces fall into disharmony, fatigue and chronic ailments begin to take hold.
                </p>
                <p>
                  Founded by <strong>Suraj Gaur</strong>, Floramade was established to dispel the confusion of mass-produced, chemically laden supplements. We believe true healing requires patience, purity, and clinical precision. By utilizing traditional extraction methods alongside modern quality benchmarks, we preserve the full bio-active matrix of every medicinal root, leaf, and seed.
                </p>
              </div>

              {/* Quote Card */}
              <div className="p-5 rounded-2xl bg-[#F7F9FC] border border-[#C5D5E8] shadow-2xs space-y-2 relative overflow-hidden">
                <Quote size={28} className="text-[#142B49]/20 absolute right-4 top-4" />
                <p className="text-xs sm:text-sm text-[#1A2332] font-serif italic leading-relaxed">
                  &ldquo;Ayurveda is not simply an ancient remedy; it is the living art of bringing the human constitution into seamless balance with nature.&rdquo;
                </p>
                <p className="text-[11px] font-bold text-[#142B49] uppercase tracking-wider">
                  — The Floramade Guiding Principle
                </p>
              </div>
            </motion.div>

          </div>
        </section>


        {/* --- 3. FOUNDER SPOTLIGHT (Authentic & Trustworthy) --- */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 my-12 md:my-16">
          <motion.div 
            {...fadeUp}
            className="rounded-3xl bg-[#F7F9FC] border border-[#C5D5E8] shadow-xs p-6 sm:p-10 md:p-12 relative overflow-hidden space-y-6"
          >
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#142B49]/10 text-[#142B49] text-[10px] font-bold uppercase tracking-wider">
                <Building2 size={12} />
                <span>Founder's Vision</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-light text-[#1A2332] tracking-tight">
                A Personal Word from Our Founder
              </h2>

              <p className="text-xs sm:text-sm text-[#1A2332]/80 leading-relaxed">
                &ldquo;Having witnessed how modern lifestyles, high stress, and processed diets have disrupted natural vitality, I felt a deep responsibility to make genuine, unadulterated Ayurvedic health solutions accessible to every household. Floramade is dedicated to zero compromises—every bottle delivers the exact herbal purity and therapeutic potency we would trust for our own families.&rdquo;
              </p>
            </div>

            {/* Signature & Credentials Strip */}
            <div className="pt-4 border-t border-[#C5D5E8]/60 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#142B49]/10 text-[#142B49] font-serif font-bold text-lg flex items-center justify-center shrink-0">
                  SG
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1A2332]">Suraj Gaur</h4>
                  <p className="text-[11px] text-[#142B49] font-medium">Founder & Visionary, Floramade Healthcare</p>
                </div>
              </div>
              <div className="text-right text-[11px] text-[#1A2332]/60 hidden sm:block">
                <span>Rohini, New Delhi • India</span>
              </div>
            </div>
          </motion.div>
        </section>


        {/* --- 4. OUR PILLARS OF EXCELLENCE (4 Clean Cards) --- */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-light text-[#1A2332] tracking-tight">
              Why Discerning Wellness Seekers Choose Us
            </h2>
            <p className="text-xs sm:text-sm text-[#1A2332]/70 font-normal">
              Four fundamental pillars that distinguish Floramade from generic market supplements.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={idx}
                  {...fadeUp}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="p-6 rounded-2xl bg-[#F7F9FC] border border-[#C5D5E8] shadow-2xs hover:shadow-md hover:border-[#142B49]/40 transition-all duration-300 space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F7F9FC] text-[#142B49] border border-[#C5D5E8] flex items-center justify-center group-hover:bg-[#142B49] group-hover:text-white transition-colors duration-300">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-bold text-sm text-[#1A2332] tracking-tight pt-1">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#1A2332]/75 leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>


        {/* --- 5. CERTIFIED TRUST & STANDARDS --- */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div 
            {...fadeUp}
            className="rounded-3xl bg-[#F7F9FC] border border-[#C5D5E8] p-8 sm:p-12 space-y-8"
          >
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#142B49]">
                Accreditation & Safety
              </span>
              <h2 className="text-2xl sm:text-3xl font-light text-[#1A2332] tracking-tight">
                Certified by Years of Unbroken Trust
              </h2>
              <p className="text-xs text-[#1A2332]/70">
                Rigorous multi-stage quality control from farm harvest to your medicine cabinet.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {certificates.map((cert) => (
                <div 
                  key={cert.id}
                  className="p-5 rounded-2xl bg-[#F7F9FC] border border-[#C5D5E8]/80 shadow-2xs text-center space-y-3 hover:border-[#142B49]/30 transition-all duration-300"
                >
                  <div className="w-14 h-14 mx-auto relative">
                    <Image 
                      src={`/certificate/${cert.id}.svg`} 
                      alt={cert.title} 
                      fill 
                      className="object-contain" 
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1A2332]">{cert.title}</h4>
                    <p className="text-[11px] text-[#1A2332]/60 pt-0.5">{cert.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>


        {/* --- 6. CTA BANNER --- */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
          <motion.div 
            {...fadeUp}
            className="rounded-3xl bg-[#142B49] text-white p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-xl"
          >
            <div className="relative z-10 max-w-xl mx-auto space-y-3">
              <span className="inline-block px-3 py-1 rounded-full bg-[#F7F9FC] text-[#D9A441] text-[10px] font-bold uppercase tracking-wider">
                Begin Your Wellness Ritual
              </span>
              <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-white">
                Experience Authentic Ayurvedic Healing
              </h2>
              <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                Discover formulations designed for blood sugar management, digestive wellness, and holistic daily vitality.
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link 
                href="/collection" 
                className="px-6 py-3 rounded-full bg-[#D9A441] hover:bg-[#C48F2E] text-[#1A2332] text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md inline-flex items-center gap-2 group"
              >
                <span>Explore Products</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <a 
                href="tel:+919220251059" 
                className="px-6 py-3 rounded-full bg-[#F7F9FC] hover:bg-[#F7F9FC] text-white border border-white/20 text-xs font-bold uppercase tracking-wider transition-all duration-300 inline-flex items-center gap-2"
              >
                <Phone size={13} />
                <span>Talk to Expert</span>
              </a>
            </div>
          </motion.div>
        </section>

      </div>
    </PageTransition>
  );
}

