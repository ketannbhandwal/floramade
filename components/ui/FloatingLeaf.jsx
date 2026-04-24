"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export default function FloatingLeaf({ 
  type = "single", 
  className = "", 
  delay = 0, 
  blur = false,
  parallaxSpeed = 50 // positive for down, negative for up
}) {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Parallax effect tied to scroll
  const y = useTransform(scrollYProgress, [0, 1], [-parallaxSpeed, parallaxSpeed]);

  const leafSrc = {
    single: "/assets/single-leaf.svg",
    double: "/assets/double-leaf.svg",
    branch: "/assets/leaf-branch.svg"
  }[type];

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
      whileInView={{ opacity: blur ? 0.5 : 0.8, scale: 1, rotate: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.2, ease: "easeOut", delay }}
      className={`absolute pointer-events-none z-0 ${className} ${blur ? 'blur-[3px]' : ''} will-change-transform`}
    >
      <motion.div
        animate={{
          y: ["-5%", "5%", "-5%"],
          rotate: ["-4deg", "4deg", "-4deg"],
        }}
        transition={{
          duration: 6 + (delay * 2), // random-ish duration based on delay
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-full h-full relative will-change-transform"
      >
        <Image src={leafSrc} alt="Leaf decoration" fill className="object-contain" />
      </motion.div>
    </motion.div>
  );
}