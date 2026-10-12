/**
 * Client → /api/events → Axiom. Only events listed here are accepted by the
 * endpoint; the server adds coarse geo, visitor hash, and user agent.
 */

export type ContentType =
  | "writing"
  | "til"
  | "computer"
  | "ama"
  | "design_details"
  | "app_dissection"
  | "hn_post"
  | "guide";

export type FilterSurface = "sites" | "stack";

export interface ClientEventFieldMap {
  "content.viewed": {
    content_type: ContentType;
    content_id: string;
  };
  "content.read_complete": {
    content_type: ContentType;
    content_id: string;
    seconds_on_page: number;
  };
  "outbound.clicked": {
    url: string;
    item_type?: string;
    item_id?: string;
    item_name?: string;
  };
  "filter.changed": {
    surface: FilterSurface;
    filter: "tag" | "status" | "platform" | "view" | "sort";
    value: string;
  };
  "command_menu.opened": Record<string, never>;
  "command_menu.selected": {
    query: string;
    destination: string;
  };
  "hn.cli_command_copied": Record<string, never>;
  "activity.item_clicked": {
    href: string;
    external: boolean;
  };
}

export type ClientEventName = keyof ClientEventFieldMap;

/** Fields every client event carries, filled in by `trackClientEvent`. */
export interface ClientEventEnvelope {
  path: string;
  referrer?: string;
}

export const CLIENT_EVENTS_ENDPOINT = "/api/events";

function externalReferrer(): string | undefined {
  if (!document.referrer) return undefined;
  try {
    const url = new URL(document.referrer);
    return url.host === window.location.host ? undefined : url.host;
  } catch {
    return undefined;
  }
}

export function trackClientEvent<E extends ClientEventName>(
  event: E,
  data: ClientEventFieldMap[E],
  path?: string,
): void {
  if (typeof window === "undefined") return;

  const envelope: ClientEventEnvelope = {
    path: path ?? window.location.pathname,
    referrer: externalReferrer(),
  };
  const body = JSON.stringify({ event, data, ...envelope });

  try {
    if (
      navigator.sendBeacon?.(CLIENT_EVENTS_ENDPOINT, new Blob([body], { type: "application/json" }))
    ) {
      return;
    }
  } catch {
    // Fall through to fetch.
  }

  void fetch(CLIENT_EVENTS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}
