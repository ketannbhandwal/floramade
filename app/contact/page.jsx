"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  HelpCircle,
  Loader2,
  Check
} from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import DoctorConsultationModal from "@/components/ui/DoctorConsultationModal";
import toast from "react-hot-toast";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
};

export default function ContactPage() {
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    type: "general",
    message: ""
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error("Please enter your name and phone number");
      return;
    }

    if (formData.phone.replace(/\D/g, "").length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    if (formData.message && formData.message.trim().length > 0 && formData.message.trim().length < 10) {
      toast.error("Please write at least 10 characters in your message");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || undefined,
          type: formData.type,
          message: formData.message.trim() || "Customer reached out through Contact Us page."
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send inquiry");
      }

      setSubmitted(true);
      toast.success("Message received! Our team will contact you shortly.");
      setFormData({
        name: "",
        phone: "",
        email: "",
        type: "general",
        message: ""
      });
    } catch (err) {
      toast.error(err.message || "Failed to submit. Please call or WhatsApp us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8F4E9] text-[#171717] font-sans pb-20 selection:bg-[#101D17] selection:text-white">
        
        {/* --- 1. HERO HEADER --- */}
        <section className="px-4 sm:px-6 pt-6 pb-8 md:pt-10 md:pb-12 text-center max-w-4xl mx-auto space-y-4">
          <motion.div {...fadeUp} className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#101D17]/10 text-[#101D17] text-[11px] font-bold uppercase tracking-wider">
              <Sparkles size={13} />
              <span>We&apos;re Here to Support You</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#171717] leading-[1.15]">
              Connect with Our <br className="hidden sm:inline" />
              <span className="font-serif italic text-[#101D17] font-normal">Wellness Practitioners</span>
            </h1>

            <p className="text-xs sm:text-base text-[#171717]/75 max-w-2xl mx-auto leading-relaxed font-normal">
              Have questions regarding our formulations, order dispatch, or personalized Ayurvedic guidance? Our team in Delhi is always ready to assist you.
            </p>
          </motion.div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 md:space-y-12">
          
          {/* --- 2. THREE QUICK DIRECT CHANNELS --- */}
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Phone Card */}
            <motion.a
              href="tel:+919220251059"
              {...fadeUp}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-white border border-[#E0D9C8] shadow-2xs hover:border-[#101D17]/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#101D17]/10 text-[#101D17] flex items-center justify-center transition-colors group-hover:bg-[#101D17] group-hover:text-white">
                  <Phone size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#101D17]">Helpline Phone</span>
                  <h3 className="text-lg font-bold text-[#171717] tracking-tight pt-0.5">+91 9220251059</h3>
                  <p className="text-xs text-[#171717]/65 pt-1">Mon–Sat: 10:00 AM – 7:00 PM IST</p>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-[#E0D9C8]/50 flex items-center gap-1.5 text-xs font-semibold text-[#101D17] group-hover:gap-2.5 transition-all">
                <span>Call Now</span>
                <ArrowRight size={14} />
              </div>
            </motion.a>

            {/* WhatsApp Card */}
            <motion.a
              href="https://wa.me/919220251059?text=Hello%20Floramade%20Team%2C%20I%20have%20an%20inquiry%20regarding%20your%20Ayurvedic%20products."
              target="_blank"
              rel="noopener noreferrer"
              {...fadeUp}
              transition={{ delay: 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-white border border-[#E0D9C8] shadow-2xs hover:border-[#25D366]/60 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center transition-colors group-hover:bg-[#25D366] group-hover:text-white">
                  <MessageSquare size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#25D366]">Instant Chat</span>
                  <h3 className="text-lg font-bold text-[#171717] tracking-tight pt-0.5">WhatsApp Support</h3>
                  <p className="text-xs text-[#171717]/65 pt-1">Quick responses within 15 mins</p>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-[#E0D9C8]/50 flex items-center gap-1.5 text-xs font-semibold text-[#25D366] group-hover:gap-2.5 transition-all">
                <span>Start WhatsApp Chat</span>
                <ArrowRight size={14} />
              </div>
            </motion.a>

            {/* Email Card */}
            <motion.a
              href="mailto:floramade517@gmail.com"
              {...fadeUp}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-white border border-[#E0D9C8] shadow-2xs hover:border-[#101D17]/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#101D17]/10 text-[#101D17] flex items-center justify-center transition-colors group-hover:bg-[#101D17] group-hover:text-white">
                  <Mail size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#101D17]">Email Inquiries</span>
                  <h3 className="text-base font-bold text-[#171717] tracking-tight pt-0.5 truncate">floramade517@gmail.com</h3>
                  <p className="text-xs text-[#171717]/65 pt-1">Response within 24 hours</p>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-[#E0D9C8]/50 flex items-center gap-1.5 text-xs font-semibold text-[#101D17] group-hover:gap-2.5 transition-all">
                <span>Send Email</span>
                <ArrowRight size={14} />
              </div>
            </motion.a>

          </div>


          {/* --- 3. MAIN SECTION: FORM (LEFT) + OFFICE & APPOINTMENT (RIGHT) --- */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left: Interactive Inquiry Form */}
            <motion.div 
              {...fadeUp}
              className="lg:col-span-7 bg-[#F8F4E9] rounded-3xl border border-[#E0D9C8] shadow-xs p-6 sm:p-10 space-y-6"
            >
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#101D17]">Direct Message</span>
                <h2 className="text-2xl sm:text-3xl font-light text-[#171717] tracking-tight">
                  Send Us an Inquiry
                </h2>
                <p className="text-xs text-[#171717]/70 font-normal">
                  Fill in your details and our Ayurvedic advisors will get back to you with personalized assistance.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-[#2E7D32]/5 border border-[#2E7D32]/20 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-base font-bold text-[#2E7D32]">Thank You!</h3>
                  <p className="text-xs text-[#171717]/80 leading-relaxed max-w-md mx-auto">
                    Your inquiry has been successfully registered. One of our counselors will contact you via WhatsApp or phone.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-semibold text-[#101D17] underline pt-2"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#171717]">
                        Your Full Name <span className="text-[#101D17]">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E0D9C8] bg-[#F8F4E9]/50 text-xs text-[#171717] placeholder:text-[#171717]/40 focus:outline-none focus:border-[#101D17] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#171717]">
                        Phone / WhatsApp <span className="text-[#101D17]">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="e.g. 9876543210"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E0D9C8] bg-[#F8F4E9]/50 text-xs text-[#171717] placeholder:text-[#171717]/40 focus:outline-none focus:border-[#101D17] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#171717]">
                        Email Address <span className="text-[#171717]/40 text-[11px] font-normal">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. ramesh@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E0D9C8] bg-[#F8F4E9]/50 text-xs text-[#171717] placeholder:text-[#171717]/40 focus:outline-none focus:border-[#101D17] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#171717]">
                        Topic / Category
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E0D9C8] bg-[#F8F4E9]/50 text-xs text-[#171717] focus:outline-none focus:border-[#101D17] focus:bg-white transition-all"
                      >
                        <option value="general">Product Inquiry</option>
                        <option value="consultation">Ayurvedic Health Consultation</option>
                        <option value="order_help">Order Tracking & Delivery</option>
                        <option value="wholesale">Wholesale & Partnership</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#171717]">
                      Your Message or Health Concern
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your questions or requirements..."
                      className="w-full px-4 py-3 rounded-xl border border-[#E0D9C8] bg-[#F8F4E9]/50 text-xs text-[#171717] placeholder:text-[#171717]/40 focus:outline-none focus:border-[#101D17] focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#101D17] hover:bg-[#071E12] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md inline-flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>


            {/* Right Column: Office Location & Free Doctor Assessment Card */}
            <motion.div {...fadeUp} className="lg:col-span-5 space-y-6">
              
              {/* Registered Office & Dispatch Center Card */}
              <div className="rounded-3xl bg-[#F8F4E9] border border-[#E0D9C8] shadow-xs p-6 sm:p-8 space-y-5">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#101D17]">
                    Registered Office & Dispatch
                  </span>
                  <h3 className="text-lg font-bold text-[#171717] tracking-tight flex items-center gap-2">
                    <Building2 size={18} className="text-[#101D17]" />
                    <span>Floramade Healthcare Pvt. Ltd.</span>
                  </h3>
                </div>

                <div className="space-y-3 text-xs text-[#171717]/80">
                  <div className="flex items-start gap-2.5">
                    <MapPin size={16} className="text-[#101D17] shrink-0 mt-0.5" />
                    <span>Rohini Sector 21, New Delhi - 110086, India</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Clock size={16} className="text-[#101D17] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#171717]">Operating Hours:</p>
                      <p className="text-[#171717]/70">Monday to Saturday: 10:00 AM – 7:00 PM IST</p>
                      <p className="text-[#171717]/50 text-[11px]">(Closed on Sundays & National Holidays)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <ShieldCheck size={16} className="text-[#101D17] shrink-0 mt-0.5" />
                    <span>Ayurvedic Formulations & Dispatch Center</span>
                  </div>
                </div>
              </div>


              {/* Doctor Consultation Banner Card */}
              <div className="rounded-3xl bg-[#101D17] text-white p-6 sm:p-8 space-y-4 shadow-lg relative overflow-hidden">
                <div className="space-y-2 relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[#D4AF55] text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles size={11} />
                    <span>Free Health Guidance</span>
                  </div>
                  <h3 className="text-xl font-light text-white tracking-tight">
                    Consult an Ayurvedic Counselor
                  </h3>
                  <p className="text-xs text-white/75 leading-relaxed">
                    Have queries regarding diabetes management, metabolic balance, or digestive health? Connect directly with our certified practitioners.
                  </p>
                </div>

                <div className="pt-1 relative z-10">
                  <button
                    type="button"
                    onClick={() => setConsultationOpen(true)}
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#D4AF55] hover:bg-[#B8923A] text-[#171717] text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Book Consultation</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>


              {/* Trust Micro-Points */}
              <div className="p-4 rounded-2xl bg-[#F8F4E9] border border-[#E0D9C8] space-y-2 text-xs">
                <p className="font-bold text-[#171717] text-xs">Our Commitment to You:</p>
                <div className="space-y-1.5 text-[11px] text-[#171717]/75">
                  <div className="flex items-center gap-2">
                    <Check size={13} className="text-[#101D17]" />
                    <span>100% confidential and secure medical privacy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={13} className="text-[#101D17]" />
                    <span>Genuine, lab-tested classical Ayurvedic advice</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={13} className="text-[#101D17]" />
                    <span>Zero spam, zero unwanted promotional calls</span>
                  </div>
                </div>
              </div>

            </motion.div>

          </div>

        </div>

        {/* Modal */}
        <DoctorConsultationModal 
          isOpen={consultationOpen} 
          onClose={() => setConsultationOpen(false)} 
        />
      </div>
    </PageTransition>
  );
}
