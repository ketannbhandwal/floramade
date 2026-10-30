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
import { DEFAULT_NAV_LINKS } from "@/lib/settings-constants";
import SearchOverlay from "@/components/layout/SearchOverlay";

/* Top Announcement Bar: Floramade Luxury Ayurvedic Theme (#39160D & #FFF7EB) */
const AnnouncementBar = () => (
  <div className="bg-[#39160D] text-[#FFF7EB] py-2 px-3 sm:px-6 md:px-8 lg:px-12 border-b border-[#4A1E13] relative z-[80]">
    <div className="max-w-[1440px] mx-auto flex items-center justify-between text-[11px] sm:text-xs font-medium tracking-tight">
      
      {/* Left: Social Media + Follow us! */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <a 
          href="https://www.facebook.com/share/1HuEXx3gQh/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="h-5 w-5 rounded-full bg-[#FFF7EB]/10 hover:bg-[#FFF7EB]/20 transition-all flex items-center justify-center text-[#FFF7EB] text-[10px]" 
          title="Follow us on Facebook"
          aria-label="Facebook"
        >
          <FaFacebookF size={10} />
        </a>
        <a 
          href="https://www.instagram.com/floramadeofficial/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="h-5 w-5 rounded-full bg-[#FFF7EB]/10 hover:bg-[#FFF7EB]/20 transition-all flex items-center justify-center text-[#FFF7EB] text-[10px]" 
          title="Follow us on Instagram"
          aria-label="Instagram"
        >
          <FaInstagram size={11} />
        </a>
        <span className="text-[11px] sm:text-xs font-medium text-[#FFF7EB]/90 ml-0.5">Follow us!</span>
      </div>
      
      {/* Center: Festive Offer Banner */}
      <div className="text-center truncate px-2">
        <span className="inline-flex items-center gap-1.5 text-[#FFF7EB] font-semibold text-[11px] sm:text-xs">
          <span>🎉</span>
          <span className="text-[#DFC77F]">Festive Offer:</span>
          <span>Save Up to 20% + Extra Combo OFF!</span>
        </span>
      </div>

      {/* Right: Get in touch with us + Call & Mail Icons */}
      <div className="hidden sm:flex items-center gap-2 text-[#FFF7EB]/90">
        <span className="text-[11px] sm:text-xs font-medium text-[#FFF7EB]/80">Get in touch with us</span>
        <div className="flex items-center gap-1.5 ml-1">
          <a 
            href="tel:+919220251059" 
            className="h-5 w-5 rounded-full bg-[#FFF7EB]/10 hover:bg-[#FFF7EB]/25 transition-all flex items-center justify-center text-[#FFF7EB]"
            title="Call helpline: +91 9220251059"
            aria-label="Call Helpline"
          >
            <Phone size={11} />
          </a>
          <a 
            href="https://wa.me/919220251059" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="h-5 w-5 rounded-full bg-[#FFF7EB]/10 hover:bg-[#FFF7EB]/25 transition-all flex items-center justify-center text-[#FFF7EB]"
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

export default function Navbar() {
  const { cartItems = [], total = 0 } = useCart() || {};
  const { wishlistItems = [] } = useWishlist() || {};
  const { user, logout } = useAuth() || {};
  const router = useRouter();

  const [openMenu, setOpenMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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
          setScrolled(currentScrollY > 15);

          if (currentScrollY > lastScrollY && currentScrollY > 140) {
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

        {/* Floramade Luxury Single-Row Navbar: #FFF7EB Ivory & #39160D Palette */}
        <div className={`bg-[#FFF7EB] border-b border-[#E8D9C5] transition-all duration-300 ${scrolled ? 'shadow-md shadow-[#39160D]/5' : ''}`}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
            
            <div className="flex items-center justify-between h-[68px] sm:h-[72px] gap-2 lg:gap-6">
              
              {/* LEFT: Mobile Toggle + Official Floramade Golden Logo */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <button
                  onClick={() => setOpenMenu(true)}
                  className="lg:hidden p-2 -ml-1 rounded-full transition-colors hover:bg-[#39160D]/10 text-[#39160D] focus:outline-none"
                  aria-label="Open Navigation Menu"
                >
                  <Menu size={23} strokeWidth={2.2} />
                </button>

                <Link href="/" className="flex items-center focus:outline-none group">
                  <Image
                    src="/floramade-official-logo.png"
                    alt="Floramade Ayurveda"
                    width={200}
                    height={50}
                    priority
                    className="h-10 sm:h-11 md:h-12 w-auto object-contain cursor-pointer transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </Link>
              </div>

              {/* CENTER: Navigation Links (Floramade Theme & User Customized) */}
              <nav className="hidden lg:flex items-center justify-center gap-5 xl:gap-8 flex-1">
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
                          className={`text-[13.5px] xl:text-[14px] font-semibold tracking-tight flex items-center gap-1.5 transition-colors py-1 cursor-pointer focus:outline-none ${
                            isOpen ? "text-[#872B10]" : "text-[#39160D] hover:text-[#872B10]"
                          }`}
                        >
                          <span>{item.label}</span>
                          <ChevronDown 
                            size={12} 
                            strokeWidth={2.4}
                            className={`text-[#872B10] transition-transform duration-200 group-hover/nav:rotate-180 ${isOpen ? 'rotate-180' : ''}`} 
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
                          <div className="bg-[#FFF7EB] border border-[#E8D9C5] rounded-2xl shadow-[0_15px_40px_rgba(57,22,13,0.12)] p-2.5 backdrop-blur-xl">
                            {item.subHeading && (
                              <div className="px-3 py-1.5 border-b border-[#39160D]/10 mb-1 flex items-center justify-between">
                                <p className="text-[10px] uppercase tracking-wider font-bold text-[#872B10] flex items-center gap-1.5">
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
                                        ? "bg-[#872B10]/10 hover:bg-[#872B10]/20 border border-[#872B10]/25 shadow-xs"
                                        : "hover:bg-[#F5EADB]/80 border border-transparent"
                                    }`}
                                  >
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="text-[13px] font-bold text-[#39160D] group-hover/item:text-[#872B10] transition-colors tracking-tight">
                                          {sub.label}
                                        </span>
                                        {sub.badge && (
                                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full tracking-tight ${
                                            isTargetProduct
                                              ? "bg-[#872B10] text-[#FFF7EB]"
                                              : "bg-[#39160D]/10 text-[#39160D]"
                                          }`}>
                                            {sub.badge}
                                          </span>
                                        )}
                                      </div>
                                      {sub.description && (
                                        <p className="text-[11px] text-[#39160D]/70 mt-0.5 leading-snug font-normal line-clamp-1">
                                          {sub.description}
                                        </p>
                                      )}
                                    </div>
                                    <ArrowRight size={12} className="text-[#872B10] opacity-50 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all shrink-0" />
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
                      className="text-[13.5px] xl:text-[14px] font-semibold tracking-tight text-[#39160D] hover:text-[#872B10] transition-colors whitespace-nowrap py-3"
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* RIGHT: Action Icons (Floramade Theme: User, Search, Cart Bag, Admin) */}
              <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
                
                {/* ADMIN BADGE (Visible only to Admin) */}
                {mounted && (user?.role === "admin" || user?.isAdmin) && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#872B10]/10 text-[#872B10] hover:bg-[#872B10] hover:text-[#FFF7EB] font-bold text-[10px] uppercase tracking-tight transition-all border border-[#872B10]/20 whitespace-nowrap mr-1 shadow-xs"
                    title="Open Admin Dashboard"
                  >
                    <LayoutDashboard size={12} />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}

                {/* Account / Profile Icon */}
                <Link 
                  href={mounted && user ? "/account" : "/login"} 
                  className="p-2 sm:p-2.5 rounded-full text-[#39160D] hover:text-[#872B10] hover:bg-[#39160D]/5 transition-all focus:outline-none"
                  title={mounted && user ? "My Account" : "Login / Account"}
                  aria-label="User Account"
                >
                  <UserRound size={20} strokeWidth={1.9} />
                </Link>

                {/* Search Icon (Opens SearchOverlay) */}
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="p-2 sm:p-2.5 rounded-full text-[#39160D] hover:text-[#872B10] hover:bg-[#39160D]/5 transition-all focus:outline-none cursor-pointer"
                  title="Search Products"
                  aria-label="Search"
                >
                  <Search size={20} strokeWidth={1.9} />
                </button>

                {/* Wishlist Icon */}
                <Link 
                  href="/wishlist" 
                  className="p-2 sm:p-2.5 rounded-full text-[#39160D] hover:text-[#872B10] hover:bg-[#39160D]/5 transition-all relative focus:outline-none hidden sm:inline-flex"
                  title="Wishlist"
                  aria-label="Wishlist"
                >
                  <Heart size={20} strokeWidth={1.9} />
                  {mounted && wishlistItems.length > 0 && (
                    <span className="absolute top-1 right-1 h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center text-[9px] font-bold bg-[#872B10] text-[#FFF7EB] shadow-xs">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>

                {/* Cart Icon (Shopping Bag with Floating Floramade Terracotta Badge) */}
                <Link 
                  href="/cart" 
                  className="relative p-2 sm:p-2.5 rounded-full text-[#39160D] hover:text-[#872B10] hover:bg-[#39160D]/5 transition-all focus:outline-none group active:scale-95"
                  title="Shopping Cart"
                  aria-label="View Shopping Cart"
                >
                  <ShoppingBag size={21} strokeWidth={1.9} className="group-hover:scale-105 transition-transform" />
                  
                  {/* Floating Bag Counter Badge sitting on top-right */}
                  <span className="absolute top-1 right-0.5 sm:top-1 sm:right-1 h-[17px] min-w-[17px] px-1 rounded-full flex items-center justify-center text-[10px] font-bold bg-[#872B10] text-[#FFF7EB] shadow-sm ring-2 ring-[#FFF7EB]">
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

      {/* Mobile Drawer Navigation (Floramade Theme #FFF7EB & #39160D) */}
      <AnimatePresence mode="wait">
        {openMenu && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] bg-[#FFF7EB] flex flex-col text-[#39160D]"
          >
            {/* Drawer Header */}
            <div className="sticky top-0 flex items-center justify-between p-4 sm:p-5 bg-[#FFF7EB] border-b border-[#E8D9C5] z-20">
              <Link href="/" onClick={() => setOpenMenu(false)}>
                <Image 
                  src="/floramade-official-logo.png" 
                  alt="Floramade" 
                  width={160} 
                  height={45} 
                  className="h-10 w-auto object-contain" 
                />
              </Link>
              <button
                onClick={() => setOpenMenu(false)}
                className="p-2 rounded-full bg-[#39160D]/5 hover:bg-[#39160D]/15 text-[#39160D] transition-all border border-[#39160D]/10 active:scale-95"
                aria-label="Close Navigation"
              >
                <X size={21} strokeWidth={2.2} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
              
              {/* Quick Search Button in Drawer */}
              <button
                onClick={() => { setOpenMenu(false); setSearchOpen(true); }}
                className="w-full flex items-center gap-3 bg-white border border-[#E8D9C5] rounded-full px-4 py-2.5 text-sm text-[#39160D]/60 hover:border-[#39160D] transition-all text-left shadow-2xs"
              >
                <Search size={16} className="text-[#872B10]" />
                <span>Search products & remedies...</span>
              </button>

              {/* Navigation Links Accordion */}
              <div className="space-y-1 divide-y divide-[#E8D9C5]/60">
                {navLinks.map((item, idx) => {
                  const isDropdown = item.type === "dropdown" && Array.isArray(item.subLinks) && item.subLinks.length > 0;
                  const itemId = item.id || `mob-${idx}`;
                  const isMobOpen = mobileOpenDropdownId === itemId;

                  if (isDropdown) {
                    return (
                      <div key={itemId} className="pt-2 first:pt-0">
                        <button 
                          onClick={() => setMobileOpenDropdownId(isMobOpen ? null : itemId)} 
                          className="flex items-center justify-between w-full py-2.5 text-base font-bold text-[#39160D]"
                        >
                          <span>{item.label}</span>
                          <ChevronDown 
                            size={16} 
                            className={`transition-transform duration-300 text-[#872B10] ${isMobOpen ? 'rotate-180' : ''}`} 
                          />
                        </button>

                        <AnimatePresence>
                          {isMobOpen && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }} 
                              animate={{ height: 'auto', opacity: 1 }} 
                              exit={{ height: 0, opacity: 0 }} 
                              className="pl-3.5 flex flex-col gap-2 py-2 border-l-2 border-[#872B10]/30 ml-2 overflow-hidden"
                            >
                              {item.subLinks.map((sub, sIdx) => (
                                <Link 
                                  key={sub.id || sIdx}
                                  href={sub.href || "/product/madhucurex-diabetes-pro"} 
                                  onClick={() => setOpenMenu(false)}
                                  className="block py-1.5"
                                >
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-[#39160D]">{sub.label}</p>
                                    {sub.badge && (
                                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#872B10] text-[#FFF7EB]">
                                        {sub.badge}
                                      </span>
                                    )}
                                  </div>
                                  {sub.description && (
                                    <p className="text-[11px] text-[#39160D]/65 mt-0.5 line-clamp-1">{sub.description}</p>
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
                    <div key={itemId} className="pt-2 first:pt-0">
                      <Link 
                        href={item.href || "/"} 
                        onClick={() => setOpenMenu(false)} 
                        className="flex items-center py-2.5 text-base font-bold text-[#39160D]"
                      >
                        {item.label}
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Company & Support Links */}
              <div className="pt-4 border-t border-[#E8D9C5]">
                <p className="text-[10px] uppercase tracking-wider text-[#872B10] font-bold mb-3">
                  Company & Care
                </p>
                <div className="flex flex-col gap-2.5 text-sm text-[#39160D]/80 font-medium">
                  <Link href="/about" onClick={() => setOpenMenu(false)} className="hover:text-[#872B10]">
                    About Floramade
                  </Link>
                  <Link href="/contact" onClick={() => setOpenMenu(false)} className="hover:text-[#872B10]">
                    Contact Support
                  </Link>
                  {mounted && (user?.role === 'admin' || user?.isAdmin) && (
                    <Link 
                      href="/admin" 
                      onClick={() => setOpenMenu(false)} 
                      className="font-bold text-[#872B10] flex items-center gap-1.5 py-1"
                    >
                      <LayoutDashboard size={15} /> Admin Dashboard
                    </Link>
                  )}
                </div>
              </div>

            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-4 sm:p-5 border-t border-[#E8D9C5] bg-[#F5EADB] space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <Link 
                  href="/wishlist" 
                  onClick={() => setOpenMenu(false)} 
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-white border border-[#E8D9C5] text-xs font-bold text-[#39160D] shadow-xs"
                >
                  <Heart size={14} className="text-[#872B10]" />
                  <span>Wishlist ({mounted ? wishlistItems.length : 0})</span>
                </Link>

                <Link 
                  href="/cart" 
                  onClick={() => setOpenMenu(false)} 
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-[#39160D] text-[#FFF7EB] text-xs font-bold shadow-xs hover:bg-[#872B10] transition-colors"
                >
                  <ShoppingBag size={14} />
                  <span>Cart ({mounted ? cartCount : 0})</span>
                </Link>
              </div>

              <div className="flex items-center justify-between pt-1">
                <Link 
                  href={mounted && user ? "/account" : "/login"} 
                  onClick={() => setOpenMenu(false)} 
                  className="text-xs font-bold text-[#39160D] flex items-center gap-1.5 hover:text-[#872B10]"
                >
                  <UserRound size={14} className="text-[#872B10]" />
                  <span>{mounted && user ? "My Account" : "Login / Account"}</span>
                </Link>

                {mounted && user && (
                  <button 
                    onClick={async () => { 
                      setOpenMenu(false); 
                      await logout(); 
                      router.replace("/"); 
                    }} 
                    className="text-xs font-bold text-red-600 flex items-center gap-1"
                  >
                    <LogOut size={13} /> Logout
                  </button>
                )}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
