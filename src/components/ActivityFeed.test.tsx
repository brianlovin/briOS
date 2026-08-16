import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { ActivityRow } from "@/components/ActivityFeed";
import type { ActivityEvent } from "@/lib/activity";

function event(overrides: Partial<ActivityEvent>): ActivityEvent {
  return {
    v: 1,
    id: "evt",
    ts: "2026-08-16T00:00:00.000Z",
    received_at: "2026-08-16T00:00:00.000Z",
    source: "brios",
    type: "visit",
    speed: "signal",
    summary: "🇮🇳 Visit from India",
    visibility: "public",
    idempotency_key: "k",
    ...overrides,
  };
}

describe("ActivityRow", () => {
  test("shows the site favicon and keeps the flag in the title", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          summary: "🇮🇳 Visit from India",
          subject: { kind: "home", label: "home", href: "/" },
          meta: { country: "IN", country_name: "India", path: "/", title: "home" },
        })}
      />,
    );

    expect(markup).toContain("🇮🇳 Visit from India");
    expect(markup).toContain("/activity/favicons/brios.png");
    expect(markup).toContain('href="/"');
    expect(markup).toContain("home");
    expect(markup).not.toContain("text-red-500");
  });

  test("uses the event source favicon for visits and downloads", () => {
    const visit = renderToStaticMarkup(
      <ActivityRow
        event={event({
          source: "tax-ui",
          summary: "🇺🇸 Visit from United States",
          meta: { country: "US" },
        })}
      />,
    );
    const download = renderToStaticMarkup(
      <ActivityRow
        event={event({
          source: "design-details",
          type: "download",
          speed: "event",
          summary: "Someone downloaded Design Details",
          subject: { kind: "download", label: "Design Details" },
        })}
      />,
    );
    const unknown = renderToStaticMarkup(
      <ActivityRow
        event={event({
          source: "unknown",
          summary: "🇺🇸 Visit from United States",
          meta: { country: "US" },
        })}
      />,
    );

    expect(visit).toContain("/activity/favicons/tax-ui.png");
    expect(visit).toContain("🇺🇸 Visit from United States");
    expect(download).toContain("/activity/favicons/design-details.png");
    expect(download).toContain("Someone downloaded Design Details");
    expect(unknown).not.toContain("/activity/favicons/");
    expect(unknown).toContain("🇺🇸 Visit from United States");
  });

  test("rebuilds a country name and flag for older visits that only have a code", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow event={event({ summary: "Visit from TW", meta: { country: "TW" } })} />,
    );
    expect(markup).toContain("🇹🇼");
    expect(markup).toContain("Visit from Taiwan");
  });

  test("shows a red heart on like rows only", () => {
    const like = renderToStaticMarkup(
      <ActivityRow
        event={event({
          type: "like",
          speed: "event",
          summary: "Someone liked Grok Bot first impressions",
          subject: {
            kind: "writing",
            label: "Grok Bot first impressions",
            href: "/writing/grok-bot-first-impressions",
          },
        })}
      />,
    );
    const visit = renderToStaticMarkup(
      <ActivityRow
        event={event({
          summary: "🇮🇳 Visit from India",
          subject: { kind: "writing", label: "a post", href: "/writing/a-post" },
          meta: { country: "IN" },
        })}
      />,
    );

    expect(like).toContain("text-red-500");
    expect(like).toContain("Someone liked Grok Bot first impressions");
    expect(like).toContain('href="/writing/grok-bot-first-impressions"');
    expect(visit).not.toContain("text-red-500");
    expect(visit).toContain("🇮🇳 Visit from India");
    expect(visit).toContain("/activity/favicons/brios.png");
    expect(like).not.toContain("/activity/favicons/");
  });
});
