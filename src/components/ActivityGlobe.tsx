"use client";

import createGlobe from "cobe";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import type { ActivityEvent } from "@/lib/activity";
import { activityGlobeMarkers, type ActivityLatLng } from "@/lib/activity-geo";
import {
  globeDiameterFromHeight,
  globeMarkerFacing,
  latLngToGlobePose,
  shortestAngleDelta,
} from "@/lib/activity-globe";
import { cn } from "@/lib/utils";

const IDLE_SPIN = 0.003;
const VELOCITY_EASE = 0.035;
const DRAG_ANGLE_SCALE = 0.005;
const DRAG_THRESHOLD_PX = 6;
const THETA_LIMIT = Math.PI / 2 - 0.08;
const MIN_FEED_WIDTH = 720;
const MARKER_ELEVATION = 0.03;
const AIM_MS_MIN = 600;
const AIM_MS_MAX = 850;
const HANG_RIGHT = 0.333;
const HANG_BOTTOM = 0.367;

const MARKER_COLOR: [number, number, number] = [252 / 255, 83 / 255, 42 / 255];
const LIGHT_BASE: [number, number, number] = [1, 1, 1];
const LIGHT_GLOW: [number, number, number] = [0.95, 0.95, 0.95];
const DARK_BASE: [number, number, number] = [0.3, 0.3, 0.3];
const DARK_GLOW: [number, number, number] = [0.12, 0.12, 0.12];

export type ActivityGlobeAimRequest = {
  location: ActivityLatLng;
  nonce: number;
};

type AimState = {
  fromPhi: number;
  fromTheta: number;
  dPhi: number;
  dTheta: number;
  start: number;
  duration: number;
};

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

