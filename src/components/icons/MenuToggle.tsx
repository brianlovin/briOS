"use client";

import { motion } from "motion/react";

import { IconProps } from "./types";

interface MenuToggleProps extends IconProps {
  isOpen: boolean;
}

export function MenuToggle({ isOpen, size = 20, ...rest }: MenuToggleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <motion.path
        d="M5 8H19"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        animate={isOpen ? { d: "M6 6L18 18" } : { d: "M5 8H19" }}
        transition={{ duration: 0.2 }}
      />
      <motion.path
        d="M5 16H19"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        animate={isOpen ? { d: "M6 18L18 6" } : { d: "M5 16H19" }}
        transition={{ duration: 0.2 }}
      />
    </svg>
  );
}
