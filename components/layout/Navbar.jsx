"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { Menu, ShoppingBag, UserRound, X, Search, LayoutDashboard, Heart, ChevronDown } from "lucide-react";
import Image from "next/image";
import { NAV_LINKS, PRODUCT_CATEGORIES } from "./nav-config";

export default function Navbar() {
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { user } = useAuth();
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [diabetesDropdownOpen, setDiabetesDropdownOpen] = useState(false);
  const [mobileDiabetesOpen, setMobileDiabetesOpen] = useState(false);

  const isHome = router.pathname === "/";
  const isAbout = router.pathname === "/about";
  const hasDarkHero = isHome || isAbout;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <header className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 bg-white/60 backdrop-blur-xl border-b border-border/50`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 md:py-6 flex items-center gap-4 md:gap-8">
          {/* Mobile Menu Button (Left) */}
          <button
            onClick={() => setOpenMenu(true)}
            className="lg:hidden p-2 -ml-2 rounded-full transition-all duration-500 hover:bg-foreground/5"
            aria-label="Menu"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>

          {/* Logo (Center) */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
            <Image
              src="/assets/logo.png"
              alt="Fiveetatv"
              width={110}
              height={110}
              className={`text-xl md:text-2xl font-display font-medium relative z-10 flex-shrink-0 transition-colors duration-500 text-foreground cursor-pointer`}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-xs uppercase tracking-tight font-light transition-all duration-500 text-foreground/60 hover:text-foreground`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Icons Right */}
          <div className={`flex items-center gap-2 md:gap-3 flex-shrink-0 transition-colors duration-500 text-foreground ml-auto`}>

            {/* Search */}
            <div className="flex items-center relative">
              <form onSubmit={handleSearch} className="hidden md:flex items-center bg-white/50 backdrop-blur-sm rounded-full px-3 py-1.5 border border-border hover:border-accent transition-all duration-300">
                <Search size={14} strokeWidth={1.5} className="text-foreground/40" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-sm ml-1.5 w-36 text-foreground placeholder:text-foreground/40"
                />
              </form>
              <Link href="/search" className="md:hidden p-2 rounded-full transition-all duration-500 hover:bg-foreground/5 z-10" aria-label="Search">
                <Search size={18} strokeWidth={1.5} />
              </Link>
            </div>

            {/* Admin */}
            {user?.role === 'admin' && (
              <Link href="/admin" className="hidden md:flex p-2 rounded-full transition-all duration-500 hover:bg-foreground/5" aria-label="Admin">
                <LayoutDashboard size={18} strokeWidth={1.5} />
              </Link>
            )}

            {/* Account */}
            <Link href="/account" className="hidden md:flex p-2 rounded-full transition-all duration-500 hover:bg-foreground/5" aria-label="Account">
              <UserRound size={18} strokeWidth={1.5} />
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 rounded-full transition-all duration-500 hover:bg-foreground/5" aria-label="Cart">
              <ShoppingBag size={18} strokeWidth={1.5} />
              <AnimatePresence>
                {cartItems.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={`absolute top-0 right-0 h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-light shadow-sm bg-accent text-background`}
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
      <nav className="hidden lg:block fixed top-[72px] md:top-[88px] left-0 right-0 z-50 bg-white/60 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="flex items-center justify-center gap-12 py-3">
            {PRODUCT_CATEGORIES.map((category) => (
              <div key={category.label} className="relative">
                {category.hasDropdown ? (
                  <>
                    <button
                      onMouseEnter={() => setDiabetesDropdownOpen(true)}
                      onMouseLeave={() => setDiabetesDropdownOpen(false)}
                      className="text-xs uppercase tracking-tight font-light text-foreground/80 hover:text-foreground transition-all duration-300 flex items-center gap-1.5 group"
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
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-background border border-border rounded-2xl shadow-2xl py-4 min-w-[320px] overflow-hidden"
                        >
                          <div className="px-6 py-2 border-b border-border/50 mb-2">
                            <p className="text-[10px] uppercase tracking-widest text-accent font-medium">{category.label}</p>
                          </div>
                          {category.subLinks.map((subLink) => (
                            <Link
                              key={subLink.label}
                              href={subLink.href}
                              className="block px-6 py-3 hover:bg-muted/30 transition-colors duration-300 group"
                            >
                              <p className="text-sm font-light text-foreground group-hover:text-accent transition-colors">{subLink.label}</p>
                              <p className="text-[10px] text-foreground/40 mt-1 uppercase tracking-wider">{subLink.description}</p>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    href={category.href}
                    className="text-xs uppercase tracking-tight font-light text-foreground/80 hover:text-foreground transition-all duration-300 relative group"
                  >
                    {category.label}
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}
              </div>
            ))}
            <Link
              href="/policy"
              className="text-xs uppercase tracking-tight font-light text-foreground/80 hover:text-foreground transition-all duration-300 relative group"
            >
              Our Policies
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Luxury Full-Screen Mobile Menu */}
      <AnimatePresence mode="wait">
        {openMenu && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] bg-background flex flex-col"
          >
            {/* Header inside Menu */}
            <div className="flex items-center justify-between p-6 md:p-8">
              <Link href="/" className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
            <Image
              src="/assets/logo.png"
              alt="Fiveetatv"
              width={100}
              height={100}
              className={`text-xl md:text-2xl font-display font-medium relative z-10 flex-shrink-0 transition-colors duration-500 text-foreground cursor-pointer`}
            />
          </Link>
              <button 
                onClick={() => setOpenMenu(false)} 
                className="p-3 rounded-full bg-muted text-foreground hover:bg-border transition-all duration-500"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Menu Links */}
            <div className="flex-1 flex flex-col justify-center px-8 md:px-16 overflow-y-auto">
              <nav className="flex flex-col gap-6 py-12">
                {/* Main Links */}
                <div className="flex flex-col gap-4">
                  {NAV_LINKS.map((link, i) => (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setOpenMenu(false)}
                        className="text-2xl md:text-3xl font-display text-foreground hover:text-accent transition-colors"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Categories */}
                <div className="pt-8 border-t border-border/50 flex flex-col gap-4">
                  <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-medium">Shop by Concern</p>
                  {PRODUCT_CATEGORIES.map((category, i) => (
                    <motion.div
                      key={category.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      {category.hasDropdown ? (
                        <div className="flex flex-col gap-3">
                          <button
                            onClick={() => setMobileDiabetesOpen(!mobileDiabetesOpen)}
                            className="text-xl md:text-2xl font-display text-foreground/80 flex items-center gap-3"
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
                                    <p className="text-lg text-foreground/70 group-hover:text-accent transition-colors">{sub.label}</p>
                                    <p className="text-md text-foreground/30 uppercase tracking-widest">{sub.description}</p>
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
                          className="text-xl md:text-2xl font-display text-foreground/80 hover:text-accent transition-colors"
                        >
                          {category.label}
                        </Link>
                      )}
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Link
                      href="/policy"
                      onClick={() => setOpenMenu(false)}
                      className="text-xl md:text-2xl font-display text-foreground/80 hover:text-accent transition-colors"
                    >
                      Our Policies
                    </Link>
                  </motion.div>
                </div>

                {/* Account */}
                <div className="pt-8 border-t border-border/50 flex flex-col gap-4">
                  <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-medium">Account</p>
                  {user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setOpenMenu(false)}
                      className="text-xl font-display text-foreground/70 hover:text-accent transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href="/account"
                    onClick={() => setOpenMenu(false)}
                    className="text-xl font-display text-foreground/70 hover:text-accent transition-colors"
                  >
                    My Account
                  </Link>
                </div>
              </nav>
            </div>

            {/* Footer inside Menu */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="p-8 md:p-16 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6"
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
                <Link href="/account" onClick={() => setOpenMenu(false)} className="text-sm text-foreground/60 hover:text-accent transition-colors duration-300">
                  Account
                </Link>
                {user && (
                  <Link href="/logout" onClick={() => setOpenMenu(false)} className="text-sm text-foreground/60 hover:text-accent transition-colors duration-300">
                    Logout
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link href="/admin" onClick={() => setOpenMenu(false)} className="text-sm text-foreground/60 hover:text-accent transition-colors duration-300">
                    Admin
                  </Link>
                )}
              </div>
              <p className="text-xs text-foreground/40">© 2026 Fiveetatv</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}