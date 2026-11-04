"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, ArrowRight, Sparkles, Loader2, Package } from "lucide-react";
import { SEARCH_PAGES } from "@/components/layout/nav-config";

const QUICK_SEARCH_TAGS = [
  "Pilecurex Kit",
  "Madhucurex",
  "Liver Detox",
  "Paachan Sathi",
  "Diabetes Care",
  "All Products"
];

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  
  const closeSearch = useCallback(() => {
    setQuery("");
    setProducts([]);
    onClose();
  }, [onClose]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) {
        closeSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, closeSearch]);

  // Handle Search Logic with Debounce
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
          // Fallback to /api/products
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
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const matchedPages = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return SEARCH_PAGES.slice(0, 3);
    return SEARCH_PAGES.filter((page) => 
      page.title.toLowerCase().includes(trimmed) ||
      page.description?.toLowerCase().includes(trimmed)
    ).slice(0, 4);
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeSearch}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Centered Modal Container (Safe on all mobile & desktop screens) */}
          <div className="min-h-full w-full flex items-start justify-center p-3 sm:p-6 pt-12 sm:pt-20 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -16 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl overflow-hidden rounded-2xl sm:rounded-3xl border border-[#C5D5E8] bg-white shadow-2xl pointer-events-auto flex flex-col max-h-[82vh]"
            >
              {/* Top Search Input Bar */}
              <div className="relative flex items-center gap-3 border-b border-[#C5D5E8]/80 px-4 sm:px-6 py-3.5 sm:py-4.5 bg-[#F7F9FC]">
                <Search className="h-5 w-5 sm:h-6 sm:w-6 text-[#142B49] shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search Floramade remedies, kits, powders..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm sm:text-base text-[#1A2332] placeholder:text-[#1A2332]/45 outline-none font-medium"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="p-1 rounded-full text-[#1A2332]/50 hover:text-[#142B49] hover:bg-black/5 transition-colors cursor-pointer"
                    aria-label="Clear input"
                  >
                    <X size={18} />
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={closeSearch}
                  className="px-2.5 py-1 rounded-full text-xs font-bold text-[#142B49] bg-[#142B49]/10 hover:bg-[#142B49] hover:text-white transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>

              {/* Scrollable Results Content */}
              <div className="overflow-y-auto p-4 sm:p-6 space-y-5 divide-y divide-[#C5D5E8]/60">
                
                {/* 1. Quick Suggestion Pills (Shown when query is empty or short) */}
                {query.trim().length < 2 && (
                  <div className="space-y-2.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#142B49] flex items-center gap-1.5">
                      <Sparkles size={12} className="text-[#D9A441]" />
                      <span>Popular Remedies</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {QUICK_SEARCH_TAGS.map((tag) => (
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

                {/* 2. Product Results */}
                <div className={query.trim().length < 2 ? "pt-4" : ""}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#142B49] flex items-center gap-1.5">
                      <Package size={13} />
                      <span>Products {products.length > 0 ? `(${products.length})` : ""}</span>
                    </h3>
                    {products.length > 0 && (
                      <Link
                        href={`/collection?q=${encodeURIComponent(query)}`}
                        onClick={closeSearch}
                        className="text-xs font-bold text-[#142B49] hover:text-[#0E1F36] hover:underline flex items-center gap-1"
                      >
                        <span>View all in collection</span>
                        <ArrowRight size={12} />
                      </Link>
                    )}
                  </div>

                  {loading ? (
                    <div className="py-8 flex flex-col items-center justify-center gap-2 text-xs text-[#142B49]">
                      <Loader2 size={24} className="animate-spin text-[#142B49]" />
                      <span className="font-medium">Searching authentic Ayurvedic remedies...</span>
                    </div>
                  ) : products.length > 0 ? (
                    <div className="space-y-2">
                      {products.map((product) => {
                        const img = product.images?.[0] || product.featureImages?.[0] || product.formulaimage || "/placeholder.png";
                        const price = Number(product.discountPrice || product.price || 0);
                        const regular = Number(product.price || price);
                        const hasDiscount = regular > price;

                        return (
                          <Link
                            key={product._id || product.slug}
                            href={`/product/${product.slug}`}
                            onClick={closeSearch}
                            className="group flex items-center gap-3 sm:gap-4 p-2.5 rounded-2xl bg-white hover:bg-[#F7F9FC] border border-[#C5D5E8]/60 hover:border-[#142B49]/40 transition-all shadow-2xs"
                          >
                            <div className="relative h-14 w-14 rounded-xl bg-white border border-[#C5D5E8]/80 overflow-hidden shrink-0">
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
                            <ArrowRight size={15} className="text-[#1A2332]/40 group-hover:text-[#142B49] group-hover:translate-x-1 transition-all shrink-0 mr-1" />
                          </Link>
                        );
                      })}
                    </div>
                  ) : query.trim().length >= 2 ? (
                    <div className="py-6 text-center space-y-2">
                      <p className="text-xs sm:text-sm text-[#1A2332]/70">
                        No products matched &ldquo;<strong>{query}</strong>&rdquo;.
                      </p>
                      <Link
                        href="/collection"
                        onClick={closeSearch}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#142B49] hover:underline"
                      >
                        <span>Browse complete collection</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  ) : null}
                </div>

                {/* 3. Quick Links Section */}
                <div className="pt-4 space-y-2">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#142B49]">
                    Quick Navigation
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchedPages.map((page) => (
                      <Link
                        key={page.href}
                        href={page.href}
                        onClick={closeSearch}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F7F9FC] border border-transparent hover:border-[#C5D5E8] transition-all group"
                      >
                        <div>
                          <p className="text-xs font-semibold text-[#1A2332] group-hover:text-[#142B49] transition-colors">
                            {page.title}
                          </p>
                          {page.description && (
                            <p className="text-[11px] text-[#1A2332]/55 line-clamp-1">
                              {page.description}
                            </p>
                          )}
                        </div>
                        <ArrowRight size={13} className="text-[#1A2332]/35 group-hover:text-[#142B49] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                      </Link>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
