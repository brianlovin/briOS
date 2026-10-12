"use client";

import { useEffect } from "react";

import { trackClientEvent } from "@/lib/client-events";

/** Optional item metadata read from the closest ancestor of a clicked link. */
export function outboundItemAttributes(item: {
  type: string;
  id?: string;
  name?: string;
}): Record<string, string | undefined> {
  return {
    "data-outbound-item-type": item.type,
    "data-outbound-item-id": item.id,
    "data-outbound-item-name": item.name,
  };
}

export function trackOutbound(url: string, from?: Element | null): void {
  const item = from?.closest<HTMLElement>("[data-outbound-item-type]")?.dataset;
  trackClientEvent("outbound.clicked", {
    url,
    item_type: item?.outboundItemType,
    item_id: item?.outboundItemId,
    item_name: item?.outboundItemName,
  });
}

function externalHref(anchor: HTMLAnchorElement): string | null {
  try {
    const url = new URL(anchor.href, window.location.href);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.host === window.location.host ? null : url.href;
  } catch {
    return null;
  }
}

/** One delegated listener for every external link click (left or middle). */
export function OutboundLinkTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.button > 1) return;
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const href = externalHref(anchor);
      if (href) trackOutbound(href, anchor);
    };

    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("auxclick", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("auxclick", onClick, { capture: true });
    };
  }, []);

  return null;
}
