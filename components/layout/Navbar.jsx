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
  Leaf, 
  Phone, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
import { DEFAULT_NAV_LINKS } from "@/lib/settings-constants";

/* Top Announcement Bar: Clean #39160D background & #FFF7EB text */
const AnnouncementBar = () => (
  <div className="bg-[#39160D] text-[#FFF7EB] py-1.5 px-4 sm:px-6 md:px-8 lg:px-12 border-b border-[#4A1E13]">
    <div className="max-w-[1440px] mx-auto flex items-center justify-between text-[11px] font-medium tracking-wide">
      {/* Left: Free Shipping & Trust */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <Leaf size={12} className="text-[#DFC77F]" />
          <span>Free Shipping on Orders Above ₹499</span>
        </div>
        <span className="hidden sm:inline-block text-[#FFF7EB]/40">•</span>
        <span className="hidden sm:inline-block text-[#FFF7EB]/85 font-normal">100% Ayurvedic & Lab-Tested</span>
      </div>
      
      {/* Center: Helpline */}
      <div className="hidden md:flex items-center gap-1.5">
        <Phone size={12} className="text-[#DFC77F]" />
        <span>Helpline: <a href="tel:+919220251059" className="hover:text-[#DFC77F] transition-colors font-semibold">+91 9220251059</a></span>
      </div>

      {/* Right: Social & WhatsApp */}
      <div className="flex items-center gap-4">
        <a 
          href="https://wa.me/919220251059" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-[#DFC77F] transition-colors flex items-center gap-1 text-[11px]"
          title="WhatsApp Support"
        >
          <FaWhatsapp size={13} className="text-[#25D366]" />
          <span className="hidden lg:inline text-[10px]">Chat Now</span>
        </a>
        <a 
          href="https://www.instagram.com/floramadeofficial/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-[#DFC77F] transition-colors" 
          title="Instagram"
        >
          <FaInstagram size={13} />
        </a>
        <a 
          href="https://www.facebook.com/share/1HuEXx3gQh/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-[#DFC77F] transition-colors" 
          title="Facebook"
        >
          <FaFacebookF size={11} />
        </a>
      </div>
    </div>
  </div>
);

export default function Navbar() {
  const { cartItems = [], total = 0 } = useCart() || {};
  const { wishlistItems = [] } = useWishlist() || {};
  const { user, logout } = useAuth() || {};
  const router = useRouter();

  const [openMenu, setOpenMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
    }, 220);
  };

  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let isSubscribed = true;
    fetch("/api/settings")
      .then(r => r.json())
      .then(data => {
        if (isSubscribed && Array.isArray(data?.navLinks) && data.navLinks.length > 0) {
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
          setScrolled(currentScrollY > 20);

          if (currentScrollY > lastScrollY && currentScrollY > 150) {
            setVisible(false);
          } else {
            setVisible(true);
          }
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setOpenMenu(false);
    }
  };

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
        <AnnouncementBar />

        {/* Suwasthi-style Clean, Seamless Ivory Navbar: #FFF7EB */}
        <div className={`bg-[#FFF7EB] border-b border-[#E8D9C5]/80 transition-all duration-300 ${scrolled ? 'shadow-md shadow-[#39160D]/5' : ''}`}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            
            {/* ROW 1: Logo (Left) + Search Pill (Center) + Account & Cart Pills (Right) */}
            <div className={`flex items-center justify-between gap-4 md:gap-8 transition-all duration-300 ${scrolled ? "pt-2.5 pb-1 sm:pt-3 sm:pb-1.5" : "pt-3.5 pb-2 sm:pt-4 sm:pb-2.5"}`}>
              
              {/* Left: Mobile Toggle & Stacked Floramade Logo */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setOpenMenu(true)}
                  className="lg:hidden p-2 -ml-1 rounded-full transition-colors hover:bg-[#39160D]/10 text-[#39160D] focus:outline-none"
                  aria-label="Open Navigation Menu"
                >
                  <Menu size={22} strokeWidth={2} />
                </button>

                <Link href="/" className="flex items-center focus:outline-none group">
                  <Image
                    src="/logo.png"
                    alt="Floramade Ayurveda"
                    width={140}
                    height={140}
                    priority
                    className="h-14 sm:h-16 md:h-[68px] w-auto object-contain cursor-pointer transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </Link>
              </div>

              {/* Center: Wide Rounded Pill Search Bar: [ 🔍 Search for... ] */}
              <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl lg:max-w-2xl">
                <div className="relative flex items-center w-full">
                  <Search size={18} className="absolute left-4 text-[#39160D]/45 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search for..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#FFFBF5] border border-[#39160D]/20 rounded-full py-2.5 pl-11 pr-5 text-sm text-[#39160D] placeholder:text-[#39160D]/40 focus:outline-none focus:border-[#39160D] focus:bg-white transition-all shadow-sm"
                  />
                </div>
              </form>

              {/* Right: Wishlist + [ 👤 Account ] + [ 🛒 Rs. 0.00 (0) ] */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                
                {/* Mobile Search Button */}
                <Link 
                  href="/search" 
                  className="md:hidden p-2 rounded-full hover:bg-[#39160D]/10 text-[#39160D] transition-colors"
                  aria-label="Search"
                >
                  <Search size={20} strokeWidth={2} />
                </Link>

                {/* Minimalist Wishlist Button */}
                <Link 
                  href="/wishlist" 
                  className="p-2 sm:p-2.5 rounded-full hover:bg-[#39160D]/10 text-[#39160D] transition-all relative focus:outline-none"
                  title="Wishlist"
                  aria-label="Wishlist"
                >
                  <Heart size={20} strokeWidth={1.8} className="hover:text-[#872B10] transition-colors" />
                  {mounted && wishlistItems.length > 0 && (
                    <span className="absolute 0 top-0.5 right-0.5 h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center text-[9px] font-bold bg-[#872B10] text-[#FFF7EB] shadow-sm animate-pulse">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>

                {/* Account Pill: [ 👤 Account ] */}
                <Link 
                  href={mounted && user ? "/account" : "/login"} 
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-[#39160D]/35 text-[#39160D] text-xs sm:text-[13px] font-medium hover:bg-[#39160D]/5 transition-all shadow-sm focus:outline-none"
                >
                  <UserRound size={16} strokeWidth={1.8} />
                  <span>Account</span>
                </Link>

                {/* Cart Solid Dark Pill: [ 🛒 Rs. 0.00 (0) ] */}
                <Link 
                  href="/cart" 
                  className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#39160D] text-[#FFF7EB] text-xs sm:text-[13px] font-medium hover:bg-[#4E2014] transition-all shadow-md focus:outline-none active:scale-95"
                >
                  <ShoppingBag size={16} strokeWidth={1.8} />
                  <span>Rs. {mounted ? total.toFixed(2) : "0.00"} ({mounted ? cartCount : 0})</span>
                </Link>

              </div>
            </div>

            {/* ROW 2: Dynamic Navigation Links Bar (Admin Configurable & Fully Responsive) */}
            <nav className="w-full pb-2.5 pt-0.5 overflow-visible">
              <div className="flex flex-wrap items-center justify-start sm:justify-start gap-4 sm:gap-6 md:gap-8 lg:gap-11 text-[11px] sm:text-xs md:text-[13px] font-semibold uppercase tracking-tight text-[#39160D] overflow-visible">
                
                {navLinks.map((item, idx) => {
                  const isDropdown = item.type === "dropdown" && Array.isArray(item.subLinks) && item.subLinks.length > 0;
                  const itemId = item.id || `nav-${idx}`;
                  const isOpen = openDropdownId === itemId;

                  if (isDropdown) {
                    return (
                      <div 
                        key={itemId}
                        className="relative py-1 group/nav"
                        onMouseEnter={() => handleMouseEnterDropdown(itemId)}
                        onMouseLeave={handleMouseLeaveDropdown}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenDropdownId(isOpen ? null : itemId)}
                          className="hover:text-[#872B10] transition-colors uppercase tracking-tight font-semibold flex items-center gap-1 focus:outline-none whitespace-nowrap py-1 cursor-pointer"
                        >
                          <span>{item.label}</span>
                          <ChevronDown 
                            size={12} 
                            className={`text-[#872B10] transition-transform duration-200 group-hover/nav:rotate-180 ${isOpen ? 'rotate-180' : ''}`} 
                          />
                        </button>

                        {/* Dropdown Container: Opens instantly on CSS hover OR React state */}
                        <div 
                          className={`absolute top-full left-0 pt-2 z-[999] min-w-[300px] max-w-[340px] transition-all duration-200 ease-out origin-top-left ${
                            isOpen 
                              ? "opacity-100 visible pointer-events-auto translate-y-0" 
                              : "opacity-0 invisible pointer-events-none -translate-y-1 lg:group-hover/nav:opacity-100 lg:group-hover/nav:visible lg:group-hover/nav:pointer-events-auto lg:group-hover/nav:translate-y-0"
                          }`}
                          onMouseEnter={() => handleMouseEnterDropdown(itemId)}
                          onMouseLeave={handleMouseLeaveDropdown}
                        >
                          <div className="bg-[#FFF7EB] border border-[#E8D9C5] rounded-2xl shadow-xl p-2.5 backdrop-blur-xl normal-case">
                            {item.subHeading && (
                              <div className="px-3 py-1.5 border-b border-[#39160D]/10 mb-1 flex items-center justify-between">
                                <p className="text-[10px] uppercase tracking-wider font-bold text-[#872B10] flex items-center gap-1.5">
                                  <Sparkles size={11} /> {item.subHeading}
                                </p>
                              </div>
                            )}

                            <div className="space-y-1">
                              {item.subLinks.map((sub, sIdx) => {
                                const isTargetProduct = sub.href?.includes("madhu-diabetes-pro") || sub.label?.toLowerCase().includes("diabetes pro");
                                return (
                                  <Link
                                    key={sub.id || sIdx}
                                    href={sub.href || "/product/madhu-diabetes-pro"}
                                    onClick={() => setOpenDropdownId(null)}
                                    className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all group/item ${
                                      isTargetProduct
                                        ? "bg-[#872B10]/10 hover:bg-[#872B10]/20 border border-[#872B10]/30 shadow-xs"
                                        : "hover:bg-[#F5EADB]/80 border border-transparent"
                                    }`}
                                  >
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-[#39160D] group-hover/item:text-[#872B10] transition-colors tracking-tight">
                                          {sub.label}
                                        </span>
                                        {sub.badge && (
                                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                            isTargetProduct
                                              ? "bg-[#872B10] text-[#FFF7EB]"
                                              : "bg-[#39160D]/10 text-[#39160D]"
                                          }`}>
                                            {sub.badge}
                                          </span>
                                        )}
                                      </div>
                                      {sub.description && (
                                        <p className="text-[11px] text-[#39160D]/70 mt-0.5 leading-snug font-normal">
                                          {sub.description}
                                        </p>
                                      )}
                                    </div>
                                    <ArrowRight size={13} className="text-[#872B10] opacity-50 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all shrink-0" />
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
                      className="hover:text-[#872B10] transition-colors whitespace-nowrap py-1 tracking-tight"
                    >
                      {item.label}
                    </Link>
                  );
                })}

                {/* ADMIN PANEL (Only shown when admin is logged in) */}
                {mounted && (user?.role === "admin" || user?.isAdmin) && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-[#872B10]/10 text-[#872B10] hover:bg-[#872B10] hover:text-[#FFF7EB] font-bold text-[10px] sm:text-xs uppercase tracking-tight transition-all shadow-sm border border-[#872B10]/20 whitespace-nowrap group shrink-0"
                  >
                    <LayoutDashboard size={12} className="transition-transform group-hover:rotate-6 sm:w-[13px] sm:h-[13px]" />
                    <span>ADMIN PANEL</span>
                  </Link>
                )}

              </div>
            </nav>

          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation with Theme #FFF7EB & #39160D */}
      <AnimatePresence mode="wait">
        {openMenu && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] bg-[#FFF7EB] flex flex-col text-[#39160D]"
          >
            {/* Drawer Header */}
            <div className="sticky top-0 flex items-center justify-between p-5 bg-[#FFF7EB] border-b border-[#E8D9C5] z-20">
              <Link href="/" onClick={() => setOpenMenu(false)}>
                <Image 
                  src="/logo.png" 
                  alt="Floramade" 
                  width={140} 
                  height={140} 
                  className="h-14 w-auto object-contain" 
                />
              </Link>
              <button
                onClick={() => setOpenMenu(false)}
                className="p-2.5 rounded-full bg-[#39160D]/5 hover:bg-[#39160D]/15 text-[#39160D] transition-all border border-[#39160D]/10 active:scale-95"
                aria-label="Close Navigation"
              >
                <X size={22} strokeWidth={2} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search for..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#E8D9C5] rounded-full px-4 py-3 pl-11 text-sm text-[#39160D] placeholder:text-[#39160D]/45 focus:outline-none focus:border-[#39160D]"
                />
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#39160D]" />
              </form>

              {/* Navigation Links */}
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#872B10] font-bold mb-3">
                    Featured Products
                  </p>
                  <div className="flex flex-col gap-2">
                    {navLinks.map((item, idx) => {
                      const isDropdown = item.type === "dropdown" && Array.isArray(item.subLinks) && item.subLinks.length > 0;
                      const itemId = item.id || `mob-${idx}`;
                      const isMobOpen = mobileOpenDropdownId === itemId;

                      if (isDropdown) {
                        return (
                          <div key={itemId}>
                            <button 
                              onClick={() => setMobileOpenDropdownId(isMobOpen ? null : itemId)} 
                              className="flex items-center justify-between w-full py-2.5 text-base font-semibold text-[#39160D]"
                            >
                              <span className="flex items-center gap-2">
                                <Leaf size={16} className="text-[#872B10]" /> {item.label}
                              </span>
                              <ChevronDown 
                                size={16} 
                                className={`transition-transform duration-300 text-[#39160D]/50 ${isMobOpen ? 'rotate-180' : ''}`} 
                              />
                            </button>

                            <AnimatePresence>
                              {isMobOpen && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }} 
                                  animate={{ height: 'auto', opacity: 1 }} 
                                  exit={{ height: 0, opacity: 0 }} 
                                  className="pl-6 flex flex-col gap-2.5 py-2 border-l border-[#39160D]/20 ml-2 overflow-hidden"
                                >
                                  {item.subLinks.map((sub, sIdx) => (
                                    <Link 
                                      key={sub.id || sIdx}
                                      href={sub.href || "/"} 
                                      onClick={() => setOpenMenu(false)}
                                      className="block py-1"
                                    >
                                      <p className="text-sm font-semibold text-[#39160D]">{sub.label}</p>
                                      {sub.description && (
                                        <p className="text-[11px] text-[#39160D]/65">{sub.description}</p>
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
                          className="flex items-center gap-2 py-2.5 text-base font-semibold text-[#39160D]"
                        >
                          <Sparkles size={16} className="text-[#872B10]" /> {item.label}
                        </Link>
                      );
                    })}

                  </div>
                </div>

                <div className="pt-2 border-t border-[#E8D9C5]">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#872B10] font-bold mb-3">
                    Company
                  </p>
                  <div className="flex flex-col gap-3">
                    <Link 
                      href="/" 
                      onClick={() => setOpenMenu(false)} 
                      className="text-sm font-medium text-[#39160D]/85 hover:text-[#872B10]"
                    >
                      Home
                    </Link>
                    <Link 
                      href="/about" 
                      onClick={() => setOpenMenu(false)} 
                      className="text-sm font-medium text-[#39160D]/85 hover:text-[#872B10]"
                    >
                      About Us & Our Founder
                    </Link>
                    <Link 
                      href="/contact" 
                      onClick={() => setOpenMenu(false)} 
                      className="text-sm font-medium text-[#39160D]/85 hover:text-[#872B10]"
                    >
                      Business Enquiry & Support
                    </Link>
                    {mounted && (user?.role === 'admin' || user?.isAdmin) && (
                      <Link 
                        href="/admin" 
                        onClick={() => setOpenMenu(false)} 
                        className="text-sm font-semibold text-[#872B10] flex items-center gap-1.5 py-1"
                      >
                        <LayoutDashboard size={15} /> Admin Dashboard
                      </Link>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-5 border-t border-[#E8D9C5] bg-[#F5EADB] space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Link 
                  href="/wishlist" 
                  onClick={() => setOpenMenu(false)} 
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-full bg-white border border-[#E8D9C5] text-xs font-semibold hover:bg-white/80 text-[#39160D] shadow-sm"
                >
                  <Heart size={15} className="text-[#872B10]" />
                  <span>Wishlist ({mounted ? wishlistItems.length : 0})</span>
                </Link>

                <Link 
                  href="/cart" 
                  onClick={() => setOpenMenu(false)} 
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-full bg-[#39160D] text-[#FFF7EB] text-xs font-semibold hover:bg-[#4E2014] shadow-sm"
                >
                  <ShoppingBag size={15} />
                  <span>Rs. {mounted ? total.toFixed(2) : "0.00"} ({mounted ? cartCount : 0})</span>
                </Link>
              </div>

              <div className="flex items-center justify-between pt-1">
                <Link 
                  href={mounted && user ? "/account" : "/login"} 
                  onClick={() => setOpenMenu(false)} 
                  className="text-xs font-semibold text-[#39160D] flex items-center gap-2 hover:text-[#872B10]"
                >
                  <UserRound size={15} className="text-[#872B10]" />
                  <span>{mounted && user ? "My Account" : "Account (Login)"}</span>
                </Link>

                {mounted && user && (
                  <button 
                    onClick={async () => { 
                      setOpenMenu(false); 
                      await logout(); 
                      router.replace("/"); 
                    }} 
                    className="text-xs font-semibold text-red-600 flex items-center gap-1.5"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-[#39160D]/60 border-t border-[#E8D9C5]/80">
                <a href="tel:+919220251059" className="hover:text-[#39160D]">Helpline: +91 9220251059</a>
                <a href="https://wa.me/919220251059" target="_blank" rel="noopener noreferrer" className="text-[#25D366] font-semibold hover:underline flex items-center gap-1">
                  <FaWhatsapp size={13} /> WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
