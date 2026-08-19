"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import type { PointerEvent } from "react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  clamp,
  formatDialValue,
  hashMarkPercents,
  percentFromValue,
  roundValue,
  snapClickValue,
} from "@/lib/dial-slider";
import { cn } from "@/lib/utils";

const CLICK_THRESHOLD = 3;
const DEAD_ZONE = 32;
const MAX_CURSOR_RANGE = 200;
const MAX_STRETCH = 8;
const HANDLE_BUFFER = 8;
const LABEL_CSS_LEFT = 10;
const VALUE_CSS_RIGHT = 10;

export function DialSlider({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const valueSpanRef = useRef<HTMLSpanElement>(null);
  const hoverTimeoutRef = useRef<number | null>(null);
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);
  const isClickRef = useRef(true);
  const animRef = useRef<{ stop: () => void } | null>(null);
  const wrapperRectRef = useRef<DOMRect | null>(null);
  const scaleRef = useRef(1);
  const reduceMotion = useReducedMotion();

  const [isInteracting, setIsInteracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isValueEditable, setIsValueEditable] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [leftThreshold, setLeftThreshold] = useState(30);
  const [rightThreshold, setRightThreshold] = useState(78);

  const percentage = percentFromValue(value, min, max);
  const isActive = isInteracting || isHovered;
  const displayValue = formatDialValue(value, step);
  const marks = hashMarkPercents(min, max, step);

  const fillPercent = useMotionValue(percentage);
  const fillWidth = useTransform(fillPercent, (pct) => `${pct}%`);
  const handleLeft = useTransform(fillPercent, (pct) => `max(5px, calc(${pct}% - 9px))`);
  const rubberStretchPx = useMotionValue(0);
  const rubberBandWidth = useTransform(
    rubberStretchPx,
    (stretch) => `calc(100% + ${Math.abs(stretch)}px)`,
  );
  const rubberBandX = useTransform(rubberStretchPx, (stretch) => (stretch < 0 ? stretch : 0));

  useEffect(() => {
    if (!isInteracting && !animRef.current) {
      fillPercent.jump(percentage);
    }
  }, [fillPercent, isInteracting, percentage]);

  useLayoutEffect(() => {
    const trackWidth = wrapperRef.current?.offsetWidth;
    if (!trackWidth) return;
    if (labelRef.current) {
      setLeftThreshold(
        ((LABEL_CSS_LEFT + labelRef.current.offsetWidth + HANDLE_BUFFER) / trackWidth) * 100,
      );
    }
    if (valueSpanRef.current) {
      setRightThreshold(
        ((trackWidth - VALUE_CSS_RIGHT - valueSpanRef.current.offsetWidth - HANDLE_BUFFER) /
          trackWidth) *
          100,
      );
    }
  }, [displayValue, label, showInput]);

  const positionToValue = useCallback(
    (clientX: number) => {
      const rect = wrapperRectRef.current;
      if (!rect) return value;
      const nativeWidth = wrapperRef.current ? wrapperRef.current.offsetWidth : rect.width;
      const percent = clamp((clientX - rect.left) / scaleRef.current / nativeWidth, 0, 1);
      return min + percent * (max - min);
    },
    [max, min, value],
  );

  const computeRubberStretch = useCallback((clientX: number, sign: -1 | 1) => {
    const rect = wrapperRectRef.current;
    if (!rect) return 0;
    const distancePast = sign < 0 ? rect.left - clientX : clientX - rect.right;
    const overflow = Math.max(0, distancePast - DEAD_ZONE);
    return sign * MAX_STRETCH * Math.sqrt(Math.min(overflow / MAX_CURSOR_RANGE, 1));
  }, []);

  const commitValue = useCallback(
    (next: number) => {
      onChange(roundValue(clamp(next, min, max), step));
    },
    [max, min, onChange, step],
  );

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (showInput) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      pointerDownPos.current = { x: event.clientX, y: event.clientY };
      isClickRef.current = true;
      setIsInteracting(true);
      if (wrapperRef.current) {
        wrapperRectRef.current = wrapperRef.current.getBoundingClientRect();
        scaleRef.current = wrapperRectRef.current.width / wrapperRef.current.offsetWidth;
      }
    },
    [showInput],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!isInteracting || !pointerDownPos.current) return;
      const dx = event.clientX - pointerDownPos.current.x;
      const dy = event.clientY - pointerDownPos.current.y;
      if (isClickRef.current && Math.hypot(dx, dy) > CLICK_THRESHOLD) {
        isClickRef.current = false;
        setIsDragging(true);
      }
      if (isClickRef.current) return;

      const rect = wrapperRectRef.current;
      if (rect) {
        if (event.clientX < rect.left)
          rubberStretchPx.jump(computeRubberStretch(event.clientX, -1));
        else if (event.clientX > rect.right)
          rubberStretchPx.jump(computeRubberStretch(event.clientX, 1));
        else rubberStretchPx.jump(0);
      }

      const next = positionToValue(event.clientX);
      animRef.current?.stop();
      animRef.current = null;
      fillPercent.jump(percentFromValue(next, min, max));
      commitValue(next);
    },
    [
      commitValue,
      computeRubberStretch,
      fillPercent,
      isInteracting,
      max,
      min,
      positionToValue,
      rubberStretchPx,
    ],
  );

  const handlePointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!isInteracting) return;
      if (isClickRef.current) {
        const snapped = snapClickValue(positionToValue(event.clientX), min, max, step);
        const nextPct = percentFromValue(snapped, min, max);
        animRef.current?.stop();
        if (reduceMotion) {
          fillPercent.jump(nextPct);
          animRef.current = null;
        } else {
          animRef.current = animate(fillPercent, nextPct, {
            type: "spring",
            stiffness: 300,
            damping: 25,
            mass: 0.8,
            onComplete: () => {
              animRef.current = null;
            },
          });
        }
        commitValue(snapped);
      }
      if (rubberStretchPx.get() !== 0) {
        if (reduceMotion) rubberStretchPx.jump(0);
        else {
          animate(rubberStretchPx, 0, {
            type: "spring",
            visualDuration: 0.35,
            bounce: 0.15,
          });
        }
      }
      setIsInteracting(false);
      setIsDragging(false);
      pointerDownPos.current = null;
    },
    [
      commitValue,
      fillPercent,
      isInteracting,
      max,
      min,
      positionToValue,
      reduceMotion,
      rubberStretchPx,
      step,
    ],
  );

  const clearHoverTimeout = useCallback(() => {
    if (hoverTimeoutRef.current) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (showInput) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [showInput]);

  useEffect(() => () => clearHoverTimeout(), [clearHoverTimeout]);

  const submitInput = () => {
    const parsed = Number.parseFloat(inputValue);
    if (Number.isFinite(parsed)) commitValue(parsed);
    setShowInput(false);
    setIsValueEditable(false);
  };

  const valueDodge = percentage < leftThreshold || percentage > rightThreshold;
  const handleOpacity = !isActive ? 0 : valueDodge ? 0.1 : isDragging ? 0.9 : 0.5;

  return (
    <div ref={wrapperRef} className="relative h-9">
      <motion.div
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={displayValue}
        data-active={isActive || undefined}
        className="group absolute top-0 left-0 h-full w-full cursor-pointer touch-none overflow-hidden rounded-lg bg-black/[0.04] select-none dark:bg-white/5"
        style={{ width: rubberBandWidth, x: rubberBandX }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onKeyDown={(event) => {
          const coarse = step * 10;
          if (event.key === "ArrowRight" || event.key === "ArrowUp") {
            event.preventDefault();
            commitValue(value + (event.shiftKey ? coarse : step));
          } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
            event.preventDefault();
            commitValue(value - (event.shiftKey ? coarse : step));
          } else if (event.key === "Home") {
            event.preventDefault();
            commitValue(min);
          } else if (event.key === "End") {
            event.preventDefault();
            commitValue(max);
          }
        }}
      >
        <div className="pointer-events-none absolute inset-0">
          {marks.map((pct) => (
            <div
              key={pct}
              className="absolute top-1/2 h-2 w-px -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent transition-colors duration-200 group-data-[active]:bg-black/15 dark:group-data-[active]:bg-white/15"
              style={{ left: `${pct}%` }}
            />
          ))}
        </div>
        <motion.div
          className="pointer-events-none absolute inset-y-0 left-0 bg-black/10 transition-colors duration-150 group-data-[active]:bg-black/15 dark:bg-white/[0.11] dark:group-data-[active]:bg-white/15"
          style={{ width: fillWidth }}
        />
        <motion.div
          className="pointer-events-none absolute top-1/2 h-5 w-[3px] rounded-full bg-neutral-900 dark:bg-white/95"
          style={{ left: handleLeft, y: "-50%" }}
          animate={{
            opacity: handleOpacity,
            scaleX: isActive ? 1 : 0.25,
            scaleY: isActive && valueDodge ? 0.75 : 1,
          }}
          transition={{
            scaleX: { type: "spring", visualDuration: 0.25, bounce: 0.15 },
            scaleY: { type: "spring", visualDuration: 0.2, bounce: 0.1 },
            opacity: { duration: 0.15 },
          }}
        />
        <span
          ref={labelRef}
          className="text-tertiary pointer-events-none absolute top-1/2 left-2.5 inline-flex -translate-y-1/2 text-[13px] font-medium"
        >
          {label}
        </span>
        {showInput ? (
          <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            className="text-tertiary focus:text-primary absolute top-1/2 right-2.5 w-12 -translate-y-1/2 border-0 border-b border-current bg-transparent p-0 pb-px text-right font-mono text-[13px] font-medium outline-none"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submitInput();
              if (event.key === "Escape") {
                setShowInput(false);
                setIsValueEditable(false);
              }
            }}
            onBlur={submitInput}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
          />
        ) : (
          <span
            ref={valueSpanRef}
            className={cn(
              "text-tertiary absolute top-1/2 right-2.5 -translate-y-1/2 border-b border-transparent pb-px font-mono text-[13px] font-medium tabular-nums",
              isActive && "text-primary",
              isValueEditable && "border-current",
            )}
            style={{ cursor: isValueEditable ? "text" : "default" }}
            onMouseEnter={() => {
              clearHoverTimeout();
              hoverTimeoutRef.current = window.setTimeout(() => setIsValueEditable(true), 800);
            }}
            onMouseLeave={() => {
              clearHoverTimeout();
              if (!showInput) setIsValueEditable(false);
            }}
            onClick={(event) => {
              if (!isValueEditable) return;
              event.stopPropagation();
              event.preventDefault();
              setShowInput(true);
              setInputValue(displayValue);
            }}
            onPointerDown={(event) => {
              if (isValueEditable) event.stopPropagation();
            }}
          >
            {displayValue}
          </span>
        )}
      </motion.div>
    </div>
  );
}