function clampTheta(value: number): number {
  return Math.min(THETA_LIMIT, Math.max(-THETA_LIMIT, value));
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

function readPaneSize(host: HTMLElement | null): { hasRoom: boolean; size: number } {
  const width =
    host?.clientWidth ?? (typeof window === "undefined" ? MIN_FEED_WIDTH : window.innerWidth);
  const height = host?.clientHeight || (typeof window === "undefined" ? 960 : window.innerHeight);
  return {
    hasRoom: width >= MIN_FEED_WIDTH,
    size: globeDiameterFromHeight(height),
  };
}

function scrollFeedFromOverlay(overlay: HTMLElement, deltaY: number): void {
  const scroller = overlay.parentElement?.querySelector("[data-scrollable]");
  if (scroller instanceof HTMLElement) {
    scroller.scrollTop += deltaY;
  }
}

export function ActivityGlobe({
  events,
  aim,
}: {
  events: ActivityEvent[];
  aim?: ActivityGlobeAimRequest | null;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const phiRef = useRef(0);
  const thetaRef = useRef(0.22);
  const velocityRef = useRef(IDLE_SPIN);
  const thetaVelocityRef = useRef(0);
  const draggingRef = useRef(false);
  const pendingRef = useRef(false);
  const aimingRef = useRef<AimState | null>(null);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);
  const lastTRef = useRef(0);
  const orbElsRef = useRef(new Map<string, HTMLDivElement>());
  const isDark = useIsDark();
  const prefersReducedMotion = useReducedMotion() === true;
  const [layout, setLayout] = useState(() => readPaneSize(null));
  const [grabbing, setGrabbing] = useState(false);

  const markers = useMemo(() => activityGlobeMarkers(events), [events]);
  const markersRef = useRef(markers);
  const themeRef = useRef({ isDark, prefersReducedMotion });
  const sizeRef = useRef(layout.size);

  useEffect(() => {
    markersRef.current = markers;
  }, [markers]);

  useEffect(() => {
    themeRef.current = { isDark, prefersReducedMotion };
  }, [isDark, prefersReducedMotion]);

  useEffect(() => {
    sizeRef.current = layout.size;
  }, [layout.size]);

  useEffect(() => {
    const host = overlayRef.current?.parentElement;
    if (!host) return;

    const update = () => {
      setLayout(readPaneSize(host));
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      velocityRef.current = 0;
      aimingRef.current = null;
    } else if (!draggingRef.current && !aimingRef.current) {
      velocityRef.current = IDLE_SPIN;
    }
  }, [prefersReducedMotion]);

  const applyOrbFacing = useCallback(() => {
    const phi = phiRef.current;
    const theta = thetaRef.current;
    for (const marker of markersRef.current) {
      const el = orbElsRef.current.get(marker.id);
      if (!el) continue;
      const facing = globeMarkerFacing(marker.location[0], marker.location[1], phi, theta);
      el.style.setProperty("--orb-facing", facing.toFixed(3));
    }
  }, []);

  const aimAt = useCallback(
    (location: ActivityLatLng) => {
      const pose = latLngToGlobePose(location.lat, location.lng);
      const dPhi = shortestAngleDelta(phiRef.current, pose.phi);
      const dTheta = clampTheta(pose.theta) - thetaRef.current;
      velocityRef.current = 0;
      thetaVelocityRef.current = 0;

      if (themeRef.current.prefersReducedMotion) {
        aimingRef.current = null;
        phiRef.current += dPhi;
        thetaRef.current = clampTheta(pose.theta);
        applyOrbFacing();
        return;
      }

      const distance = Math.hypot(dPhi, dTheta);
      aimingRef.current = {
        fromPhi: phiRef.current,
        fromTheta: thetaRef.current,
        dPhi,
        dTheta,
        start: performance.now(),
        duration: Math.round(AIM_MS_MIN + Math.min(AIM_MS_MAX - AIM_MS_MIN, distance * 180)),
      };
    },
    [applyOrbFacing],
  );

  useEffect(() => {
    if (!aim) return;
    aimAt(aim.location);
  }, [aim, aimAt]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const dark = themeRef.current.isDark;
    const size = sizeRef.current;
    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: size,
      height: size,
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
      markerElevation: MARKER_ELEVATION,
      scale: 1,
      offset: [0, 0],
    });
    globeRef.current = globe;

    let frame = 0;
    const onRender = () => {
      const { isDark: nextDark, prefersReducedMotion: reduced } = themeRef.current;
      const aim = aimingRef.current;

      if (aim) {
        const t = Math.min(1, (performance.now() - aim.start) / aim.duration);
        const eased = easeOutCubic(t);
        phiRef.current = aim.fromPhi + aim.dPhi * eased;
        thetaRef.current = clampTheta(aim.fromTheta + aim.dTheta * eased);
        if (t >= 1) {
          aimingRef.current = null;
          velocityRef.current = reduced ? 0 : IDLE_SPIN;
          thetaVelocityRef.current = 0;
        }
      } else if (!draggingRef.current) {
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
      applyOrbFacing();
      frame = window.requestAnimationFrame(onRender);
    };
    frame = window.requestAnimationFrame(onRender);

    return () => {
      window.cancelAnimationFrame(frame);
      globeRef.current = null;
      globe.destroy();
      if (wrap && canvas.parentElement && canvas.parentElement !== wrap) {
        const extra = canvas.parentElement;
        wrap.appendChild(canvas);
        extra.remove();
      }
    };
  }, [applyOrbFacing]);

  useEffect(() => {
    globeRef.current?.update({ width: layout.size, height: layout.size });
  }, [layout.size]);

  function beginDrag(clientX: number, clientY: number): void {
    aimingRef.current = null;
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

  const hangRight = Math.round(layout.size * HANG_RIGHT);
  const hangBottom = Math.round(layout.size * HANG_BOTTOM);

  return (
    <div
      ref={overlayRef}
      className={cn(
        "pointer-events-none absolute inset-0 z-10 hidden",
        layout.hasRoom && "lg:block",
      )}
      aria-hidden
    >
      <div
        className={cn(
          "absolute inset-0 bg-[radial-gradient(ellipse_100%_90%_at_100%_100%,#fff_0%,#fff_32%,transparent_72%)]",
          "dark:bg-[radial-gradient(ellipse_100%_90%_at_100%_100%,#000_0%,#000_32%,transparent_72%)]",
        )}
      />
      <div
        ref={wrapRef}
        className="absolute"
        style={{
          width: layout.size,
          height: layout.size,
          right: -hangRight,
          bottom: -hangBottom,
        }}
      >
        <canvas
          ref={canvasRef}
          width={layout.size * 2}
          height={layout.size * 2}
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
        {markers.map((marker) => (
          <div
            key={marker.id}
            ref={(node) => {
              if (node) {
                orbElsRef.current.set(marker.id, node);
                node.style.setProperty("position-anchor", `--cobe-${marker.id}`);
                // COBE 2.0.1 sets this to "N" when facing (invalid → visible) and unsets it behind.
                node.style.setProperty("visibility", `var(--cobe-visible-${marker.id}, hidden)`);
              } else {
                orbElsRef.current.delete(marker.id);
              }
            }}
            className="activity-globe-orb"
          />
        ))}
      </div>
    </div>
  );
}
