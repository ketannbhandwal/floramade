"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { 
  Menu, 
  ShoppingBag, 
  UserRound, 
  X, 
  Search, 
  LayoutDashboard, 
  Heart, 
  ChevronDown, 
  LogOut, 
  Phone, 
  Mail,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import Image from "next/image";
import { DEFAULT_NAV_LINKS, DEFAULT_ANNOUNCEMENT } from "@/lib/settings-constants";
import SearchOverlay from "@/components/layout/SearchOverlay";

/* Top Announcement Bar: Floramade Luxury Ayurvedic Theme (#142B49 & #D9A441) */
const AnnouncementBar = ({ announcement = DEFAULT_ANNOUNCEMENT }) => {
  if (announcement?.enabled === false) return null;

  const content = (
    <span className="inline-flex items-center gap-1.5 text-white font-semibold text-[11px] sm:text-xs">
      {announcement.emoji && <span>{announcement.emoji}</span>}
      {announcement.highlight && (
        <span className="text-[#D9A441]">{announcement.highlight}</span>
      )}
      <span>{announcement.text || "Save Up to 20% + Extra Combo OFF!"}</span>
    </span>
  );

  return (
    <div className="bg-[#142B49] text-white py-2 px-3 sm:px-6 md:px-8 lg:px-12 border-b border-[#0E1F36] relative z-[80]">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between text-[11px] sm:text-xs font-medium tracking-tight">
        
        {/* Left: Social Media + Follow us! (Hidden on mobile for clean centered offer) */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-2.5">
          <a 
            href="https://www.facebook.com/share/1HuEXx3gQh/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="h-5 w-5 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center text-white text-[10px]" 
            title="Follow us on Facebook"
            aria-label="Facebook"
          >
            <FaFacebookF size={10} />
          </a>
          <a 
            href="https://www.instagram.com/floramadeofficial/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="h-5 w-5 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center text-white text-[10px]" 
            title="Follow us on Instagram"
            aria-label="Instagram"
          >
            <FaInstagram size={11} />
          </a>
          <span className="text-[11px] sm:text-xs font-medium text-white/90 ml-0.5">Follow us!</span>
        </div>
        
        {/* Center: Offer Banner (Centered on mobile & desktop like Vedabay) */}
        <div className="flex-1 text-center truncate px-2">
          {announcement.link ? (
            <Link href={announcement.link} className="hover:opacity-90 transition-opacity">
              {content}
            </Link>
          ) : (
            content
          )}
        </div>

        {/* Right: Get in touch with us + Call & WhatsApp Icons (Hidden on mobile) */}
        <div className="hidden sm:flex items-center gap-2 text-white/90">
          <span className="text-[11px] sm:text-xs font-medium text-white/80">Get in touch with us</span>
          <div className="flex items-center gap-1.5 ml-1">
            <a 
              href="tel:+919220251059" 
              className="h-5 w-5 rounded-full bg-white/10 hover:bg-white/25 transition-all flex items-center justify-center text-white"
              title="Call helpline: +91 9220251059"
              aria-label="Call Helpline"
            >
              <Phone size={11} />
            </a>
            <a 
              href="https://wa.me/919220251059" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="h-5 w-5 rounded-full bg-white/10 hover:bg-white/25 transition-all flex items-center justify-center text-white"
              title="Chat on WhatsApp"
              aria-label="WhatsApp Support"
            >
              <Mail size={11} />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default function Navbar() {
  const { cartItems = [], total = 0 } = useCart() || {};
  const { wishlistItems = [] } = useWishlist() || {};
  const { user, logout } = useAuth() || {};
  const router = useRouter();

  const [openMenu, setOpenMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [announcement, setAnnouncement] = useState(DEFAULT_ANNOUNCEMENT);
  const [navLinks, setNavLinks] = useState(DEFAULT_NAV_LINKS);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [mobileOpenDropdownId, setMobileOpenDropdownId] = useState(null);
  const dropdownTimeoutRef = useRef(null);

  const handleMouseEnterDropdown = (id) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setOpenDropdownId(id);
  };

  const handleMouseLeaveDropdown = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdownId(null);
    }, 180);
  };

  const [visible, setVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let isSubscribed = true;
    fetch("/api/settings")
      .then(r => r.json())
      .then(data => {
        if (!isSubscribed) return;
        if (data?.announcement) {
          setAnnouncement(data.announcement);
        }
        if (Array.isArray(data?.navLinks) && data.navLinks.length > 0) {
          setNavLinks(data.navLinks);
        }
      })
      .catch(() => {});
    return () => { isSubscribed = false; };
  }, []);

  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const prevScrollY = lastScrollYRef.current;

          const isScrolled = currentScrollY > 15;
          setScrolled(prev => (prev !== isScrolled ? isScrolled : prev));

          const isVisible = !(currentScrollY > prevScrollY && currentScrollY > 140);
          setVisible(prev => (prev !== isVisible ? isVisible : prev));

          lastScrollYRef.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (openMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [openMenu]);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[70] transition-transform duration-300 ${
          visible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <AnnouncementBar announcement={announcement} />

        {/* Floramade Premium Herbal Header: Dark Green #142B49 */}
        <div className={`bg-[#142B49] border-b border-[#0E1F36] transition-all duration-300 ${scrolled ? 'shadow-md shadow-[#142B49]/15' : ''}`}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
            
            {/* =========================================================================
                DESKTOP NAVBAR ROW (lg:flex)
                ========================================================================= */}
            <div className="hidden lg:flex items-center justify-between h-[68px] sm:h-[72px] gap-6">
              
              {/* LEFT: Official Floramade Golden Logo */}
              <div className="flex items-center shrink-0">
                <Link href="/" className="flex items-center focus:outline-none group">
                  <Image
                    src="/floramade-logo-gold.png"
                    alt="Floramade Ayurveda"
                    width={200}
                    height={50}
                    priority
                    className="h-10 sm:h-11 md:h-12 w-auto object-contain cursor-pointer transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </Link>
              </div>

              {/* CENTER: Navigation Links */}
              <nav className="flex items-center justify-center gap-5 xl:gap-8 flex-1">
                {navLinks.map((item, idx) => {
                  const isDropdown = item.type === "dropdown" && Array.isArray(item.subLinks) && item.subLinks.length > 0;
                  const itemId = item.id || `nav-${idx}`;
                  const isOpen = openDropdownId === itemId;

                  if (isDropdown) {
                    return (
                      <div 
                        key={itemId}
                        className="relative py-3 group/nav"
                        onMouseEnter={() => handleMouseEnterDropdown(itemId)}
                        onMouseLeave={handleMouseLeaveDropdown}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenDropdownId(isOpen ? null : itemId)}
                          className={`text-[13.5px] xl:text-[14px] font-semibold tracking-tight flex items-center gap-1.5 transition-colors py-1 cursor-pointer outline-none focus:outline-none focus-visible:outline-none ring-0 select-none ${
                            isOpen ? "text-[#D9A441]" : "text-white/90 hover:text-[#D9A441]"
                          }`}
                        >
                          <span>{item.label}</span>
                          <ChevronDown 
                            size={12} 
                            strokeWidth={2.4}
                            className={`text-[#D9A441] transition-transform duration-200 group-hover/nav:rotate-180 ${isOpen ? 'rotate-180' : ''}`} 
                          />
                        </button>

                        {/* Floating Luxury Ayurvedic Dropdown */}
                        <div 
                          className={`absolute top-full left-0 pt-2 z-[999] min-w-[300px] max-w-[360px] transition-all duration-200 ease-out origin-top-left ${
                            isOpen 
                              ? "opacity-100 visible pointer-events-auto translate-y-0" 
                              : "opacity-0 invisible pointer-events-none -translate-y-1 lg:group-hover/nav:opacity-100 lg:group-hover/nav:visible lg:group-hover/nav:pointer-events-auto lg:group-hover/nav:translate-y-0"
                          }`}
                          onMouseEnter={() => handleMouseEnterDropdown(itemId)}
                          onMouseLeave={handleMouseLeaveDropdown}
                        >
                          <div className="bg-white border border-[#C5D5E8] rounded-2xl shadow-[0_15px_40px_rgba(20,43,73,0.12)] p-2.5 backdrop-blur-xl">
                            {item.subHeading && (
                              <div className="px-3 py-1.5 border-b border-[#142B49]/10 mb-1 flex items-center justify-between">
                                <p className="text-[10px] uppercase tracking-wider font-bold text-[#142B49] flex items-center gap-1.5">
                                  <Sparkles size={11} /> {item.subHeading}
                                </p>
                              </div>
                            )}

                            <div className="space-y-1">
                              {item.subLinks.map((sub, sIdx) => {
                                const isTargetProduct = sub.href?.includes("madhu-diabetes-pro") || sub.href?.includes("madhucurex-diabetes-pro") || sub.label?.toLowerCase().includes("diabetes pro");
                                return (
                                  <Link
                                    key={sub.id || sIdx}
                                    href={sub.href || "/product/madhucurex-diabetes-pro"}
                                    onClick={() => setOpenDropdownId(null)}
                                    className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all group/item ${
                                      isTargetProduct
                                        ? "bg-[#142B49]/10 hover:bg-[#142B49]/20 border border-[#142B49]/25 shadow-xs"
                                        : "hover:bg-[#F7F9FC]/80 border border-transparent"
                                    }`}
                                  >
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="text-[13px] font-bold text-[#1A2332] group-hover/item:text-[#142B49] transition-colors tracking-tight">
                                          {sub.label}
                                        </span>
                                        {sub.badge && (
                                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full tracking-tight ${
                                            isTargetProduct
                                              ? "bg-[#142B49] text-white"
                                              : "bg-[#142B49]/10 text-[#1A2332]"
                                          }`}>
                                            {sub.badge}
                                          </span>
                                        )}
                                      </div>
                                      {sub.description && (
                                        <p className="text-[11px] text-[#1A2332]/70 mt-0.5 leading-snug font-normal line-clamp-1">
                                          {sub.description}
                                        </p>
                                      )}
                                    </div>
                                    <ArrowRight size={12} className="text-[#142B49] opacity-50 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all shrink-0" />
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={itemId}
                      href={item.href || "/"}
                      className="text-[13.5px] xl:text-[14px] font-semibold tracking-tight text-white/90 hover:text-[#D9A441] transition-colors whitespace-nowrap py-3 outline-none focus:outline-none focus-visible:outline-none ring-0 select-none"
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* RIGHT: Action Icons */}
              <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
                {mounted && (user?.role === "admin" || user?.isAdmin) && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D9A441]/20 text-[#D9A441] hover:bg-[#D9A441] hover:text-[#142B49] font-bold text-[10px] uppercase tracking-tight transition-all border border-[#142B49]/20 whitespace-nowrap mr-1 shadow-xs"
                    title="Open Admin Dashboard"
                  >
                    <LayoutDashboard size={12} />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}

                <Link 
                  href={mounted && user ? "/account" : "/login"} 
                  className="p-2 sm:p-2.5 rounded-full text-white/90 hover:text-[#D9A441] hover:bg-[#142B49]/5 transition-all focus:outline-none"
                  title={mounted && user ? "My Account" : "Login / Account"}
                  aria-label="User Account"
                >
                  <UserRound size={20} strokeWidth={1.9} />
                </Link>

                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="p-2 sm:p-2.5 rounded-full text-white/90 hover:text-[#D9A441] hover:bg-[#142B49]/5 transition-all focus:outline-none cursor-pointer"
                  title="Search Products"
                  aria-label="Search"
                >
                  <Search size={20} strokeWidth={1.9} />
                </button>

                <Link 
                  href="/wishlist" 
                  className="p-2 sm:p-2.5 rounded-full text-white/90 hover:text-[#D9A441] hover:bg-[#142B49]/5 transition-all relative focus:outline-none hidden sm:inline-flex"
                  title="Wishlist"
                  aria-label="Wishlist"
                >
                  <Heart size={20} strokeWidth={1.9} />
                  {mounted && wishlistItems.length > 0 && (
                    <span className="absolute top-1 right-1 h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center text-[9px] font-bold bg-[#142B49] text-white shadow-xs">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>

                <Link 
                  href="/cart" 
                  className="relative p-2 sm:p-2.5 rounded-full text-white/90 hover:text-[#D9A441] hover:bg-[#142B49]/5 transition-all focus:outline-none group active:scale-95"
                  title="Shopping Cart"
                  aria-label="View Shopping Cart"
                >
                  <ShoppingBag size={21} strokeWidth={1.9} className="group-hover:scale-105 transition-transform" />
                  <span className="absolute top-1 right-0.5 sm:top-1 sm:right-1 h-[17px] min-w-[17px] px-1 rounded-full flex items-center justify-center text-[10px] font-bold bg-[#142B49] text-white shadow-sm ring-2 ring-[#142B49]">
                    {mounted ? cartCount : 0}
                  </span>
                </Link>
              </div>

            </div>

            {/* =========================================================================
                MOBILE NAVBAR ROW (lg:hidden) - EXACT VEDABAY STYLE (IMAGE 2)
                Left: [ ☰  🔍 ]  |  Center: [ Floramade Logo ]  |  Right: [ 🛍️ (badge) ]
                ========================================================================= */}
            <div className="flex lg:hidden items-center justify-between h-[60px] sm:h-[66px] w-full">
              
              {/* LEFT: Hamburger Menu + Search Icon */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setOpenMenu(true)}
                  className="p-1.5 text-white/90 hover:text-[#D9A441] transition-colors focus:outline-none"
                  aria-label="Open Navigation Menu"
                >
                  <Menu size={22} strokeWidth={2.2} />
                </button>

                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="p-1.5 text-white/90 hover:text-[#D9A441] transition-colors focus:outline-none"
                  aria-label="Search"
                >
                  <Search size={20} strokeWidth={2.2} />
                </button>
              </div>

              {/* CENTER: Centered Logo */}
              <div className="flex-1 flex justify-center items-center px-2">
                <Link href="/" className="flex items-center focus:outline-none">
                  <Image
                    src="/floramade-logo-gold.png"
                    alt="Floramade Ayurveda"
                    width={180}
                    height={44}
                    priority
                    className="h-8 sm:h-9 w-auto object-contain cursor-pointer"
                  />
                </Link>
              </div>

              {/* RIGHT: Cart Bag with Counter Badge */}
              <div className="flex items-center justify-end shrink-0">
                <Link 
                  href="/cart" 
                  className="relative p-1.5 text-white/90 hover:text-[#D9A441] transition-colors focus:outline-none active:scale-95"
                  aria-label="View Shopping Cart"
                >
                  <ShoppingBag size={22} strokeWidth={2} />
                  <span className="absolute -top-0.5 -right-1 h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center text-[10px] font-bold bg-[#142B49] text-white shadow-xs">
                    {mounted ? cartCount : 0}
                  </span>
                </Link>
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* Interactive Search Overlay Modal */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* =========================================================================
          MOBILE DRAWER NAVIGATION - EXACT VEDABAY STYLE (IMAGE 3)
          Deep Ayurvedic Brown #0E1F36, Menu Header, '+' Accordion, Contact & Footer
          ========================================================================= */}
      <AnimatePresence>
        {openMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpenMenu(false)}
              className="fixed inset-0 z-[99] bg-black/60 backdrop-blur-xs"
            />

            {/* Sidebar Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 bottom-0 left-0 w-[84vw] max-w-[340px] z-[100] bg-[#142B49] text-white flex flex-col justify-between shadow-2xl overflow-y-auto"
            >
              {/* Scrollable Container */}
              <div className="flex-1 flex flex-col">
                
                {/* 1. Drawer Header: "Menu" + Close "×" */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
                  <span className="text-[17px] font-bold text-white tracking-tight">Menu</span>
                  <button
                    type="button"
                    onClick={() => setOpenMenu(false)}
                    className="p-1 rounded-full text-white/80 hover:text-white transition-colors focus:outline-none"
                    aria-label="Close Menu"
                  >
                    <X size={21} strokeWidth={2.2} />
                  </button>
                </div>

                {/* 2. Primary Navigation Links (with '+' expandable accordion) */}
                <div className="flex flex-col divide-y divide-white/10">
                  {navLinks.map((item, idx) => {
                    const isDropdown = item.type === "dropdown" && Array.isArray(item.subLinks) && item.subLinks.length > 0;
                    const itemId = item.id || `mob-${idx}`;
                    const isMobOpen = mobileOpenDropdownId === itemId;

                    if (isDropdown) {
                      return (
                        <div key={itemId} className="flex flex-col">
                          <button 
                            type="button"
                            onClick={() => setMobileOpenDropdownId(isMobOpen ? null : itemId)} 
                            className="flex items-center justify-between w-full py-3.5 px-5 text-[15px] font-semibold text-white hover:text-[#D9A441] transition-colors focus:outline-none text-left"
                          >
                            <span>{item.label}</span>
                            <span className="text-xl font-light text-white/80 leading-none">
                              {isMobOpen ? "−" : "+"}
                            </span>
                          </button>

                          <AnimatePresence>
                            {isMobOpen && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }} 
                                animate={{ height: 'auto', opacity: 1 }} 
                                exit={{ height: 0, opacity: 0 }} 
                                transition={{ duration: 0.22 }}
                                className="bg-[#0E1F36] px-5 py-2 space-y-2 border-t border-white/5 overflow-hidden"
                              >
                                {item.subLinks.map((sub, sIdx) => (
                                  <Link 
                                    key={sub.id || sIdx}
                                    href={sub.href || "/product/madhucurex-diabetes-pro"} 
                                    onClick={() => setOpenMenu(false)}
                                    className="block py-2 text-sm text-white/90 hover:text-[#D9A441] transition-colors"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{sub.label}</span>
                                      {sub.badge && (
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#142B49] text-white">
                                          {sub.badge}
                                        </span>
                                      )}
                                    </div>
                                    {sub.description && (
                                      <p className="text-[11px] text-white/60 line-clamp-1 mt-0.5">{sub.description}</p>
                                    )}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    }

                    return (
                      <Link 
                        key={itemId}
                        href={item.href || "/"} 
                        onClick={() => setOpenMenu(false)} 
                        className="flex items-center justify-between py-3.5 px-5 text-[15px] font-semibold text-white hover:text-[#D9A441] transition-colors"
                      >
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* 3. Account & Contact Shortcuts (Vedabay style from Image 3) */}
                <div className="py-2 border-b border-white/10 flex flex-col">
                  {/* Register / Login / My Account */}
                  <Link 
                    href={mounted && user ? "/account" : "/login"} 
                    onClick={() => setOpenMenu(false)} 
                    className="flex items-center gap-3 py-3 px-5 text-sm font-semibold text-white hover:text-[#D9A441] transition-colors"
                  >
                    <span className="text-[#D9A441] text-base">⚡</span>
                    <span>{mounted && user ? "My Account" : "Register / Login"}</span>
                  </Link>

                  {/* Email */}
                  <a 
                    href="mailto:floramade517@gmail.com" 
                    className="flex items-center gap-3 py-2.5 px-5 text-xs text-white/85 hover:text-[#D9A441] transition-colors"
                  >
                    <Mail size={15} className="text-[#D9A441] shrink-0" />
                    <span>floramade517@gmail.com</span>
                  </a>

                  {/* Phone */}
                  <a 
                    href="tel:+919220251059" 
                    className="flex items-center gap-3 py-2.5 px-5 text-xs text-white/85 hover:text-[#D9A441] transition-colors"
                  >
                    <Phone size={15} className="text-[#D9A441] shrink-0" />
                    <span>+91 9220251059</span>
                  </a>
                </div>

                {/* 4. Secondary Navigation Links (Vedabay style from Image 3) */}
                <div className="py-2 border-b border-white/10 flex flex-col text-sm">
                  <Link 
                    href="/" 
                    onClick={() => setOpenMenu(false)} 
                    className="block py-2.5 px-5 text-white/80 hover:text-[#D9A441] font-medium transition-colors"
                  >
                    Home
                  </Link>
                  <Link 
                    href="/contact" 
                    onClick={() => setOpenMenu(false)} 
                    className="block py-2.5 px-5 text-white/80 hover:text-[#D9A441] font-medium transition-colors"
                  >
                    Contact us
                  </Link>
                  <Link 
                    href="/about" 
                    onClick={() => setOpenMenu(false)} 
                    className="block py-2.5 px-5 text-white/80 hover:text-[#D9A441] font-medium transition-colors"
                  >
                    About Floramade
                  </Link>
                  <Link 
                    href="/collection" 
                    onClick={() => setOpenMenu(false)} 
                    className="block py-2.5 px-5 text-white/80 hover:text-[#D9A441] font-medium transition-colors"
                  >
                    All Products
                  </Link>

                  {mounted && (user?.role === 'admin' || user?.isAdmin) && (
                    <Link 
                      href="/admin" 
                      onClick={() => setOpenMenu(false)} 
                      className="flex items-center gap-2 py-2.5 px-5 text-[#D9A441] font-bold hover:text-[#D9A441]"
                    >
                      <LayoutDashboard size={14} /> Admin Dashboard
                    </Link>
                  )}

                  {mounted && user && (
                    <button 
                      onClick={async () => { 
                        setOpenMenu(false); 
                        await logout(); 
                        router.replace("/"); 
                      }} 
                      className="flex items-center gap-2 py-2.5 px-5 text-red-400 font-semibold hover:text-red-300 transition-colors w-full text-left"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  )}
                </div>

              </div>

              {/* 5. Bottom Social Media Icons (Vedabay style from Image 3) */}
              <div className="p-5 flex items-center justify-center gap-4 shrink-0">
                <a 
                  href="https://www.facebook.com/share/1HuEXx3gQh/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="h-8 w-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/40 transition-all text-xs" 
                  aria-label="Facebook"
                >
                  <FaFacebookF size={12} />
                </a>
                <a 
                  href="https://www.instagram.com/floramadeofficial/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="h-8 w-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/40 transition-all text-xs" 
                  aria-label="Instagram"
                >
                  <FaInstagram size={13} />
                </a>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
