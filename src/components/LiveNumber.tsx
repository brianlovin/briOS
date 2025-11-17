"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface LiveNumberProps {
  base: number;
  baseTime: Date;
  rate: number; // units per second
  className?: string;
}

function DigitColumn({ digit, isIncreasing = true }: { digit: string; isIncreasing?: boolean }) {
  const digitValue = parseInt(digit);

  // Calculate rotation based on current and previous digit
  const calculateRotation = useCallback(
    (currentDigit: number, previousDigit: number): number => {
      if (isNaN(currentDigit)) return 0;

      if (previousDigit === currentDigit) {
        return currentDigit * 36;
      }

      let rotationChange = 0;

      if (isIncreasing) {
        // For increasing numbers, always rotate upward
        if (currentDigit < previousDigit) {
          // Wrapping from 9 to 0 - continue upward through the wrap
          rotationChange = (10 - previousDigit + currentDigit) * 36;
        } else {
          // Normal increase
          rotationChange = (currentDigit - previousDigit) * 36;
        }
      } else {
        // For decreasing numbers, use shortest path
        const diff = currentDigit - previousDigit;
        const wrappedDiff = diff > 5 ? diff - 10 : diff < -5 ? diff + 10 : diff;
        rotationChange = (Math.abs(wrappedDiff) < Math.abs(diff) ? wrappedDiff : diff) * 36;
      }

      return rotationChange;
    },
    [isIncreasing],
  );

  const [cumulativeRotation, setCumulativeRotation] = useState(() => {
    // Initial rotation based on digit value
    return isNaN(digitValue) ? 0 : digitValue * 36;
  });

  // Track previous digit to detect changes
  const [lastDigit, setLastDigit] = useState(digitValue);

  // Update rotation when digit changes - using layout effect to avoid intermediate renders
  if (lastDigit !== digitValue && !isNaN(digitValue)) {
    const rotationChange = calculateRotation(digitValue, lastDigit);
    setCumulativeRotation((prev) => prev + rotationChange);
    setLastDigit(digitValue);
  }

  // If it's not a number (like comma), just render it statically
  if (isNaN(digitValue)) {
    return <span className="w-[0.5em] text-center">{digit}</span>;
  }

  // Radius of the cylinder - determines how "deep" the 3D effect looks
  const radius = 1.2; // em units

  return (
    <span
      className="relative inline-block h-[1em] w-[0.75em] overflow-hidden"
      style={{ perspective: "200px" }}
    >
      <motion.div
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
        {/* Render all digits 0-9 positioned around the cylinder */}
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="absolute flex h-full w-full items-center justify-center text-center"
            style={{
              transform: `rotateX(${-i * 36}deg) translateZ(${radius}em)`,
              backfaceVisibility: "hidden",
            }}
          >
            {i}
          </div>
        ))}
      </motion.div>
    </span>
  );
}

export function LiveNumber({ base, baseTime, rate, className }: LiveNumberProps) {
  const compute = useCallback(() => {
    return base + ((Date.now() - baseTime.getTime()) / 1000) * rate;
  }, [base, baseTime, rate]);

  const [value, setValue] = useState(() => compute());
  const [prevValue, setPrevValue] = useState(value);

  const formatted = new Intl.NumberFormat().format(Math.floor(value));
  const isIncreasing = value >= prevValue;

  useEffect(() => {
    const id = setInterval(() => {
      const newValue = compute();
      setPrevValue(value);
      setValue(newValue);
    }, 600); // Give animations time to complete (animation duration is 500ms)
    return () => clearInterval(id);
  }, [compute, value]);

  return (
    <span className={cn("inline-flex font-mono", className)}>
      {formatted.split("").map((char, i) => {
        // Use position from right as key for stability (ones, tens, hundreds, etc.)
        const positionFromRight = formatted.length - 1 - i;

        return (
          <DigitColumn key={`pos-${positionFromRight}`} digit={char} isIncreasing={isIncreasing} />
        );
      })}
    </span>
  );
}
