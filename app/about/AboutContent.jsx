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
  Users,
  FlaskConical, 
  HeartHandshake, 
  Check, 
  Truck,
  Building2
} from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
};

const trustMetrics = [
  {
    icon: Leaf,
    title: "100% Natural",
    subtitle: "Pure Botanical Extracts"
  },
  {
    icon: ShieldCheck,
    title: "Zero Side-Effects",
    subtitle: "Chemical & Heavy Metal Free"
  },
  {
    icon: FlaskConical,
    title: "Clinically Tested",
    subtitle: "Standardized Lab Verifications"
  },
  {
    icon: Users,
    title: "50,000+ Seekers",
    subtitle: "Trusted Families Across India"
  }
];

export default function AboutContent() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F7F9FC] text-[#1A2332] font-sans pb-20 selection:bg-[#142B49] selection:text-white">
        
        {/* =========================================================================
            1. HERO TITLE & INTRO
            ========================================================================= */}
        <section className="px-4 sm:px-6 pt-10 pb-8 md:pt-14 md:pb-10 text-center max-w-4xl mx-auto space-y-4">
          <motion.div {...fadeUp} className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#142B49]/10 text-[#142B49] text-[11px] font-bold uppercase tracking-wider">
              <Sparkles size={13} />
              <span>Authentic Ayurvedic Heritage</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#142B49] leading-tight">
              About Floramade
            </h1>

            <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-[#D9A441]">
              Floramade: Nurturing Wellness, Naturally
            </p>

            <p className="text-xs sm:text-base text-[#1A2332]/80 max-w-2xl mx-auto leading-relaxed font-normal pt-1">
              Welcome to Floramade, your trusted partner on the journey to holistic well-being. Born out of a passion for harnessing the ancient wisdom of Ayurveda and the power of herbal supplements, Floramade stands tall as the beacon of authenticity and purity in the realm of wellness.
            </p>
          </motion.div>
        </section>

        {/* =========================================================================
            2. OUR COMMITMENT TO PURITY + DOCTOR BANNER
            ========================================================================= */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-5">
          <motion.div {...fadeUp} className="space-y-2">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#142B49] tracking-tight">
              Our Commitment to Purity:
            </h2>
          </motion.div>

          {/* Banner 1: Doctor Tested & Recommended */}
          <motion.div 
            {...fadeUp}
            className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[#C5D5E8]/80 shadow-sm bg-white"
          >
            <Image
              src="/assets/doctor-navy-banner.jpg"
              alt="Floramade 100% Organic & Safe - Recommended by Doctors - Honest Ayurveda Brand"
              width={2734}
              height={1226}
              unoptimized
              priority
              className="w-full h-auto object-contain select-none"
            />
          </motion.div>

          <motion.p {...fadeUp} className="text-xs sm:text-sm md:text-[15px] text-[#1A2332]/80 leading-relaxed font-normal pt-2">
            At Floramade, we believe that the foundation of a healthy life lies in the purity of what we consume. Every product in our expansive range is a testament to our unwavering commitment to authenticity. Our ayurvedic and herbal supplements are 100% genuine, pure, and organic, sourced from the lap of nature and crafted with meticulous care.
          </motion.p>
        </section>

        {/* =========================================================================
            3. QUALITY ASSURANCE + 4 TRUST BADGES
            ========================================================================= */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-10 space-y-6">
          <motion.div {...fadeUp} className="space-y-2">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#142B49] tracking-tight">
              Quality Assurance:
            </h2>
          </motion.div>

          {/* 4 Trust Metric Cards (Matching the reference layout) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {trustMetrics.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  {...fadeUp}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-[#C5D5E8]/80 shadow-2xs hover:shadow-md hover:border-[#142B49]/40 transition-all text-center flex flex-col items-center justify-center space-y-2 group"
                >
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#F7F9FC] text-[#142B49] border border-[#C5D5E8] flex items-center justify-center group-hover:bg-[#142B49] group-hover:text-white transition-colors duration-300">
                    <Icon size={22} strokeWidth={2} />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#142B49] tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-[#1A2332]/60 leading-tight">
                    {item.subtitle}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <motion.p {...fadeUp} className="text-xs sm:text-sm md:text-[15px] text-[#1A2332]/80 leading-relaxed font-normal pt-1">
            We understand the importance of trust when it comes to your well-being. That&apos;s why each Floramade product undergoes rigorous testing and is approved by renowned experts in the field. Our dedication to quality assurance ensures that you receive nothing but the finest, most effective formulations that nature has to offer.
          </motion.p>
        </section>

        {/* =========================================================================
            4. HARNESSING THE POWER OF AYURVEDA + CHOOSE PURE BANNER
            ========================================================================= */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-5">
          <motion.div {...fadeUp} className="space-y-2">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#142B49] tracking-tight">
              Harnessing the Power of Ayurveda:
            </h2>
          </motion.div>

          {/* Banner 2: Choose Pure Choose Ayurveda */}
          <motion.div 
            {...fadeUp}
            className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[#C5D5E8]/80 shadow-sm bg-white"
          >
            <Image
              src="/assets/choose-pure-ayurveda-banner.jpg"
              alt="Floramade - Choose Pure Choose Ayurveda"
              width={1024}
              height={242}
              unoptimized
              className="w-full h-auto object-contain select-none"
            />
          </motion.div>

          <motion.p {...fadeUp} className="text-xs sm:text-sm md:text-[15px] text-[#1A2332]/80 leading-relaxed font-normal pt-2">
            Ayurveda, the ancient science of life, serves as our guiding light. Floramade integrates the timeless principles of Ayurveda into modern living, offering a harmonious blend of tradition and innovation. Our products are carefully curated to address a spectrum of health needs, promoting balance, vitality, and longevity.
          </motion.p>
        </section>

        {/* =========================================================================
            5. YOUR WELLNESS & WELLNESS PARTNER
            ========================================================================= */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
          <motion.div {...fadeUp} className="space-y-2">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#142B49] tracking-tight">
              Your Wellness, Our Priority:
            </h2>
            <p className="text-xs sm:text-sm md:text-[15px] text-[#1A2332]/80 leading-relaxed font-normal">
              Floramade isn&apos;t just a brand; it&apos;s a lifestyle that champions your well-being. We take pride in being the go-to choice for individuals across India and beyond. Our growing community trusts Floramade to deliver not just products but a promise—a promise of a healthier, more vibrant life.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="space-y-2 pt-2">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#142B49] tracking-tight">
              More than a Brand: A Wellness Partner:
            </h2>
            <p className="text-xs sm:text-sm md:text-[15px] text-[#1A2332]/80 leading-relaxed font-normal">
              We go beyond being a mere purveyor of products; we aspire to be your wellness partner. Floramade is a community that shares your commitment to a healthier, more natural way of living. Join us on this transformative journey, where every product is a step towards a more balanced, energized, and vibrant you.
            </p>
          </motion.div>
        </section>

        {/* =========================================================================
            6. BANNER 3: ENRICHED WITH GOODNESS OF NATURE
            ========================================================================= */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-4 md:py-6">
          <motion.div 
            {...fadeUp}
            className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[#C5D5E8]/80 shadow-sm bg-white"
          >
            <Image
              src="/assets/nature-centered-banner.jpg"
              alt="Floramade - Enriched With Goodness Of Nature"
              width={1024}
              height={349}
              unoptimized
              className="w-full h-auto object-contain select-none"
            />
          </motion.div>
        </section>

        {/* =========================================================================
            7. FOUNDER SPOTLIGHT: SURAJ GAUR
            ========================================================================= */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8">
          <motion.div 
            {...fadeUp}
            className="rounded-3xl bg-white border border-[#C5D5E8]/90 shadow-xs p-6 sm:p-8 md:p-10 space-y-5"
          >
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#142B49]/10 text-[#142B49] text-[10px] font-bold uppercase tracking-wider">
                <Building2 size={12} />
                <span>Founder&apos;s Vision</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#142B49] tracking-tight">
                A Personal Word from Our Founder
              </h2>

              <p className="text-xs sm:text-sm text-[#1A2332]/80 leading-relaxed font-normal">
                &ldquo;Having witnessed how modern lifestyles, high stress, and processed diets have disrupted natural vitality, I felt a deep responsibility to make genuine, unadulterated Ayurvedic health solutions accessible to every household. Floramade is dedicated to zero compromises—every bottle delivers the exact herbal purity and therapeutic potency we would trust for our own families.&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-[#C5D5E8]/60 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#142B49] text-[#D9A441] font-serif font-bold text-lg flex items-center justify-center shrink-0 shadow-xs">
                  SG
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1A2332]">Suraj Gaur</h4>
                  <p className="text-[11px] text-[#142B49] font-medium">Founder &amp; Visionary, Floramade Healthcare</p>
                </div>
              </div>
              <div className="text-right text-[11px] text-[#1A2332]/60 hidden sm:block">
                <span>Rohini, New Delhi • India</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* =========================================================================
            8. FINAL CLOSING CALLOUT & NATIONWIDE DELIVERY
            ========================================================================= */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8 text-center space-y-6">
          <motion.div {...fadeUp} className="space-y-3">
            <p className="text-xs sm:text-sm md:text-[15px] font-semibold text-[#142B49] leading-relaxed">
              Choose Floramade—where nature meets nurture, and well-being is a way of life. Embark on a journey to vitality with the leaders in organic and ayurvedic excellence.
            </p>
            <p className="text-xs sm:text-sm text-[#1A2332]/75 leading-relaxed flex items-center justify-center gap-2">
              <Truck size={15} className="text-[#142B49] shrink-0" />
              <span>You can place your order from any corner of India, and we will deliver your order to your doorstep, wherever you are across India.</span>
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="pt-2">
            <Link
              href="/collection"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#142B49] hover:bg-[#0E1F36] text-white font-bold text-xs sm:text-sm tracking-tight transition-all duration-200 shadow-md hover:shadow-lg hover:scale-102 active:scale-98"
            >
              <span>Explore Complete Collection</span>
              <ArrowRight size={15} />
            </Link>
          </motion.div>
        </section>

      </div>
    </PageTransition>
  );
}
