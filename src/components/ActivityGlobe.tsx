"use client";

import createGlobe from "cobe";
import { useReducedMotion } from "motion/react";
import {
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
  cobeGpuMarkers,
  cobeWebGLMarkers,
  GLOBE_HANG,
  GLOBE_MESH_MIN,
  globeDevicePixelRatio,
  globeDiameterFromHeight,
  globeMarkerFacingFromUnit,
  globeMarkersChanged,
  type GlobeMarkerSnapshot,
  isGlobePerfQuery,
  latLngToGlobePoint,
  latLngToVisibleGlobePose,
  type MarkerHorizonState,
  muteCobeEmptyRootStyle,
  selectGlobeMarkerSizing,
  shortestAngleDelta,
  shouldRunGlobeLoop,
  stepMarkerHorizon,
  takeNewHeadStyle,
} from "@/lib/activity-globe";
import {
  type ActivityGlobeConfig,
  DEFAULT_ACTIVITY_GLOBE_CONFIG,
  globeCobeOptions,
  globeThemeColors,
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
const DROPPED_FRAME_MS = 20;
const GLOBE_PERF_SAMPLE_CAP = 600;

type AimState = {
  fromPhi: number;
  fromTheta: number;
  dPhi: number;
  dTheta: number;
  start: number;
  duration: number;
};

type GlobePerfSnapshot = {
  frames: number;
  markerUpdates: number;
  optionUpdates: number;
  cheapFrames: number;
  meanDt: number;
  p95Dt: number;
  dropped: number;
  meanWork: number;
  p95Work: number;
};

type GlobePerfTracker = {
  frame: (workMs?: number, cheap?: boolean) => void;
  markMarkers: () => void;
  markOptions: () => void;
  reset: () => void;
  snapshot: () => GlobePerfSnapshot;
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

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * p) - 1));
  return sorted[index] ?? 0;
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function createGlobePerfTracker(): GlobePerfTracker {
  const dts: number[] = [];
  const works: number[] = [];
  let last = 0;
  let markerUpdates = 0;
  let optionUpdates = 0;
  let cheapFrames = 0;
  return {
    frame(workMs = 0, cheap = true) {
      const now = performance.now();
      if (last) dts.push(now - last);
      last = now;
      works.push(workMs);
      if (dts.length > GLOBE_PERF_SAMPLE_CAP) dts.splice(0, dts.length - GLOBE_PERF_SAMPLE_CAP);
      if (works.length > GLOBE_PERF_SAMPLE_CAP)
        works.splice(0, works.length - GLOBE_PERF_SAMPLE_CAP);
      if (cheap) cheapFrames += 1;
    },
    markMarkers() {
      markerUpdates += 1;
    },
    markOptions() {
      optionUpdates += 1;
    },
    reset() {
      dts.length = 0;
      works.length = 0;
      last = 0;
      markerUpdates = 0;
      optionUpdates = 0;
      cheapFrames = 0;
    },
    snapshot() {
      const sortedDt = [...dts].sort((a, b) => a - b);
      const sortedWork = [...works].sort((a, b) => a - b);
      return {
        frames: dts.length,
        markerUpdates,
        optionUpdates,
        cheapFrames,
        meanDt: mean(dts),
        p95Dt: percentile(sortedDt, 0.95),
        dropped: dts.filter((dt) => dt > DROPPED_FRAME_MS).length,
        meanWork: mean(works),
        p95Work: percentile(sortedWork, 0.95),
      };
    },
  };
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

  // Sandbox keeps the slider. Live path matches production's 12px + glow at this mesh.
  const markerSizing = useMemo(
    () => selectGlobeMarkerSizing(config, layout.size, Boolean(configProp)),
    [config, configProp, layout.size],
  );
  const markers = useMemo(
    () => activityRecentGlobeMarkers(events, config.markerRecentCount, markerSizing),
    [events, config.markerRecentCount, markerSizing],
  );
  const newestId = markers[0]?.eventId ?? null;
  const [seenNewestId, setSeenNewestId] = useState(newestId);
  if (newestId !== seenNewestId) {
    setSeenNewestId(newestId);
    setFocusId(newestId);
  }
  const markersRef = useRef(markers);
  const focusIdRef = useRef(focusId);
  const themeRef = useRef({ isDark, prefersReducedMotion });
  const sizeRef = useRef(layout.size);
  const markersDirtyRef = useRef(false);
  const themeDirtyRef = useRef(false);

  useEffect(() => {
    configRef.current = config;
    markersDirtyRef.current = true;
    themeDirtyRef.current = true;
  }, [config]);

  useEffect(() => {
    markersRef.current = markers;
    markersDirtyRef.current = true;
  }, [markers]);

  useEffect(() => {
    focusIdRef.current = focusId;
    markersDirtyRef.current = true;
  }, [focusId]);

  useEffect(() => {
    sizeRef.current = layout.size;
  }, [layout.size]);

  useEffect(() => {
    themeRef.current = { isDark, prefersReducedMotion };
    themeDirtyRef.current = true;
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

    const size = sizeRef.current;
    const dpr = globeDevicePixelRatio();
    const horizon = new Map<string, MarkerHorizonState>();
    const points = new Map<string, [number, number, number]>();
    const appearById: Record<string, number> = {};
    const primedAt = performance.now();
    for (const marker of markersRef.current) {
      const point = latLngToGlobePoint(marker.location[0], marker.location[1]);
      points.set(marker.id, point);
      const facing = globeMarkerFacingFromUnit(point, phiRef.current, thetaRef.current);
      const state = stepMarkerHorizon(undefined, facing, primedAt, 0);
      horizon.set(marker.id, state);
      appearById[marker.id] = state.value;
    }
    const initialTheme = globeThemeColors(themeRef.current.isDark, configRef.current);
    const initialMarkers = cobeWebGLMarkers(
      markersRef.current,
      configRef.current,
      focusIdRef.current,
      appearById,
      initialTheme.baseColor,
    );
    let sentMarkers: GlobeMarkerSnapshot[] = initialMarkers;
    const stylesBefore = new Set(document.head.querySelectorAll("style"));
    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: size,
      height: size,
      phi: phiRef.current,
      theta: thetaRef.current,
      markers: cobeGpuMarkers(initialMarkers),
      // DPR 2 already supplies the samples; MSAA on a ~0.72×vh mesh is the idle-frame tax.
      context: {
        antialias: false,
        powerPreference: "high-performance",
        desynchronized: true,
      },
      ...globeCobeOptions(themeRef.current.isDark, configRef.current),
    });
    const cobeStyle = takeNewHeadStyle(stylesBefore);
    if (cobeStyle) muteCobeEmptyRootStyle(cobeStyle);
    globeRef.current = globe;
    markersDirtyRef.current = false;
    themeDirtyRef.current = false;

    const perf = isGlobePerfQuery(window.location.search) ? createGlobePerfTracker() : null;
    type GlobePerfWindow = Window & {
      __ACTIVITY_GLOBE_PERF?: ReturnType<GlobePerfTracker["snapshot"]>;
      __ACTIVITY_GLOBE_PERF_LIVE?: GlobePerfTracker;
    };
    if (perf) {
      (window as GlobePerfWindow).__ACTIVITY_GLOBE_PERF_LIVE = perf;
    }
    let loggedPerf = false;
    const perfTimer = perf
      ? window.setTimeout(() => {
          if (loggedPerf) return;
          loggedPerf = true;
          const snapshot = perf.snapshot();
          console.info("[activity-globe]", snapshot);
          (window as GlobePerfWindow).__ACTIVITY_GLOBE_PERF = snapshot;
        }, 8000)
      : 0;

    let frame = 0;
    const intersectingRef = { current: true };
    // Reused on the cheap path so idle spin / drag never allocates a new update object.
    const poseState = { phi: 0, theta: 0 };

    const isActive = () =>
      shouldRunGlobeLoop({
        visibilityState: document.visibilityState,
        isIntersecting: intersectingRef.current,
      });

    const onRender = () => {
      if (!isActive()) {
        frame = 0;
        return;
      }

      const { prefersReducedMotion: reduced } = themeRef.current;
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

      const markersDirty = markersDirtyRef.current;
      const themeDirty = themeDirtyRef.current;
      let update: { phi: number; theta: number } & Record<string, unknown> = poseState;
      poseState.phi = phiRef.current;
      poseState.theta = thetaRef.current;

      const liveMarkers = markersRef.current;
      const fadeMs = themeRef.current.prefersReducedMotion ? 0 : configRef.current.markerFadeMs;
      const now = performance.now();
      let horizonDirty = false;

      if (markersDirty) {
        const liveIds = new Set<string>();
        for (const marker of liveMarkers) liveIds.add(marker.id);
        for (const id of horizon.keys()) {
          if (!liveIds.has(id)) horizon.delete(id);
        }
        for (const id of points.keys()) {
          if (!liveIds.has(id)) points.delete(id);
        }
        for (const id of Object.keys(appearById)) {
          if (!liveIds.has(id)) delete appearById[id];
        }
      }

      for (const marker of liveMarkers) {
        let point = points.get(marker.id);
        if (!point) {
          point = latLngToGlobePoint(marker.location[0], marker.location[1]);
          points.set(marker.id, point);
        }
        const facing = globeMarkerFacingFromUnit(point, poseState.phi, poseState.theta);
        const next = stepMarkerHorizon(horizon.get(marker.id), facing, now, fadeMs);
        const prev = horizon.get(marker.id);
        if (next !== prev) {
          horizon.set(marker.id, next);
          if (next.value !== prev?.value) horizonDirty = true;
        }
      }

      let cheap = true;
      if (markersDirty || themeDirty || horizonDirty) {
        cheap = false;
        update = { phi: poseState.phi, theta: poseState.theta };
        if (markersDirty || horizonDirty) {
          for (const marker of liveMarkers) {
            appearById[marker.id] = horizon.get(marker.id)?.value ?? 1;
          }
          const theme = globeThemeColors(themeRef.current.isDark, configRef.current);
          const nextMarkers = cobeWebGLMarkers(
            liveMarkers,
            configRef.current,
            focusIdRef.current,
            appearById,
            theme.baseColor,
          );
          if (globeMarkersChanged(sentMarkers, nextMarkers)) {
            update.markers = cobeGpuMarkers(nextMarkers);
            sentMarkers = nextMarkers;
            perf?.markMarkers();
          }
          markersDirtyRef.current = false;
        }
        if (themeDirty) {
          Object.assign(update, globeCobeOptions(themeRef.current.isDark, configRef.current));
          themeDirtyRef.current = false;
          perf?.markOptions();
        }
      }

      const workStart = performance.now();
      globe.update(update);
      perf?.frame(performance.now() - workStart, cheap);
      frame = window.requestAnimationFrame(onRender);
    };

    const start = () => {
      if (frame) return;
      if (!isActive()) return;
      frame = window.requestAnimationFrame(onRender);
    };

    const stop = () => {
      if (!frame) return;
      window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") stop();
      else start();
    };

    document.addEventListener("visibilitychange", onVisibility);

    const io = new IntersectionObserver((entries) => {
      intersectingRef.current = entries.some((entry) => entry.isIntersecting);
      if (intersectingRef.current) start();
      else stop();
    });
    const overlay = overlayRef.current;
    if (overlay) io.observe(overlay);

    start();

    return () => {
      stop();
      if (perfTimer) window.clearTimeout(perfTimer);
      if (perf) {
        const win = window as GlobePerfWindow;
        delete win.__ACTIVITY_GLOBE_PERF;
        delete win.__ACTIVITY_GLOBE_PERF_LIVE;
      }
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
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

  // Pointer-move writes refs only. rAF applies the cheap { phi, theta } update.
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
          className={cn(
            "pointer-events-auto size-full touch-none select-none",
            grabbing ? "cursor-grabbing" : "cursor-grab",
          )}
          onWheel={(event) => {
            if (draggingRef.current) return;
            const overlay = overlayRef.current;
            if (overlay) scrollFeedFromOverlay(overlay, event.deltaY);
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
