"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useState } from "react";

import { Heart } from "@/components/icons/Heart";
import { Button } from "@/components/ui/Button";
import { useLikes } from "@/lib/hooks/useLikes";
import { MAX_LIKES_PER_USER } from "@/lib/likes-constants";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  pageId: string;
  className?: string;
}

function AnimatedDigit({ digit, direction }: { digit: string; direction: "up" | "down" }) {
  return (
    <div className="relative inline-flex h-[1em] w-[0.6em] items-center justify-center overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={digit}
          initial={{ y: direction === "up" ? "100%" : "-100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: direction === "up" ? "-100%" : "100%", opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
            mass: 0.8,
          }}
          className="absolute leading-none"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const [[prevValue, direction], setState] = useState<[number, "up" | "down"]>([value, "up"]);

  // Update state during render when value changes (React-approved pattern)
  if (value !== prevValue) {
    setState([value, value > prevValue ? "up" : "down"]);
  }

  const digits = String(value).split("");

  return (
    <span className="inline-flex leading-none tabular-nums">
      {digits.map((digit, i) => (
        <AnimatedDigit key={digits.length - 1 - i} digit={digit} direction={direction} />
      ))}
    </span>
  );
}

// Generate random particles for each click
function generateParticles(intensity: number) {
  const count = Math.floor(8 + intensity * 10); // 8-18 particles
  const baseSpread = 40 + intensity * 30; // 40-70px spread
  const baseSize = 6 + intensity * 6; // 6-12px size
  const baseDuration = 0.5 + intensity * 0.3; // 0.5-0.8s duration

  return Array.from({ length: count }, () => ({
    angle: Math.random() * Math.PI * 2,
    distance: baseSpread * (0.7 + Math.random() * 0.6),
    size: baseSize * (0.6 + Math.random() * 0.6),
    duration: baseDuration * (0.8 + Math.random() * 0.4),
  }));
}

export function LikeButton({ pageId, className }: LikeButtonProps) {
  const { count, userLikes, canLike, isLoading, addLike, removeLike } = useLikes(pageId);
  const [isShaking, setIsShaking] = useState(false);
  const [particles, setParticles] = useState<ReturnType<typeof generateParticles>>([]);
  const [particleKey, setParticleKey] = useState(0);

  // Subtle button scale (constant, not intensity-based)
  const buttonScale = useMotionValue(1);
  const buttonSpring = useSpring(buttonScale, { stiffness: 400, damping: 25 });

  // Bouncier heart scale (intensity-based)
  const heartScale = useMotionValue(1);
  const heartSpring = useSpring(heartScale, { stiffness: 500, damping: 15, mass: 0.5 });

  const handleClick = async () => {
    if (isLoading) return;

    if (!canLike) {
      // At max likes - shake it!
      setIsShaking(true);
      heartScale.set(1.2);
      setTimeout(() => {
        setIsShaking(false);
        heartScale.set(1);
      }, 500);
      return;
    }

    // Generate new random particles with intensity based on likes
    const intensity = (userLikes + 1) / MAX_LIKES_PER_USER;
    setParticles(generateParticles(intensity));
    setParticleKey((k) => k + 1);

    // Subtle button bounce
    buttonScale.set(1.02);
    setTimeout(() => buttonScale.set(1), 100);

    // Bouncier heart
    heartScale.set(1.18 + intensity * 0.15);
    setTimeout(() => heartScale.set(1), 150);

    await addLike();
  };

  const handlePointerDown = () => {
    buttonScale.set(0.97);
    heartScale.set(0.88);
  };

  const handlePointerUp = () => {
    if (!isShaking) {
      buttonScale.set(1);
      heartScale.set(1);
    }
  };

  const handleContextMenu = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoading || userLikes <= 0) return;

    // Subtle feedback for unlike
    buttonScale.set(0.98);
    heartScale.set(0.9);
    setTimeout(() => {
      buttonScale.set(1);
      heartScale.set(1);
    }, 100);

    await removeLike();
  };

  const isFilled = userLikes > 0;
  const fillProgress = userLikes / MAX_LIKES_PER_USER;

  // Color intensity based on how many likes
  const heartColor = isFilled
    ? `hsl(0, ${70 + fillProgress * 30}%, ${55 - fillProgress * 10}%)`
    : undefined;

  return (
    <motion.div
      style={{ scale: buttonSpring }}
      animate={isShaking ? { x: [0, -4.5, 4.5, -4.5, 4.5, -2.7, 2.7, 0] } : {}}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        disabled={isLoading}
        className={cn(
          "hover:bg-secondary dark:bg-elevated dark:shadow-contrast text-quaternary h-7 flex-row gap-1 rounded-full bg-white pr-2.5 pl-2 shadow-sm ring-[0.5px] ring-black/10 disabled:opacity-100 dark:text-neutral-500 dark:ring-white/10",
          isFilled && "text-red-500 hover:text-red-600",
          className,
        )}
        aria-label={`Like this. Current likes: ${count}. You've liked ${userLikes} times.`}
        style={isFilled ? { color: heartColor } : undefined}
      >
        <div className="relative">
          <motion.div style={{ scale: heartSpring }}>
            <Heart size={20} className={cn("fill-current transition-all")} />
          </motion.div>

          {/* Burst particles on click - outside spring wrapper for linear animation */}
          <AnimatePresence>
            {particles.length > 0 && (
              <motion.div
                key={particleKey}
                className="pointer-events-none absolute inset-0"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                {particles.map((p, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 rounded-full bg-red-400"
                    style={{ width: p.size, height: p.size }}
                    initial={{ x: "-50%", y: "-50%", scale: 1, opacity: 1 }}
                    animate={{
                      x: `calc(-50% + ${Math.cos(p.angle) * p.distance}px)`,
                      y: `calc(-50% + ${Math.sin(p.angle) * p.distance}px)`,
                      scale: 0,
                      opacity: 0,
                    }}
                    transition={{ duration: p.duration, ease: "easeOut" }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <span className="-translate-x-px translate-y-px leading-none">
          <AnimatedNumber value={count} />
        </span>
      </Button>
    </motion.div>
  );
}
