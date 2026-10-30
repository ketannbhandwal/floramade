"use client";

import { ReactLenis } from "@studio-freight/react-lenis";

export default function LenisProvider({ children }) {
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
      {children}
    </ReactLenis>
  );
}
