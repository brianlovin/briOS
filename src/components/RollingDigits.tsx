"use client";

import { motion, useReducedMotion } from "motion/react";
import { useCallback, useState } from "react";

import { cn } from "@/lib/utils";

export function DigitColumn({
  digit,
  isIncreasing = true,
}: {
  digit: string;
  isIncreasing?: boolean;
}) {
  const digitValue = parseInt(digit);

  const calculateRotation = useCallback(
    (currentDigit: number, previousDigit: number): number => {
      if (isNaN(currentDigit)) return 0;

      if (previousDigit === currentDigit) {
        return currentDigit * 36;
      }

      let rotationChange = 0;

      if (isIncreasing) {
        if (currentDigit < previousDigit) {
          rotationChange = (10 - previousDigit + currentDigit) * 36;
        } else {
          rotationChange = (currentDigit - previousDigit) * 36;
        }
      } else {
        const diff = currentDigit - previousDigit;
        const wrappedDiff = diff > 5 ? diff - 10 : diff < -5 ? diff + 10 : diff;
        rotationChange = (Math.abs(wrappedDiff) < Math.abs(diff) ? wrappedDiff : diff) * 36;
      }

      return rotationChange;
    },
    [isIncreasing],
  );

  const [cumulativeRotation, setCumulativeRotation] = useState(() => {
    return isNaN(digitValue) ? 0 : digitValue * 36;
  });

  const [lastDigit, setLastDigit] = useState(digitValue);

  if (lastDigit !== digitValue && !isNaN(digitValue)) {
    const rotationChange = calculateRotation(digitValue, lastDigit);
    setCumulativeRotation((prev) => prev + rotationChange);
    setLastDigit(digitValue);
  }

  if (isNaN(digitValue)) {
    return <span className="w-[0.5em] text-center">{digit}</span>;
  }

  const radius = 1.2;

  return (
    <span
      className="relative inline-block h-[1em] w-[0.75em] overflow-hidden"
      style={{ perspective: "200px" }}
    >
      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformStyle: "preserve-3d" }}
        animate={{
          rotateX: cumulativeRotation,
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className="absolute flex h-full w-full items-center justify-center text-center"
            style={{
              transform: `rotateX(${-i * 36}deg) translateZ(${radius}em)`,
              backfaceVisibility: "hidden",
            }}
          >
            {i}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

export function RollingDigits({ value, className }: { value: number; className?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const formatted = new Intl.NumberFormat().format(value);

  if (prefersReducedMotion) {
    return <span className={className}>{formatted}</span>;
  }

  return (
    <span className={cn("inline-flex", className)}>
      {formatted.split("").map((char, i) => {
        const positionFromRight = formatted.length - 1 - i;
        return <DigitColumn key={`pos-${positionFromRight}`} digit={char} isIncreasing />;
      })}
    </span>
  );
}
