import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative bg-[#39160D] text-[#FFF7EB] overflow-hidden pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-16 mt-16 md:mt-24 lg:mt-32 border-t border-[#4A1E13]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 mb-16 md:mb-20 lg:mb-24">
          
          <div className="md:col-span-5 space-y-6 md:space-y-8">
            <div className="flex items-center justify-start">
              <Link href="/" className="inline-block group focus:outline-none">
                <Image 
                  src="/logo.png" 
                  alt="Floramade Logo" 
                  width={140} 
                  height={140} 
                  className="h-16 sm:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
                />
              </Link>
            </div>
            <p className="text-xs sm:text-sm text-[#FFF7EB]/70 font-light leading-relaxed max-w-md">
              Premium Ayurvedic wellness inspired by the five natural elements. Formulated with authentic botanical extracts for balanced health and vitality.
            </p>
            <div className="flex gap-2.5 md:gap-3 pt-2">
              <a 
                href="https://www.instagram.com/floramadeofficial/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="h-10 w-10 md:h-11 md:w-11 rounded-full border border-[#FFF7EB]/20 flex items-center justify-center hover:bg-[#FFF7EB] hover:text-[#39160D] hover:border-[#FFF7EB] transition-all duration-300"
                aria-label="Instagram"
              >
                <FaInstagram size={15} />
              </a>
              <a 
                href="https://www.facebook.com/share/1HuEXx3gQh/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="h-10 w-10 md:h-11 md:w-11 rounded-full border border-[#FFF7EB]/20 flex items-center justify-center hover:bg-[#FFF7EB] hover:text-[#39160D] hover:border-[#FFF7EB] transition-all duration-300"
                aria-label="Facebook"
              >
                <FaFacebookF size={13} />
              </a>
              <a 
                href="https://wa.me/919220251059" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="h-10 w-10 md:h-11 md:w-11 rounded-full border border-[#FFF7EB]/20 flex items-center justify-center hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all duration-300"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={16} />
              </a>
              <a 
                href="mailto:floramade517@gmail.com" 
                className="h-10 w-10 md:h-11 md:w-11 rounded-full border border-[#FFF7EB]/20 flex items-center justify-center hover:bg-[#FFF7EB] hover:text-[#39160D] hover:border-[#FFF7EB] transition-all duration-300"
                aria-label="Email"
              >
                <Mail size={15} strokeWidth={1.75} />
              </a>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4 md:space-y-6">
            <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-[#DFC77F]">Explore</p>
            <ul className="flex flex-col gap-3 md:gap-4 text-xs sm:text-sm font-light text-[#FFF7EB]/75">
              <li><Link href="/" className="hover:text-[#DFC77F] transition-colors duration-300 inline-flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-[#DFC77F] transition-all duration-300"></span>Home</Link></li>
              <li><Link href="/collection" className="hover:text-[#DFC77F] transition-colors duration-300 inline-flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-[#DFC77F] transition-all duration-300"></span>All Products</Link></li>
              <li><Link href="/about" className="hover:text-[#DFC77F] transition-colors duration-300 inline-flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-[#DFC77F] transition-all duration-300"></span>About Our Founder</Link></li>
              <li><Link href="/contact" className="hover:text-[#DFC77F] transition-colors duration-300 inline-flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-[#DFC77F] transition-all duration-300"></span>Contact Us</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-4 md:space-y-6">
            <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-[#DFC77F]">Policies</p>
            <ul className="flex flex-col gap-3 md:gap-4 text-xs sm:text-sm font-light text-[#FFF7EB]/75">
              <li><Link href="/terms" className="hover:text-[#DFC77F] transition-colors duration-300 inline-flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-[#DFC77F] transition-all duration-300"></span>Terms & Conditions</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-[#DFC77F] transition-colors duration-300 inline-flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-[#DFC77F] transition-all duration-300"></span>Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-[#DFC77F] transition-colors duration-300 inline-flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-[#DFC77F] transition-all duration-300"></span>Refund Policy</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-[#DFC77F] transition-colors duration-300 inline-flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-[#DFC77F] transition-all duration-300"></span>Shipping Policy</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-4 md:space-y-6">
            <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-[#DFC77F]">Customer Help</p>
            <div className="space-y-3 md:space-y-4">
              <div>
                <p className="text-xs sm:text-sm font-medium text-[#FFF7EB] mb-1">Email</p>
                <a href="mailto:floramade517@gmail.com" className="text-xs sm:text-sm text-[#FFF7EB]/75 font-light hover:text-[#DFC77F] transition-colors duration-300">floramade517@gmail.com</a>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-[#FFF7EB] mb-1">Phone Helpline</p>
                <a href="tel:+919220251059" className="text-xs sm:text-sm text-[#FFF7EB]/75 font-light hover:text-[#DFC77F] transition-colors duration-300">+91 9220251059</a>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-[#FFF7EB] mb-1">Location</p>
                <p className="text-xs sm:text-sm text-[#FFF7EB]/75 font-light">Floramade, Delhi, India</p>
              </div>
              <div className="pt-1">
                <p className="text-xs sm:text-sm font-medium text-[#FFF7EB] mb-1">Timings</p>
                <p className="text-[10px] sm:text-xs text-[#FFF7EB]/60 font-light uppercase tracking-wider">Mon - Sat: 10:00 AM - 06:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-[#FFF7EB]/15">
          <p className="text-xs text-[#FFF7EB]/60 font-light">
            © {new Date().getFullYear()} Floramade Ayurveda. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="h-[1px] w-8 bg-[#FFF7EB]/20" />
            <p className="text-xs text-[#DFC77F] font-light uppercase tracking-[0.12em]">
              Balanced Health, Limitless Living
            </p>
            <div className="h-[1px] w-8 bg-[#FFF7EB]/20" />
          </div>
          <p className="text-xs text-[#FFF7EB]/60 font-light">
            Pure Ayurvedic Formulations
          </p>
        </div>
        
      </div>
    </footer>
  );
}
