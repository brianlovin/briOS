"use client";

import createGlobe from "cobe";
import { useReducedMotion } from "motion/react";
import { type RefObject, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import type { ActivityEvent } from "@/lib/activity";
import { activityGlobeMarkers } from "@/lib/activity-geo";
import { cn } from "@/lib/utils";

const GLOBE_SIZE = 440;
const IDLE_SPIN = 0.003;
const VELOCITY_EASE = 0.035;
const DRAG_ANGLE_SCALE = 0.005;
const DRAG_THRESHOLD_PX = 6;
const THETA_LIMIT = Math.PI / 2 - 0.08;
const MIN_FEED_WIDTH = 720;

const MARKER_COLOR: [number, number, number] = [252 / 255, 83 / 255, 42 / 255];
const LIGHT_BASE: [number, number, number] = [1, 1, 1];
const LIGHT_GLOW: [number, number, number] = [0.95, 0.95, 0.95];
const DARK_BASE: [number, number, number] = [0.3, 0.3, 0.3];
const DARK_GLOW: [number, number, number] = [0.12, 0.12, 0.12];

function subscribeDark(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function isDarkClass(): boolean {
  return document.documentElement.classList.contains("dark");
}

function useIsDark(): boolean {
  return useSyncExternalStore(subscribeDark, isDarkClass, () => false);
}

function useFeedHasRoom(hostRef: RefObject<HTMLDivElement | null>): boolean {
  const [hasRoom, setHasRoom] = useState(true);

  useEffect(() => {
    const host = hostRef.current?.parentElement;
    if (!host) return;

    const update = () => {
      setHasRoom(host.clientWidth >= MIN_FEED_WIDTH);
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(host);
    return () => observer.disconnect();
  }, [hostRef]);

  return hasRoom;
}

function clampTheta(value: number): number {
  return Math.min(THETA_LIMIT, Math.max(-THETA_LIMIT, value));
}

function scrollFeedFromOverlay(overlay: HTMLElement, deltaY: number): void {
  const scroller = overlay.parentElement?.querySelector("[data-scrollable]");
  if (scroller instanceof HTMLElement) {
    scroller.scrollTop += deltaY;
  }
}

export function ActivityGlobe({ events }: { events: ActivityEvent[] }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const thetaRef = useRef(0.22);
  const velocityRef = useRef(IDLE_SPIN);
  const thetaVelocityRef = useRef(0);
  const draggingRef = useRef(false);
  const pendingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);
  const lastTRef = useRef(0);
  const isDark = useIsDark();
  const prefersReducedMotion = useReducedMotion() === true;
  const hasRoom = useFeedHasRoom(overlayRef);
  const [grabbing, setGrabbing] = useState(false);

  const markers = useMemo(() => activityGlobeMarkers(events), [events]);
  const markersRef = useRef(markers);
  const themeRef = useRef({ isDark, prefersReducedMotion });

  useEffect(() => {
    markersRef.current = markers;
  }, [markers]);

  useEffect(() => {
    themeRef.current = { isDark, prefersReducedMotion };
  }, [isDark, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      velocityRef.current = 0;
    } else if (!draggingRef.current) {
      velocityRef.current = IDLE_SPIN;
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const dark = themeRef.current.isDark;
    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: GLOBE_SIZE,
      height: GLOBE_SIZE,
      phi: phiRef.current,
      theta: thetaRef.current,
      dark: dark ? 1 : 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: dark ? 5 : 6,
      baseColor: dark ? DARK_BASE : LIGHT_BASE,
      markerColor: MARKER_COLOR,
      glowColor: dark ? DARK_GLOW : LIGHT_GLOW,
      markers: markersRef.current,
      scale: 1,
      offset: [0, 0],
    });
    let frame = 0;
    const onRender = () => {
      const { isDark: nextDark, prefersReducedMotion: reduced } = themeRef.current;
      if (!draggingRef.current) {
        if (reduced) {
          velocityRef.current = 0;
          thetaVelocityRef.current = 0;
        } else {
          phiRef.current += velocityRef.current;
          velocityRef.current += (IDLE_SPIN - velocityRef.current) * VELOCITY_EASE;
          thetaRef.current = clampTheta(thetaRef.current + thetaVelocityRef.current);
          thetaVelocityRef.current += (0 - thetaVelocityRef.current) * VELOCITY_EASE;
        }
      }

      globe.update({
        phi: phiRef.current,
        theta: thetaRef.current,
        markers: markersRef.current,
        dark: nextDark ? 1 : 0,
        mapBrightness: nextDark ? 5 : 6,
        baseColor: nextDark ? DARK_BASE : LIGHT_BASE,
        glowColor: nextDark ? DARK_GLOW : LIGHT_GLOW,
      });
      frame = window.requestAnimationFrame(onRender);
    };
    frame = window.requestAnimationFrame(onRender);

    return () => {
      window.cancelAnimationFrame(frame);
      globe.destroy();
      if (wrap && canvas.parentElement && canvas.parentElement !== wrap) {
        const extra = canvas.parentElement;
        wrap.appendChild(canvas);
        extra.remove();
      }
    };
  }, []);

  function beginDrag(clientX: number, clientY: number): void {
    draggingRef.current = true;
    pendingRef.current = false;
    lastXRef.current = clientX;
    lastYRef.current = clientY;
    lastTRef.current = performance.now();
    velocityRef.current = 0;
    thetaVelocityRef.current = 0;
    setGrabbing(true);
  }

  function applyDrag(clientX: number, clientY: number): void {
    const now = performance.now();
    const dx = clientX - lastXRef.current;
    const dy = clientY - lastYRef.current;
    const dt = Math.max(1, now - lastTRef.current);
    lastXRef.current = clientX;
    lastYRef.current = clientY;
    lastTRef.current = now;
    const dPhi = dx * DRAG_ANGLE_SCALE;
    const dTheta = dy * DRAG_ANGLE_SCALE;
    phiRef.current += dPhi;
    thetaRef.current = clampTheta(thetaRef.current + dTheta);
    if (!themeRef.current.prefersReducedMotion) {
      const frameScale = 16.67 / dt;
      velocityRef.current = dPhi * frameScale;
      thetaVelocityRef.current = dTheta * frameScale;
    }
  }

  function endDrag(): void {
    pendingRef.current = false;
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setGrabbing(false);
    if (themeRef.current.prefersReducedMotion) {
      velocityRef.current = 0;
      thetaVelocityRef.current = 0;
    }
  }

  return (
    <div
      ref={overlayRef}
      className={cn("pointer-events-none absolute inset-0 z-10 hidden", hasRoom && "lg:block")}
      aria-hidden
    >
      <div
        className={cn(
          "absolute inset-0 bg-[radial-gradient(ellipse_100%_90%_at_100%_100%,#fff_0%,#fff_32%,transparent_72%)]",
          "dark:bg-[radial-gradient(ellipse_100%_90%_at_100%_100%,#000_0%,#000_32%,transparent_72%)]",
        )}
      />
      <div ref={wrapRef} className="absolute -right-28 -bottom-32 size-[440px]">
        <canvas
          ref={canvasRef}
          width={GLOBE_SIZE * 2}
          height={GLOBE_SIZE * 2}
          className={cn(
            "pointer-events-auto size-full touch-none select-none",
            grabbing ? "cursor-grabbing" : "cursor-grab",
          )}
          onWheel={(event) => {
            if (draggingRef.current) return;
            const overlay = overlayRef.current;
            if (!overlay) return;
            scrollFeedFromOverlay(overlay, event.deltaY);
          }}
          onPointerDown={(event) => {
            lastXRef.current = event.clientX;
            lastYRef.current = event.clientY;
            lastTRef.current = performance.now();
            pendingRef.current = true;
            if (event.pointerType === "mouse") {
              beginDrag(event.clientX, event.clientY);
              event.currentTarget.setPointerCapture(event.pointerId);
            }
          }}
          onPointerMove={(event) => {
            if (draggingRef.current) {
              applyDrag(event.clientX, event.clientY);
              return;
            }
            if (!pendingRef.current) return;
            const dx = event.clientX - lastXRef.current;
            const dy = event.clientY - lastYRef.current;
            if (Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) {
              beginDrag(event.clientX, event.clientY);
              event.currentTarget.setPointerCapture(event.pointerId);
              applyDrag(event.clientX, event.clientY);
            }
          }}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        />
      </div>
    </div>
  );
}
