"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { Menu, ShoppingBag, UserRound, X, Search, LayoutDashboard, Heart, ChevronDown, LogOut } from "lucide-react";
import Image from "next/image";
import { NAV_LINKS, PRODUCT_CATEGORIES } from "./nav-config";

export default function Navbar() {
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [diabetesDropdownOpen, setDiabetesDropdownOpen] = useState(false);
  const [mobileDiabetesOpen, setMobileDiabetesOpen] = useState(false);

  const isHome = router.asPath === "/" || router.pathname === "/";
  const isAbout = router.asPath === "/about" || router.pathname === "/about";
  const hasDarkHero = isHome || isAbout;

  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Handle background change on scroll
      setScrolled(currentScrollY > 20);

      // Handle show/hide navbar on scroll up/down
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Lock body scroll when menu is open
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

  const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Wishlist", href: "/wishlist" },
  ];

  // Determine if text should be light (white) based on route and scroll state
  const isLightText = hasDarkHero && !scrolled;

  const headerClasses = scrolled || !hasDarkHero
    ? "bg-background/85 backdrop-blur-xl border-b border-border/50 py-4 shadow-sm"
    : "bg-transparent py-6";

  const textColor = isLightText ? "text-white" : "text-foreground";
  const mutedTextColor = isLightText ? "text-white/70 hover:text-white" : "text-foreground/60 hover:text-foreground";
  const badgeBg = isLightText ? "bg-white text-foreground" : "bg-accent text-background";

  return (
    <>
      <div 
        className={`fixed top-0 left-0 right-0 z-[70] transition-all duration-500 ${
          visible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <header 
          className={`relative w-full border-b border-white/10 ${
            scrolled 
              ? "bg-[#2A3B32] shadow-lg lg:bg-[#2A3B32] lg:backdrop-blur-xl py-3" 
              : "bg-[#2A3B32]/95 py-4 md:py-6"
          }`}
        >
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex items-center justify-between gap-4 md:gap-8">
            <div className="flex items-center gap-4 md:gap-8">
              {/* Mobile Menu Button (Left) */}
              <button
                onClick={() => setOpenMenu(true)}
                className="lg:hidden p-2 -ml-2 rounded-full transition-all duration-500 hover:bg-white/5 text-white/80"
                aria-label="Menu"
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>

              {/* Logo */}
              <Link href="/" className="lg:static">
                <Image
                  src="/assets/logo.png"
                  alt="Fiveetatv"
                  width={100}
                  height={100}
                  className={`text-xl md:text-2xl font-display font-medium relative z-10 flex-shrink-0 transition-colors duration-500 cursor-pointer object-contain h-12 md:h-16 w-auto`}
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-xs uppercase tracking-tight font-light transition-all duration-500 text-white/60 hover:text-white`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Icons Right */}
            <div className={`flex items-center gap-2 md:gap-3 flex-shrink-0 transition-colors duration-500 text-white/80`}>
              {/* Search */}
              <div className="flex items-center relative">
                <form onSubmit={handleSearch} className="hidden md:flex items-center bg-white/5 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10 hover:border-accent transition-all duration-300">
                  <Search size={14} strokeWidth={1.5} className="text-white/40" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent outline-none text-sm ml-1.5 w-36 text-white placeholder:text-white/40"
                  />
                </form>
                <Link href="/search" className="md:hidden p-2 rounded-full transition-all duration-500 hover:bg-white/5 z-10" aria-label="Search">
                  <Search size={18} strokeWidth={1.5} />
                </Link>
              </div>

              {/* Admin */}
              {user?.role === 'admin' && (
                <Link href="/admin" className="hidden md:flex p-2 rounded-full transition-all duration-500 hover:bg-white/5" aria-label="Admin">
                  <LayoutDashboard size={18} strokeWidth={1.5} />
                </Link>
              )}

              {/* Account */}
              <Link href="/account" className="flex p-2 rounded-full transition-all duration-500 hover:bg-white/5" aria-label="Account">
                <UserRound size={18} strokeWidth={1.5} />
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative p-2 rounded-full transition-all duration-500 hover:bg-white/5" aria-label="Cart">
                <ShoppingBag size={18} strokeWidth={1.5} />
                <AnimatePresence>
                  {cartItems.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className={`absolute top-0 right-0 h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-light shadow-sm bg-accent text-white`}
                    >
                      {cartItems.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </div>
          </div>
        </header>

        {/* Secondary Navigation Bar - Product Categories */}
        <nav className="hidden lg:block w-full bg-[#2A3B32] border-b border-white/10 shadow-sm">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="flex items-center justify-center gap-12 py-3">
              {PRODUCT_CATEGORIES.map((category) => (
                <div key={category.label} className="relative">
                  {category.hasDropdown ? (
                    <>
                      <button
                        onMouseEnter={() => setDiabetesDropdownOpen(true)}
                        onMouseLeave={() => setDiabetesDropdownOpen(false)}
                        className="text-xs uppercase tracking-tight font-light text-white/70 hover:text-white transition-all duration-300 flex items-center gap-1.5 group"
                      >
                        {category.label}
                        <ChevronDown size={14} className={`transition-transform duration-300 ${diabetesDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {diabetesDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3 }}
                            onMouseEnter={() => setDiabetesDropdownOpen(true)}
                            onMouseLeave={() => setDiabetesDropdownOpen(false)}
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[#2A3B32] border border-white/10 rounded-2xl shadow-2xl py-4 min-w-[320px] overflow-hidden"
                          >
                            <div className="px-6 py-2 border-b border-white/10 mb-2">
                              <p className="text-[10px] uppercase tracking-widest text-accent font-medium">{category.label}</p>
                            </div>
                            {category.subLinks.map((subLink) => (
                              <Link
                                key={subLink.label}
                                href={subLink.href}
                                className="block px-6 py-3 hover:bg-white/5 transition-colors duration-300 group"
                              >
                                <p className="text-sm font-light text-white group-hover:text-accent transition-colors">{subLink.label}</p>
                                <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">{subLink.description}</p>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={category.href}
                      className="text-xs uppercase tracking-tight font-light text-white/70 hover:text-white transition-all duration-300 relative group"
                    >
                      {category.label}
                      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  )}
                </div>
              ))}
              <Link
                href="/policy"
                className="text-xs uppercase tracking-tight font-light text-white/70 hover:text-white transition-all duration-300 relative group"
              >
                Our Policies
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Luxury Full-Screen Mobile Menu */}
      <AnimatePresence mode="wait">
        {openMenu && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] bg-[#2A3B32] flex flex-col text-white"
          >
            {/* Header inside Menu */}
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/10">
              <Link href="/" onClick={() => setOpenMenu(false)}>
                <Image src="/assets/logo.png" alt="Fiveetatv" width={90} height={90} className="object-contain" />
              </Link>
              <button
                onClick={() => setOpenMenu(false)}
                className="p-2 rounded-full hover:bg-white/5 transition-colors text-white/80"
                aria-label="Close menu"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Links in Menu */}
            <div className="flex-1 overflow-y-auto px-6 py-8">
              <nav className="flex flex-col gap-8">
                <Link
                  href="/"
                  onClick={() => setOpenMenu(false)}
                  className="text-3xl md:text-4xl font-display font-light italic text-white hover:text-accent transition-colors"
                >
                  Home
                </Link>

                <div className="flex flex-col gap-6">
                  {PRODUCT_CATEGORIES.map((category, i) => (
                    <motion.div
                      key={category.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.1 }}
                    >
                      {category.hasDropdown ? (
                        <div className="flex flex-col gap-4">
                          <button
                            onClick={() => setMobileDiabetesOpen(!mobileDiabetesOpen)}
                            className="text-2xl md:text-3xl font-display text-white/90 flex items-center justify-between w-full"
                          >
                            {category.label}
                            <ChevronDown size={20} className={`transition-transform duration-300 ${mobileDiabetesOpen ? 'rotate-180' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {mobileDiabetesOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="pl-4 flex flex-col gap-4 overflow-hidden"
                              >
                                {category.subLinks.map((sub) => (
                                  <Link
                                    key={sub.label}
                                    href={sub.href}
                                    onClick={() => setOpenMenu(false)}
                                    className="group"
                                  >
                                    <p className="text-xl text-white/70 group-hover:text-accent transition-colors">{sub.label}</p>
                                    <p className="text-sm text-white/30 uppercase tracking-widest">{sub.description}</p>
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={category.href}
                          onClick={() => setOpenMenu(false)}
                          className="text-2xl md:text-3xl font-display text-white/90 hover:text-accent transition-colors"
                        >
                          {category.label}
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="flex flex-col gap-6 pt-6 border-t border-white/10">
                  {NAV_LINKS.filter(l => l.label !== "Home").map((link, i) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setOpenMenu(false)}
                      className="text-2xl md:text-3xl font-display text-white/90 hover:text-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href="/policy"
                    onClick={() => setOpenMenu(false)}
                    className="text-2xl md:text-3xl font-display text-white/90 hover:text-accent transition-colors"
                  >
                    Our Policies
                  </Link>
                </div>

                <div className="flex flex-col gap-6 pt-6 border-t border-white/10">
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-medium">Account</p>
                  <Link
                    href="/account"
                    onClick={() => setOpenMenu(false)}
                    className="text-xl font-display text-white/70 hover:text-accent transition-colors flex items-center gap-3"
                  >
                    <UserRound size={20} strokeWidth={1.5} />
                    My Account
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setOpenMenu(false)}
                    className="text-xl font-display text-white/70 hover:text-accent transition-colors flex items-center gap-3"
                  >
                    <ShoppingBag size={20} strokeWidth={1.5} />
                    My Cart ({cartItems.length})
                  </Link>
                </div>
              </nav>
            </div>

            {/* Footer inside Menu */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="p-8 md:p-16 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6"
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
                <Link href="/account" onClick={() => setOpenMenu(false)} className="text-sm text-white/60 hover:text-accent transition-colors duration-300">
                  Account
                </Link>
                {user && (
                  <button 
                    onClick={async () => {
                      setOpenMenu(false);
                      await logout();
                      router.push("/");
                      router.refresh();
                    }} 
                    className="text-sm text-white/60 hover:text-accent transition-colors duration-300"
                  >
                    Logout
                  </button>
                )}
                {user?.role === 'admin' && (
                  <Link href="/admin" onClick={() => setOpenMenu(false)} className="text-sm text-white/60 hover:text-accent transition-colors duration-300">
                    Admin
                  </Link>
                )}
              </div>
              <p className="text-xs text-white/40">© 2026 Fiveetatv</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}