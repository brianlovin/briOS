"use client";

import createGlobe from "cobe";
import { useReducedMotion } from "motion/react";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import type { ActivityEvent } from "@/lib/activity";
import { type ActivityLatLng, activityRecentGlobeMarkers } from "@/lib/activity-geo";
import {
  bindableGlobeMarkers,
  GLOBE_HANG,
  GLOBE_MESH_MIN,
  globeDiameterFromHeight,
  globeMapDotPx,
  latLngToVisibleGlobePose,
  shortestAngleDelta,
} from "@/lib/activity-globe";
import {
  type ActivityGlobeConfig,
  cobeMarkerStyle,
  DEFAULT_ACTIVITY_GLOBE_CONFIG,
  globeCobeOptions,
  markerDotPxForAge,
  rgbCss,
} from "@/lib/activity-globe-config";
import { cn } from "@/lib/utils";

const IDLE_SPIN = 0.0015;
const VELOCITY_EASE = 0.035;
const DRAG_ANGLE_SCALE = 0.005;
const DRAG_THRESHOLD_PX = 6;
const THETA_LIMIT = Math.PI / 2 - 0.08;
const MIN_FEED_WIDTH = 720;
const AIM_MS_MIN = 600;
const AIM_MS_MAX = 850;

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

function paneHeight(host: HTMLElement | null): number {
  const windowHeight = typeof window === "undefined" ? 960 : window.innerHeight;
  const hostHeight = host?.clientHeight ?? 0;
  return Math.max(hostHeight, windowHeight);
}

