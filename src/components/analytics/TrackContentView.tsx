"use client";

import { useEffect, useRef } from "react";

import { type ContentType, trackClientEvent } from "@/lib/client-events";

interface TrackContentViewProps {
  contentType: ContentType;
  contentId: string;
  /** Render an end-of-content marker and report when a reader reaches it. */
  trackReadComplete?: boolean;
}

/**
 * Detail-page engagement: one `content.viewed` per mount, and one
 * `content.read_complete` when the marker (placed after the body) scrolls in.
 */
export function TrackContentView({
  contentType,
  contentId,
  trackReadComplete = false,
}: TrackContentViewProps) {
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackClientEvent("content.viewed", { content_type: contentType, content_id: contentId });
  }, [contentType, contentId]);

  useEffect(() => {
    const marker = markerRef.current;
    if (!trackReadComplete || !marker || typeof IntersectionObserver === "undefined") return;

    const start = performance.now();
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      trackClientEvent("content.read_complete", {
        content_type: contentType,
        content_id: contentId,
        seconds_on_page: Math.round((performance.now() - start) / 1000),
      });
    });
    observer.observe(marker);
    return () => observer.disconnect();
  }, [contentType, contentId, trackReadComplete]);

  return trackReadComplete ? <div ref={markerRef} aria-hidden /> : null;
}
