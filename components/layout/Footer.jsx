import Link from "next/link";
import { Mail } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative bg-muted/30 text-foreground overflow-hidden pt-24 pb-16 mt-32 border-t border-border/50">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 relative z-10">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 mb-24">
          
          <div className="md:col-span-5 space-y-8">
            <Image src="/assets/logo.png" alt="Fiveetatva Logo" width={192} height={48} />
            <p className="text-sm text-foreground/60 font-light leading-relaxed max-w-md">
              Premium Ayurvedic wellness inspired by the five natural elements. Crafted with intention for balanced living.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="h-11 w-11 rounded-full border border-border/50 flex items-center justify-center hover:bg-accent hover:text-background hover:border-accent transition-all duration-500 group">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform duration-300">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="h-11 w-11 rounded-full border border-border/50 flex items-center justify-center hover:bg-accent hover:text-background hover:border-accent transition-all duration-500 group">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform duration-300">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="h-11 w-11 rounded-full border border-border/50 flex items-center justify-center hover:bg-accent hover:text-background hover:border-accent transition-all duration-500 group">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform duration-300">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="mailto:care@fiveetatva.com" className="h-11 w-11 rounded-full border border-border/50 flex items-center justify-center hover:bg-accent hover:text-background hover:border-accent transition-all duration-500 group">
                <Mail size={16} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-300" />
              </a>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <p className="text-[10px] uppercase tracking-[0.1em] font-light text-foreground/40">Explore</p>
            <ul className="flex flex-col gap-4 text-sm font-light text-foreground/60">
              <li><Link href="/" className="hover:text-accent transition-colors duration-500 inline-flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-accent transition-all duration-300"></span>Home</Link></li>
              <li><Link href="/#products" className="hover:text-accent transition-colors duration-500 inline-flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-accent transition-all duration-300"></span>Collection</Link></li>
              <li><Link href="/about" className="hover:text-accent transition-colors duration-500 inline-flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-accent transition-all duration-300"></span>Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors duration-500 inline-flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-accent transition-all duration-300"></span>Contact</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-6">
            <p className="text-[10px] uppercase tracking-[0.1em] font-light text-foreground/40">Legal</p>
            <ul className="flex flex-col gap-4 text-sm font-light text-foreground/60">
              <li><a href="/terms/Privacypolicy.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors duration-500 inline-flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-accent transition-all duration-300"></span>Privacy Policy</a></li>
              <li><a href="/terms/Terms and Conditions.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors duration-500 inline-flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-accent transition-all duration-300"></span>Terms of Service</a></li>
              <li><a href="/terms/Refund policy.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors duration-500 inline-flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-accent transition-all duration-300"></span>Refund Policy</a></li>
              <li><a href="/terms/shipping and cancellation.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors duration-500 inline-flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-accent transition-all duration-300"></span>Shipping Policy</a></li>
            </ul>
          </div>
          
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-border/50">
          <p className="text-xs text-foreground/40 font-light">
            © {new Date().getFullYear()} Fiveetatva Ayurveda. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="h-[1px] w-8 bg-foreground/20" />
            <p className="text-xs text-foreground/40 font-light uppercase tracking-[0.1em]">
              Balanced Health, Limitless Living
            </p>
            <div className="h-[1px] w-8 bg-foreground/20" />
          </div>
        </div>
        
      </div>
    </footer>
  );
}
