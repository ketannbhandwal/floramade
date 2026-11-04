"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, ArrowLeft, ArrowRight, Sparkles, Loader2, Package, TrendingUp } from "lucide-react";

const QUICK_TAGS = [
  "Pilecurex Kit",
  "MadhuCurex",
  "Liver Detox",
  "Paachan Sathi",
  "Diabetes Care"
];

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [defaultProducts, setDefaultProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const closeSearch = useCallback(() => {
    setQuery("");
    setProducts([]);
    onClose();
  }, [onClose]);

  // Lock body scroll when search is open on both mobile & desktop
  useEffect(() => {
    if (open) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [open]);

  // Focus input on open & load default products for instant visual feedback
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);

      if (defaultProducts.length === 0) {
        fetch("/api/products")
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data.products)) {
              setDefaultProducts(data.products.slice(0, 4));
            }
          })
          .catch(() => {});
      }
    }
  }, [open, defaultProducts.length]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) closeSearch();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, closeSearch]);

  // Debounced search logic
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(Array.isArray(data) ? data.slice(0, 6) : []);
        } else {
          const res = await fetch("/api/products");
          const data = await res.json();
          const filtered = (data.products || []).filter((p) =>
            p.name?.toLowerCase().includes(trimmed.toLowerCase()) ||
            p.category?.toLowerCase().includes(trimmed.toLowerCase())
          ).slice(0, 6);
          setProducts(filtered);
        }
      } catch (err) {
        console.error("Search failed:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [query]);

  const displayList = query.trim().length >= 2 ? products : defaultProducts;
  const isSearchActive = query.trim().length >= 2;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex flex-col sm:items-center sm:justify-start sm:p-4 sm:pt-16">
          {/* Dark Backdrop: visible on tablet/desktop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeSearch}
            className="hidden sm:block fixed inset-0 bg-black/65 backdrop-blur-xs cursor-pointer -z-10"
          />

          {/* Modal Card: Full Screen on Mobile (100dvh, zero leak), centered floating modal on sm+ */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full sm:h-auto sm:max-h-[85vh] sm:max-w-xl md:max-w-2xl bg-white sm:rounded-3xl sm:border sm:border-[#C5D5E8] sm:shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header / Input Row */}
            <div className="sticky top-0 z-10 flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-5 py-3 sm:py-4 bg-white sm:bg-[#F7F9FC] border-b border-[#C5D5E8]">
              {/* Mobile Back Button */}
              <button
                type="button"
                onClick={closeSearch}
                className="sm:hidden p-1.5 -ml-1 text-[#142B49] hover:bg-black/5 rounded-full cursor-pointer transition-colors"
                aria-label="Back"
              >
                <ArrowLeft size={20} />
              </button>

              {/* Search Input Box */}
              <div className="flex-1 flex items-center gap-2 px-3 py-2 sm:py-2.5 rounded-xl bg-[#F7F9FC] sm:bg-white border border-[#C5D5E8] focus-within:border-[#142B49] focus-within:ring-1 focus-within:ring-[#142B49] transition-all">
                <Search size={18} className="text-[#142B49] shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search remedies, kits..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm sm:text-base text-[#1A2332] placeholder:text-[#1A2332]/45 outline-none font-medium min-w-0"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="p-1 rounded-full text-[#1A2332]/50 hover:text-[#142B49] hover:bg-black/5 transition-colors shrink-0 cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Desktop Close Button */}
              <button
                type="button"
                onClick={closeSearch}
                className="hidden sm:flex w-8 h-8 rounded-full bg-[#142B49]/10 hover:bg-[#142B49] text-[#142B49] hover:text-white items-center justify-center transition-colors shrink-0 cursor-pointer"
                aria-label="Close search"
              >
                <X size={17} />
              </button>

              {/* Mobile Cancel Button */}
              <button
                type="button"
                onClick={closeSearch}
                className="sm:hidden text-xs font-bold text-[#142B49] hover:text-[#D9A441] px-1 py-1 transition-colors cursor-pointer shrink-0"
              >
                Cancel
              </button>
            </div>

            {/* Scrollable Results Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 divide-y divide-[#C5D5E8]/60 bg-white">
              
              {/* 1. Quick Popular Tags */}
              {!isSearchActive && (
                <div className="space-y-2">
                  <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#142B49] flex items-center gap-1.5">
                    <Sparkles size={12} className="text-[#D9A441]" />
                    <span>Popular Searches</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setQuery(tag)}
                        className="px-3 py-1.5 rounded-full bg-[#F7F9FC] hover:bg-[#142B49] text-xs font-semibold text-[#1A2332] hover:text-white border border-[#C5D5E8] transition-all cursor-pointer shadow-2xs hover:scale-102 active:scale-98"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Product Results / Recommended Section */}
              <div className={!isSearchActive ? "pt-3.5 space-y-2.5" : "space-y-2.5"}>
                <div className="flex items-center justify-between">
                  <h3 className="text-[10.5px] font-bold uppercase tracking-wider text-[#142B49] flex items-center gap-1.5">
                    {isSearchActive ? (
                      <>
                        <Package size={13} />
                        <span>Matching Products {products.length > 0 ? `(${products.length})` : ""}</span>
                      </>
                    ) : (
                      <>
                        <TrendingUp size={13} className="text-[#D9A441]" />
                        <span>Featured Remedies</span>
                      </>
                    )}
                  </h3>
                  
                  {displayList.length > 0 && (
                    <Link
                      href="/collection"
                      onClick={closeSearch}
                      className="text-[11px] font-bold text-[#142B49] hover:underline flex items-center gap-1"
                    >
                      <span>View all</span>
                      <ArrowRight size={11} />
                    </Link>
                  )}
                </div>

                {loading ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-2 text-xs text-[#142B49]">
                    <Loader2 size={22} className="animate-spin text-[#142B49]" />
                    <span className="font-medium">Searching authentic Ayurvedic remedies...</span>
                  </div>
                ) : displayList.length > 0 ? (
                  <div className="space-y-2">
                    {displayList.map((product) => {
                      const img = product.images?.[0] || product.featureImages?.[0] || product.formulaimage || "/placeholder.png";
                      const price = Number(product.discountPrice || product.price || 0);
                      const regular = Number(product.price || price);
                      const hasDiscount = regular > price;

                      return (
                        <Link
                          key={product._id || product.slug}
                          href={`/product/${product.slug}`}
                          onClick={closeSearch}
                          className="group flex items-center gap-3 p-2 sm:p-2.5 rounded-2xl bg-[#F7F9FC]/70 hover:bg-[#F7F9FC] border border-[#C5D5E8]/70 hover:border-[#142B49]/40 transition-all shadow-2xs"
                        >
                          <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-white border border-[#C5D5E8]/80 overflow-hidden shrink-0">
                            <Image
                              src={img}
                              alt={product.name}
                              fill
                              sizes="56px"
                              className="object-contain p-1 group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex-1 min-w-0 space-y-0.5">
                            <h4 className="text-xs sm:text-sm font-bold text-[#1A2332] group-hover:text-[#142B49] transition-colors truncate">
                              {product.name}
                            </h4>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs sm:text-sm font-bold text-[#142B49]">
                                ₹{price.toLocaleString("en-IN")}
                              </span>
                              {hasDiscount && (
                                <span className="text-[11px] text-[#1A2332]/45 line-through">
                                  ₹{regular.toLocaleString("en-IN")}
                                </span>
                              )}
                              {product.category && (
                                <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#142B49]/10 text-[#142B49] font-medium">
                                  {product.category}
                                </span>
                              )}
                            </div>
                          </div>
                          <ArrowRight size={14} className="text-[#1A2332]/35 group-hover:text-[#142B49] group-hover:translate-x-0.5 transition-all shrink-0 mr-1" />
                        </Link>
                      );
                    })}
                  </div>
                ) : isSearchActive ? (
                  <div className="py-6 text-center space-y-2">
                    <p className="text-xs sm:text-sm text-[#1A2332]/70">
                      No products matched &ldquo;<strong>{query}</strong>&rdquo;.
                    </p>
                    <Link
                      href="/collection"
                      onClick={closeSearch}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#142B49] hover:underline"
                    >
                      <span>Browse complete catalog</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                ) : null}
              </div>

              {/* 3. Compact Navigation Shortcuts */}
              <div className="pt-3.5 space-y-2">
                <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#142B49]">
                  Quick Links
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Link
                    href="/collection"
                    onClick={closeSearch}
                    className="px-3 py-1.5 rounded-xl bg-[#F7F9FC] hover:bg-[#142B49] text-xs font-semibold text-[#1A2332] hover:text-white border border-[#C5D5E8] transition-all"
                  >
                    All Products →
                  </Link>
                  <Link
                    href="/about"
                    onClick={closeSearch}
                    className="px-3 py-1.5 rounded-xl bg-[#F7F9FC] hover:bg-[#142B49] text-xs font-semibold text-[#1A2332] hover:text-white border border-[#C5D5E8] transition-all"
                  >
                    About Us →
                  </Link>
                  <Link
                    href="/contact"
                    onClick={closeSearch}
                    className="px-3 py-1.5 rounded-xl bg-[#F7F9FC] hover:bg-[#142B49] text-xs font-semibold text-[#1A2332] hover:text-white border border-[#C5D5E8] transition-all"
                  >
                    Contact Support →
                  </Link>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
