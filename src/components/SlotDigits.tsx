"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const SLOT_DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0] as const;
const SLOT_DURATION_MS = 280;

/** Wrap 9 → 0 forward onto the duplicate 0 instead of rewinding through 8…1. */
export function nextSlotOffset(from: number, to: number): number {
  if (from === 9 && to === 0) return 10;
  return to;
}

function SlotDigit({ digit }: { digit: number }) {
  const [offset, setOffset] = useState(digit);
  const [animate, setAnimate] = useState(false);
  const [lastDigit, setLastDigit] = useState(digit);

  if (lastDigit !== digit) {
    setAnimate(true);
    setOffset(nextSlotOffset(lastDigit, digit));
    setLastDigit(digit);
  }

  useEffect(() => {
    if (offset < 10) return;

    const id = window.setTimeout(() => {
      setAnimate(false);
      setOffset(0);
    }, SLOT_DURATION_MS);
    return () => window.clearTimeout(id);
  }, [offset]);

  return (
    <span
      data-slot-digit
      className="relative inline-block h-[1em] w-[0.65em] overflow-hidden align-baseline leading-none"
    >
      <span
        className={cn("flex flex-col", animate && "ease-out [transition:transform_280ms]")}
        style={{ transform: `translateY(-${offset}em)` }}
      >
        {SLOT_DIGITS.map((n, i) => (
          <span
            key={i}
            className="flex h-[1em] w-full items-center justify-center leading-none"
            aria-hidden
          >
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

export function SlotDigits({ value, className }: { value: number; className?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const formatted = String(value);

  if (prefersReducedMotion) {
    return <span className={className}>{formatted}</span>;
  }

  return (
    <span
      data-slot-digits
      aria-hidden
      className={cn("inline-flex h-[1em] items-center overflow-hidden leading-none", className)}
    >
      {formatted.split("").map((char, i) => {
        const positionFromRight = formatted.length - 1 - i;
        const n = Number(char);
        if (Number.isNaN(n)) {
          return (
            <span key={`sep-${positionFromRight}`} className="leading-none">
              {char}
            </span>
          );
        }
        return <SlotDigit key={`pos-${positionFromRight}`} digit={n} />;
      })}
    </span>
  );
}
