"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "@studio-freight/react-lenis";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";

export default function FloatingLeaf({ 
  type = "single", 
  className = "", 
  delay = 0, 
  blur = false,
  parallaxSpeed = 30
}) {
  const leafSrc = {
    single: "/assets/single-leaf.svg",
    double: "/assets/double-leaf.svg",
    branch: "/assets/leaf-branch.svg"
  }[type];

  const controls = useAnimation();
  const ref = useRef(null);
  const lenis = useLenis();
  
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);
  const scale = useMotionValue(1);
  
  const smoothY = useTransform(y, (value) => value * 0.5);
  const smoothRotate = useTransform(rotate, (value) => value * 0.3);
  const smoothScale = useTransform(scale, (value) => 1 + value * 0.05);

  useEffect(() => {
    const sway = async () => {
      await controls.start({
        y: [0, -8, 3, -5, 0],
        rotate: [0, 3, -2, 4, 0],
        scale: [1, 1.02, 0.98, 1.01, 1],
        transition: {
          duration: 8 + delay * 3,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.25, 0.5, 0.75, 1],
        }
      });
    };
    sway();
  }, [delay, controls]);

  useEffect(() => {
    if (!lenis) return;
    
    const onScroll = ({ scroll }) => {
      const parallaxOffset = scroll * parallaxSpeed * 0.001;
      y.set(parallaxOffset);
      rotate.set(Math.sin(scroll * 0.002 + delay) * 2);
    };
    
    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis, parallaxSpeed, delay, y, rotate]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: blur ? 0.35 : 0.65, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94], delay }}
      className={`absolute pointer-events-none z-0 ${className} ${blur ? 'blur-[2px]' : ''}`}
      style={{ willChange: 'transform', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.08))' }}
    >
      <motion.div
        animate={controls}
        style={{ 
          y: smoothY, 
          rotate: smoothRotate, 
          scale: smoothScale,
          willChange: 'transform' 
        }}
        className="w-full h-full relative"
      >
        <Image 
          src={leafSrc} 
          alt="Leaf decoration" 
          fill 
          className="object-contain"
          style={{ filter: 'saturate(1.1) brightness(1.02)' }}
        />
      </motion.div>
    </motion.div>
  );
}