function readPaneSize(host: HTMLElement | null): { hasRoom: boolean; size: number } {
  const width =
    host?.clientWidth || (typeof window === "undefined" ? MIN_FEED_WIDTH : window.innerWidth);
  return {
    hasRoom: width >= MIN_FEED_WIDTH,
    size: globeDiameterFromHeight(paneHeight(host)),
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
  config: configProp,
}: {
  events: ActivityEvent[];
  config?: ActivityGlobeConfig;
}) {
  const config = configProp ?? DEFAULT_ACTIVITY_GLOBE_CONFIG;
  const configRef = useRef(config);
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
  const userSteeringRef = useRef(false);
  const primedNewestRef = useRef<string | null>(null);
  const skipAutoPanRef = useRef(true);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);
  const lastTRef = useRef(0);
  const isDark = useIsDark();
  const prefersReducedMotion = useReducedMotion() === true;
  const [layout, setLayout] = useState({ hasRoom: true, size: GLOBE_MESH_MIN });
  const [grabbing, setGrabbing] = useState(false);
  const [focusId, setFocusId] = useState<string | null>(null);

  const markers = useMemo(
    () => activityRecentGlobeMarkers(events, config.markerRecentCount),
    [events, config.markerRecentCount],
  );
  const newestId = markers[0]?.eventId ?? null;
  const [seenNewestId, setSeenNewestId] = useState(newestId);
  if (newestId !== seenNewestId) {
    setSeenNewestId(newestId);
    setFocusId(newestId);
  }
  const markersRef = useRef(markers);
  const themeRef = useRef({ isDark, prefersReducedMotion });
  const sizeRef = useRef(layout.size);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    markersRef.current = markers;
  }, [markers]);

  useEffect(() => {
    sizeRef.current = layout.size;
  }, [layout.size]);

  useEffect(() => {
    themeRef.current = { isDark, prefersReducedMotion };
  }, [isDark, prefersReducedMotion]);

  useLayoutEffect(() => {
    const update = () => {
      setLayout(readPaneSize(overlayRef.current?.parentElement ?? null));
    };
    update();

    const observer = new ResizeObserver(update);
    const host = overlayRef.current?.parentElement;
    if (host) observer.observe(host);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      velocityRef.current = 0;
      thetaVelocityRef.current = 0;
      aimingRef.current = null;
    } else if (!draggingRef.current && !aimingRef.current) {
      velocityRef.current = IDLE_SPIN;
    }
  }, [prefersReducedMotion]);

  const aimAt = useCallback((location: ActivityLatLng) => {
    const pose = latLngToVisibleGlobePose(location.lat, location.lng);
    const dPhi = shortestAngleDelta(phiRef.current, pose.phi);
    const dTheta = clampTheta(pose.theta) - thetaRef.current;
    velocityRef.current = 0;
    thetaVelocityRef.current = 0;

    if (themeRef.current.prefersReducedMotion) {
      aimingRef.current = null;
      phiRef.current += dPhi;
      thetaRef.current = clampTheta(pose.theta);
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
  }, []);

  useEffect(() => {
    const newest = markers[0];
    if (!newest) {
      skipAutoPanRef.current = false;
      primedNewestRef.current = null;
      return;
    }
    if (primedNewestRef.current === newest.eventId) return;
    primedNewestRef.current = newest.eventId;

    const location = { lat: newest.location[0], lng: newest.location[1] };
    if (skipAutoPanRef.current) {
      skipAutoPanRef.current = false;
      const pose = latLngToVisibleGlobePose(location.lat, location.lng);
      phiRef.current = pose.phi;
      thetaRef.current = clampTheta(pose.theta);
      return;
    }
    if (userSteeringRef.current) return;
    aimAt(location);
  }, [markers, aimAt]);

  useEffect(() => {
    if (!focusId) return;
    const timeout = window.setTimeout(() => setFocusId(null), config.focusMs);
    return () => window.clearTimeout(timeout);
  }, [focusId, config.focusMs]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const size = sizeRef.current;
    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: size,
      height: size,
      phi: phiRef.current,
      theta: thetaRef.current,
      markers: bindableGlobeMarkers(markersRef.current),
      ...globeCobeOptions(themeRef.current.isDark, configRef.current),
    });
    globeRef.current = globe;

    let frame = 0;
    const onRender = () => {
      const { isDark: nextDark, prefersReducedMotion: reduced } = themeRef.current;
      const aimState = aimingRef.current;

      if (draggingRef.current) {
        userSteeringRef.current = true;
      } else if (userSteeringRef.current && !aimState) {
        const idlePhi = Math.abs(velocityRef.current - (reduced ? 0 : IDLE_SPIN)) < 0.001;
        const idleTheta = Math.abs(thetaVelocityRef.current) < 0.001;
        if (idlePhi && idleTheta) userSteeringRef.current = false;
      }

      if (aimState) {
        const t = Math.min(1, (performance.now() - aimState.start) / aimState.duration);
        const eased = easeOutCubic(t);
        phiRef.current = aimState.fromPhi + aimState.dPhi * eased;
        thetaRef.current = clampTheta(aimState.fromTheta + aimState.dTheta * eased);
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
        markers: bindableGlobeMarkers(markersRef.current),
        ...globeCobeOptions(nextDark, configRef.current),
      });
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
  }, []);

  useEffect(() => {
    globeRef.current?.update({ width: layout.size, height: layout.size });
  }, [layout.size]);

  function beginDrag(clientX: number, clientY: number): void {
    aimingRef.current = null;
    userSteeringRef.current = true;
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

  const hang = Math.round(layout.size * GLOBE_HANG);

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
          right: -hang,
          bottom: -hang,
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
      </div>
      {markers.map((marker) => {
        const px = markerDotPxForAge(marker.age, config, globeMapDotPx(layout.size, config.scale));
        return (
          <span
            key={marker.id}
            className="activity-globe-dot"
            style={
              {
                ...cobeMarkerStyle(marker.id, {
                  markerBlurPx: config.markerBlurPx,
                  markerFadeMs: prefersReducedMotion ? 0 : config.markerFadeMs,
                }),
                "--activity-globe-focus-scale": 1 + config.focusPulseScale,
                "--activity-globe-focus-ms": `${config.focusMs}ms`,
              } as CSSProperties
            }
          >
            <span
              key={focusId === marker.eventId ? focusId : "idle"}
              className={cn("activity-globe-dot-core", focusId === marker.eventId && "is-focused")}
              style={
                {
                  width: px,
                  height: px,
                  backgroundColor: rgbCss(config.markerColor),
                  "--activity-globe-dot-px": `${px}px`,
                } as CSSProperties
              }
            />
          </span>
        );
      })}
    </div>
  );
}
