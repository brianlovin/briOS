"use client";

import * as BaseUITooltip from "@base-ui/react/tooltip";
import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import { cn } from "@/lib/utils";

export type PreviewCardPayload = {
  url: string;
  name: string;
  description?: string;
  icon?: string;
  previewImage?: string;
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

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
      />
    </svg>
  );
}

function PreviewFallback() {
  return (
    <div className="bg-tertiary flex aspect-[40/21] w-full items-center justify-center">
      <GlobeIcon className="text-quaternary size-8" />
    </div>
  );
}

function PreviewImage({ src, name }: { src: string; name: string }) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  if (status === "error") {
    return <PreviewFallback />;
  }

  return (
    <div className="bg-tertiary relative aspect-[40/21] w-full overflow-hidden">
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-quaternary flex flex-col items-center gap-2">
            <GlobeIcon className="size-8" />
          </div>
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`Preview of ${name}`}
        className={cn(
          "h-full w-full object-cover object-top transition-opacity duration-300",
          status === "loaded" ? "opacity-100" : "opacity-0",
        )}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
      />
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
                      <PreviewImage src={payload.previewImage} name={payload.name} />
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
