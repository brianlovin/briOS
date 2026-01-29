"use client";

import * as BaseUITooltip from "@base-ui/react/tooltip";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import { PlaceholderShader } from "@/components/ui/PlaceholderShader";
import { imageCache } from "@/lib/imageCache";
import { cn } from "@/lib/utils";

export type PreviewCardPayload = {
  url: string;
  name: string;
  description?: string;
  icon?: string;
  previewImage?: string;
  previewImageDark?: string;
};

type PreviewCardHandle = ReturnType<typeof BaseUITooltip.Tooltip.createHandle<PreviewCardPayload>>;

interface PreviewCardContextValue {
  handle: PreviewCardHandle;
  isTouchDevice: boolean;
}

const PreviewCardContext = createContext<PreviewCardContextValue | null>(null);

function usePreviewCardContext() {
  const context = useContext(PreviewCardContext);
  if (!context) {
    throw new Error("usePreviewCardContext must be used within a PreviewCardProvider");
  }
  return context;
}

export function usePreviewCardHandle() {
  return usePreviewCardContext().handle;
}

function PreviewFallback() {
  return (
    <div className="bg-tertiary relative aspect-[40/21] w-full overflow-hidden">
      <PlaceholderShader />
    </div>
  );
}

function PreviewImage({ src, srcDark, name }: { src: string; srcDark?: string; name: string }) {
  const isCached = imageCache.has(src);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    isCached ? "loaded" : "loading",
  );

  // Preload image using Image API to avoid broken image flicker
  useEffect(() => {
    if (isCached) return;

    const img = new Image();
    img.onload = () => {
      imageCache.add(src);
      setStatus("loaded");
    };
    img.onerror = () => setStatus("error");
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, isCached]);

  if (status === "error") {
    return <PreviewFallback />;
  }

  return (
    <div className="bg-tertiary relative aspect-[40/21] w-full overflow-hidden">
      {status === "loading" && <PlaceholderShader />}
      {status === "loaded" && (
        <picture className="absolute inset-0">
          {srcDark && <source srcSet={srcDark} media="(prefers-color-scheme: dark)" />}
          <img
            src={src}
            alt={`Preview of ${name}`}
            className="h-full w-full object-cover object-top"
          />
        </picture>
      )}
    </div>
  );
}

interface PreviewCardProviderProps {
  children: ReactNode;
}

// Hook to detect touch/hover-less devices using useSyncExternalStore
const touchMediaQuery = "(hover: none)";

function subscribeTouchDevice(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia(touchMediaQuery);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshotTouchDevice() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(touchMediaQuery).matches;
}

function getServerSnapshotTouchDevice() {
  return false; // Assume non-touch on server
}

function useIsTouchDevice() {
  return useSyncExternalStore(
    subscribeTouchDevice,
    getSnapshotTouchDevice,
    getServerSnapshotTouchDevice,
  );
}

export function PreviewCardProvider({ children }: PreviewCardProviderProps) {
  const handle = useMemo(() => BaseUITooltip.Tooltip.createHandle<PreviewCardPayload>(), []);
  const isTouchDevice = useIsTouchDevice();

  const contextValue = useMemo(() => ({ handle, isTouchDevice }), [handle, isTouchDevice]);

  return (
    <PreviewCardContext.Provider value={contextValue}>
      {children}
      <BaseUITooltip.Tooltip.Root handle={handle} trackCursorAxis="x">
        {({ payload }) => (
          <BaseUITooltip.Tooltip.Portal>
            <BaseUITooltip.Tooltip.Positioner
              side="bottom"
              sideOffset={8}
              collisionPadding={20}
              collisionAvoidance={{ side: "flip", align: "shift" }}
              className="pointer-events-none z-50"
            >
              <BaseUITooltip.Tooltip.Popup
                className={cn(
                  "border-secondary bg-primary shadow-lg",
                  "w-[400px] overflow-hidden rounded-lg border",
                  "origin-(--transform-origin)",
                  "transition-[transform,scale,opacity]",
                  "data-ending-style:scale-95 data-ending-style:opacity-0",
                  "data-starting-style:scale-95 data-starting-style:opacity-0",
                )}
              >
                {payload && (
                  <div className="flex flex-col">
                    {payload.previewImage ? (
                      <PreviewImage
                        src={payload.previewImage}
                        srcDark={payload.previewImageDark}
                        name={payload.name}
                      />
                    ) : (
                      <PreviewFallback />
                    )}
                    <div className="border-secondary border-t p-3">
                      <div className="font-mono text-xs">
                        <div className="text-primary truncate font-medium">{payload.name}</div>
                        {payload.description && (
                          <div className="text-secondary mt-1 line-clamp-2">
                            {payload.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </BaseUITooltip.Tooltip.Popup>
            </BaseUITooltip.Tooltip.Positioner>
          </BaseUITooltip.Tooltip.Portal>
        )}
      </BaseUITooltip.Tooltip.Root>
    </PreviewCardContext.Provider>
  );
}

interface PreviewCardTriggerProps {
  payload: PreviewCardPayload;
  children: ReactNode;
  className?: string;
}

export function PreviewCardTrigger({ payload, children, className }: PreviewCardTriggerProps) {
  const { handle, isTouchDevice } = usePreviewCardContext();

  // On touch devices, skip the tooltip trigger entirely
  if (isTouchDevice) {
    return <span className={className}>{children}</span>;
  }

  return (
    <BaseUITooltip.Tooltip.Trigger
      handle={handle}
      payload={payload}
      delay={300}
      closeDelay={100}
      className={className}
      render={<span />}
    >
      {children}
    </BaseUITooltip.Tooltip.Trigger>
  );
}
