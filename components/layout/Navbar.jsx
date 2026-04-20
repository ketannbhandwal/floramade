"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { Menu, ShoppingBag, UserRound, X, Search, LayoutDashboard, Heart } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { user } = useAuth();
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [productsOpen, setProductsOpen] = useState(false);

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
    { 
      label: "Products", 
      hasDropdown: true,
      subLinks: [
        { label: "MadhuCurex Powder", href: "/product/madhucurex-powder", description: "For Sugar" },
        { label: "MadhuCurex Capsule", href: "/product/madhucurex-capsules", description: "For Sugar" },
        { label: "Paachan Sathi Powder", href: "/product/paachan-sathi-powder", description: "For Digestion" },
      ]
    },
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
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-background/90 backdrop-blur-xl shadow-sm' : hasDarkHero ? 'bg-transparent' : 'bg-background/90 backdrop-blur-xl'}`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 md:py-6 flex items-center justify-between gap-4 md:gap-8">
          {/* Logo */}
          <Image 
            src="/assets/logo.png" 
            alt="Fiveetatva" 
            width={110}
            height={110}
            className={`text-xl md:text-2xl font-display font-medium relative z-10 flex-shrink-0 transition-colors duration-500 ${textColor}`}
          />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((link) => (
              <div key={link.label} className="relative">
                {link.hasDropdown ? (
                  <>
                    <button
                      onClick={() => setProductsOpen(!productsOpen)}
                      className={`text-xs uppercase tracking-tight font-light transition-all duration-500 ${mutedTextColor} flex items-center gap-1`}
                    >
                      {link.label}
                      <span className={`transition-transform duration-300 ${productsOpen ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    <AnimatePresence>
                      {productsOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="absolute top-full left-0 mt-4 bg-background/90 backdrop-blur-xl border border-border rounded-2xl shadow-2xl py-4 min-w-[280px] overflow-hidden"
                        >
                          {link.subLinks.map((subLink) => (
                            <Link
                              key={subLink.label}
                              href={subLink.href}
                              className="block px-6 py-3 hover:bg-muted/50 transition-colors duration-300"
                            >
                              <p className="text-sm font-light text-foreground">{subLink.label}</p>
                              <p className="text-xs text-foreground/50 mt-1">{subLink.description}</p>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className={`text-xs uppercase tracking-tight font-light transition-all duration-500 ${mutedTextColor}`}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Icons Right */}
          <div className={`flex items-center gap-2 md:gap-3 flex-shrink-0 transition-colors duration-500 ${textColor}`}>
            
            {/* Search */}
            <div className="flex items-center relative">
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="overflow-hidden absolute right-8 top-1/2 -translate-y-1/2"
                  >
                    <form onSubmit={handleSearch} className="flex items-center">
                      <input
                        autoFocus
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`bg-transparent border-b py-1 text-sm outline-none w-full pr-2 transition-colors ${
                          isLightText 
                            ? 'border-white/30 text-white placeholder:text-white/50' 
                            : 'border-border text-foreground placeholder:text-foreground/40'
                        }`}
                      />
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2 rounded-full transition-all duration-500 hover:bg-foreground/5 z-10`}
                aria-label="Search"
              >
                {searchOpen ? <X size={18} strokeWidth={1.5} /> : <Search size={18} strokeWidth={1.5} />}
              </button>
            </div>

            {/* Account */}
            <Link href="/account" className="flex p-2 rounded-full transition-all duration-500 hover:bg-foreground/5" aria-label="Account">
              <UserRound size={18} strokeWidth={1.5} />
            </Link>
            {/* Admin */}
            {user?.role === 'admin' && (
              <Link href="/admin" className="flex p-2 rounded-full transition-all duration-500 hover:bg-foreground/5" aria-label="Admin">
                <LayoutDashboard size={18} strokeWidth={1.5} />
              </Link>
            )}
            {/* Cart */}
            <Link href="/cart" className="relative p-2 rounded-full transition-all duration-500 hover:bg-foreground/5" aria-label="Cart">
              <ShoppingBag size={18} strokeWidth={1.5} />
              <AnimatePresence>
                {cartItems.length > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={`absolute top-0 right-0 h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-light shadow-sm ${badgeBg}`}
                  >
                    {cartItems.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setOpenMenu(true)} 
              className="lg:hidden p-2 -mr-2 rounded-full transition-all duration-500 hover:bg-foreground/5"
              aria-label="Menu"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Luxury Full-Screen Mobile Menu */}
      <AnimatePresence>
        {openMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] bg-background flex flex-col"
          >
            {/* Header inside Menu */}
            <div className="flex items-center justify-between p-6 md:p-8">
              <span className="text-2xl font-display text-foreground">Fiveetatva.</span>
              <button 
                onClick={() => setOpenMenu(false)} 
                className="p-3 rounded-full bg-muted text-foreground hover:bg-border transition-all duration-500"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Menu Links */}
            <div className="flex-1 flex flex-col justify-center px-8 md:px-16">
              <nav className="flex flex-col gap-4 md:gap-6">
                {NAV_LINKS.map((link, i) => (
                  <div key={link.label} className="overflow-hidden">
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{ 
                        duration: 0.7, 
                        delay: 0.1 + i * 0.1,
                        ease: [0.22, 1, 0.36, 1] 
                      }}
                    >
                      {link.hasDropdown ? (
                        <div>
                          <button
                            onClick={() => setProductsOpen(!productsOpen)}
                            className="text-4xl md:text-6xl font-display text-foreground hover:text-accent transition-colors duration-500 flex items-center gap-4"
                          >
                            {link.label}
                            <span className={`text-2xl transition-transform duration-300 ${productsOpen ? 'rotate-180' : ''}`}>▼</span>
                          </button>
                          <AnimatePresence>
                            {productsOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden pl-4 mt-4 space-y-4"
                              >
                                {link.subLinks.map((subLink) => (
                                  <Link
                                    key={subLink.label}
                                    href={subLink.href}
                                    onClick={() => setOpenMenu(false)}
                                    className="block text-xl md:text-2xl font-light text-foreground/70 hover:text-accent transition-colors duration-300"
                                  >
                                    {subLink.label}
                                    <span className="block text-sm text-foreground/40 mt-1">{subLink.description}</span>
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={link.href}
                          onClick={() => setOpenMenu(false)}
                          className="text-4xl md:text-6xl font-display text-foreground hover:text-accent transition-colors duration-500 block"
                        >
                          {link.label}
                        </Link>
                      )}
                    </motion.div>
                  </div>
                ))}
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
              <p className="text-xs text-foreground/40">© 2024 Fiveetatva</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}