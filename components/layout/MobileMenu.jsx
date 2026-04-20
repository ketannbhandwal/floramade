"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { NAV_LINKS, SEARCH_PAGES } from "@/components/layout/nav-config";
import Input from "@/components/ui/Input";

export default function MobileMenu({ open, onClose, user, logout }) {
  const [query, setQuery] = useState("");

  const filteredPages = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return SEARCH_PAGES.slice(0, 5);
    return SEARCH_PAGES.filter((page) => page.title.toLowerCase().includes(q));
  }, [query]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[55] bg-black/20 backdrop-blur-sm md:hidden"
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-0 left-0 top-0 z-[60] w-[86%] max-w-[350px] border-r border-[#dce7bf] bg-[#fbfcf4] p-6 md:hidden"
          >
            <div className="mb-7 flex items-center justify-between">
              <p className="font-display text-2xl text-[#3e5c32]">Fiveetatva</p>
              <button type="button" onClick={onClose} className="rounded-lg border border-[#dbe8bf] p-1.5 text-[#4f6245]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-6">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search pages..."
                className="w-full bg-white"
                icon={<Search className="h-4 w-4 text-[#79936d]" />}
              />
              <div className="mt-2 space-y-2">
                {filteredPages.slice(0, 4).map((page) => (
                  <Link
                    key={page.href}
                    href={page.href}
                    onClick={onClose}
                    className="block rounded-xl border border-[#e4edca] bg-white px-3 py-2 text-sm text-[#4d6242]"
                  >
                    {page.title}
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-4 text-lg text-[#4d6242]">
              {NAV_LINKS.map((item) => (
                <Link key={item.href} href={item.href} onClick={onClose}>
                  {item.label}
                </Link>
              ))}
              <Link href={user ? "/account" : "/login"} onClick={onClose}>Account</Link>
              {user?.role === "admin" ? <Link href="/admin" onClick={onClose}>Admin</Link> : null}
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="text-left"
                >
                  Logout
                </button>
              ) : null}
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
