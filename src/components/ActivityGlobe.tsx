"use client";

import createGlobe from "cobe";
import { useReducedMotion } from "motion/react";
import { type RefObject, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import type { ActivityEvent } from "@/lib/activity";
import { activityGlobeMarkers } from "@/lib/activity-geo";
import { cn } from "@/lib/utils";

const GLOBE_SIZE = 256;
const IDLE_SPIN = 0.003;
const VELOCITY_EASE = 0.035;
const DRAG_PHI_SCALE = 0.005;
const DRAG_THRESHOLD_PX = 6;
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
  const velocityRef = useRef(IDLE_SPIN);
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
      theta: 0.28,
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
        } else {
          phiRef.current += velocityRef.current;
          velocityRef.current += (IDLE_SPIN - velocityRef.current) * VELOCITY_EASE;
        }
      }

      globe.update({
        phi: phiRef.current,
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
    setGrabbing(true);
  }

  function applyDrag(clientX: number): void {
    const now = performance.now();
    const dx = clientX - lastXRef.current;
    const dt = Math.max(1, now - lastTRef.current);
    lastXRef.current = clientX;
    lastTRef.current = now;
    const dPhi = dx * DRAG_PHI_SCALE;
    phiRef.current += dPhi;
    if (!themeRef.current.prefersReducedMotion) {
      velocityRef.current = dPhi * (16.67 / dt);
    }
  }

  function endDrag(): void {
    pendingRef.current = false;
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setGrabbing(false);
    if (themeRef.current.prefersReducedMotion) {
      velocityRef.current = 0;
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
          "absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_100%_100%,#fff_0%,#fff_28%,transparent_68%)]",
          "dark:bg-[radial-gradient(ellipse_90%_80%_at_100%_100%,#000_0%,#000_28%,transparent_68%)]",
        )}
      />
      <div ref={wrapRef} className="absolute right-0 bottom-0 size-64">
        <canvas
          ref={canvasRef}
          width={GLOBE_SIZE * 2}
          height={GLOBE_SIZE * 2}
          className={cn(
            "pointer-events-auto size-full touch-pan-y select-none",
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
              applyDrag(event.clientX);
              return;
            }
            if (!pendingRef.current) return;
            const dx = event.clientX - lastXRef.current;
            const dy = event.clientY - lastYRef.current;
            if (Math.abs(dx) > DRAG_THRESHOLD_PX && Math.abs(dx) > Math.abs(dy)) {
              beginDrag(event.clientX, event.clientY);
              event.currentTarget.setPointerCapture(event.pointerId);
              applyDrag(event.clientX);
            }
          }}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        />
      </div>
    </div>
  );
}
