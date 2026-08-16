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
  test("shows a flag in the icon column and the page link under the summary", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          summary: "🇮🇳 Visit from India",
          subject: { kind: "home", label: "home", href: "/" },
          meta: { country: "IN", country_name: "India", path: "/", title: "home" },
        })}
      />,
    );

    expect(markup).toContain("🇮🇳");
    expect(markup).toContain("Visit from India");
    expect(markup).toContain('href="/"');
    expect(markup).toContain("home");
    expect(markup).not.toContain("text-red-500");
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
    expect(visit).toContain("🇮🇳");
  });

  test("shows a coffee cup for coffee-family caffeine events", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          type: "caffeinated",
          speed: "event",
          summary: "Caffeinated with Cortado",
          subject: { kind: "drink", label: "Cortado" },
          meta: { drink: "Cortado" },
        })}
      />,
    );

    expect(markup).toContain("☕");
    expect(markup).toContain("Caffeinated with Cortado");
    expect(markup).not.toContain("🥤");
  });

  test("shows a cup for celsius, tea, and unknown caffeine events", () => {
    for (const drink of ["Celsius", "Tea", "Mystery Juice"]) {
      const markup = renderToStaticMarkup(
        <ActivityRow
          event={event({
            type: "caffeinated",
            speed: "event",
            summary: `Caffeinated with ${drink}`,
            subject: { kind: "drink", label: drink },
            meta: { drink },
          })}
        />,
      );
      expect(markup).toContain("🥤");
      expect(markup).not.toContain("☕");
    }
  });
});
