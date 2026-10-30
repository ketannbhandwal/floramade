"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";

function ScrollManager() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    const scrollToTop = () => {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true });
      }
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Immediate scroll reset
    scrollToTop();

    // Secondary frame check after new page DOM paints
    const rafId = requestAnimationFrame(scrollToTop);
    const timerId = setTimeout(scrollToTop, 50);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
    };
  }, [pathname, lenis]);

  return null;
}

export default function LenisProvider({ children }) {
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <ReactLenis 
      root 
      options={{ 
        lerp: 0.1,
        duration: 0.8,
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 0,
        smoothTouch: false,
        infinite: false,
        orientation: "vertical",
        gestureOrientation: "vertical",
      }}
    >
      <ScrollManager />
      {children}
    </ReactLenis>
  );
}
