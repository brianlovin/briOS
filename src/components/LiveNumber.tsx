"use client";

import { useCallback, useEffect, useState } from "react";

import { DigitColumn } from "@/components/RollingDigits";
import { cn } from "@/lib/utils";

interface LiveNumberProps {
  base: number;
  baseTime: Date;
  rate: number; // units per second
  className?: string;
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
