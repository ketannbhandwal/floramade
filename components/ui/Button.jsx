"use client";

import clsx from "clsx";
import { motion } from "framer-motion";

const variants = {
  primary:
    "bg-foreground text-background hover:bg-primary hover:text-[#17140f] transition-colors duration-[0.35s]",
  secondary: 
    "bg-primary text-[#17140f] hover:bg-highlight transition-colors duration-[0.35s]",
  outline: 
    "border border-accent/40 bg-transparent text-foreground hover:border-accent hover:bg-accent/10 transition-colors duration-[0.35s]",
  danger: 
    "bg-red-500/90 text-white hover:bg-red-600 transition-colors duration-[0.6s]",
};

export default function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  disabled,
  children,
  ...props
}) {
  const sizes = {
    sm: "h-10 px-6 text-[10px]",
    md: "h-12 px-10 text-[11px]",
    lg: "h-14 px-12 text-xs",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      disabled={disabled}
      className={clsx(
        "inline-flex items-center justify-center gap-3 font-medium uppercase tracking-[0.2em] disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden relative group rounded-full",
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
