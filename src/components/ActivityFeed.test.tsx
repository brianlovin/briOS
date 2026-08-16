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

  test("shows the official GitHub mark on star and PR rows", () => {
    const officialMark = "M12 2C6.477 2 2 6.477 2 12c0 4.42";
    const pulse = "M4.75 11.75H8.25L10.25 4.75";

    const starred = renderToStaticMarkup(
      <ActivityRow
        event={event({
          source: "github",
          type: "repo_starred",
          speed: "event",
          summary: "Someone starred brios",
        })}
      />,
    );
    const prOpened = renderToStaticMarkup(
      <ActivityRow
        event={event({
          type: "pr_opened",
          speed: "event",
          summary: "Opened a pull request",
        })}
      />,
    );
    const visit = renderToStaticMarkup(
      <ActivityRow
        event={event({
          summary: "🇮🇳 Visit from India",
          meta: { country: "IN" },
        })}
      />,
    );

    expect(starred).toContain(officialMark);
    expect(starred).toContain("text-primary");
    expect(starred).not.toContain(pulse);
    expect(prOpened).toContain(officialMark);
    expect(prOpened).not.toContain(pulse);
    expect(visit).not.toContain(officialMark);
  });
});
