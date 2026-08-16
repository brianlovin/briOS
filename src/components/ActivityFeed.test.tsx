import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { ActivityRow, TotalsList } from "@/components/ActivityFeed";
import { ActivityLiveBadge, TopBarTrail } from "@/components/GlobalTopBar";
import type { ActivityEvent, ActivityTotal } from "@/lib/activity";

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
  test("shows a flag, then the summary and page link on one line", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          summary: "🇮🇳 Visit from India",
          subject: { kind: "home", label: "a page", href: "/" },
          meta: { country: "IN", country_name: "India", path: "/", title: "a page" },
        })}
      />,
    );

    expect(markup).toContain("🇮🇳");
    expect(markup).toContain("Visit from India");
    expect(markup).toContain('href="/"');
    expect(markup).toContain("Home");
    expect(markup).not.toContain("a page");
    expect(markup).not.toContain("text-red-500");
    expect(markup).toContain("truncate");
    expect(markup).not.toContain("text-sm underline-offset-2");
    expect(markup).not.toContain("block truncate");
  });

  test("strips a short id from a stored writing slug", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          summary: "🇮🇳 Visit from India",
          subject: {
            kind: "writing",
            label: "grok bot first impressions kcJun01",
            href: "/writing/grok-bot-first-impressions-kcJun01",
          },
          meta: { country: "IN", path: "/writing/grok-bot-first-impressions-kcJun01" },
        })}
      />,
    );

    expect(markup).toContain(">grok bot first impressions<");
    expect(markup).toContain('href="/writing/grok-bot-first-impressions-kcJun01"');
  });

  test("shows a Hacker News story instead of a raw story id", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          summary: "🇨🇳 Visit from China",
          subject: { kind: "page", label: "46993596", href: "/hn/46993596" },
          meta: { country: "CN", path: "/hn/46993596", title: "46993596" },
        })}
      />,
    );

    expect(markup).toContain("a Hacker News story");
    expect(markup).toContain('href="/hn/46993596"');
    expect(markup).not.toContain(">46993596<");
  });

  test("rebuilds a country name and flag for older visits that only have a code", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow event={event({ summary: "Visit from TW", meta: { country: "TW" } })} />,
    );
    expect(markup).toContain("🇹🇼");
    expect(markup).toContain("Visit from Taiwan");
  });

  test("uses the globe and mysterious-place copy when a visit has no country", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          summary: "Visit",
          subject: { kind: "home", label: "Home", href: "/" },
        })}
      />,
    );

    expect(markup).toContain("Someone visited from a mysterious place on earth");
    expect(markup).toContain("Home");
    expect(markup).not.toContain(">Visit<");
    expect(markup).not.toContain("🇮🇳");
    expect(markup).not.toContain("text-red-500");
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

  test("uses the Shiori orb for any shiori-sourced event", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          source: "shiori",
          type: "link_saved",
          speed: "event",
          summary: "Someone saved a link on Shiori",
        })}
      />,
    );

    expect(markup).toContain("shiori-icon.png");
    expect(markup).toContain("Someone saved a link on Shiori");
    expect(markup).not.toContain("<a ");
  });

  test("shows a tertiary count next to the title when a stack is larger than one", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          summary: "Visit from Spring Lake, North Carolina, United States",
          subject: {
            kind: "ama",
            label: "2f2c711c-0ceb-810d-899d-e5feb99e70f4",
            href: "/ama/2f2c711c-0ceb-810d-899d-e5feb99e70f4",
          },
          meta: {
            country: "US",
            country_name: "United States",
            region: "NC",
            region_name: "North Carolina",
            city: "Spring Lake",
            path: "/ama/2f2c711c-0ceb-810d-899d-e5feb99e70f4",
          },
        })}
        count={6}
        sectionLabel="an AMA question"
        href="/ama"
      />,
    );

    expect(markup).toContain("Visit from Spring Lake, North Carolina, United States");
    expect(markup).toContain("> 6<");
    expect(markup).toContain("text-tertiary");
    expect(markup).toContain("an AMA question");
    expect(markup).toContain('href="/ama"');
    expect(markup).not.toContain("2f2c711c-0ceb-810d-899d-e5feb99e70f4");
    expect(markup).toMatch(
      /text-primary[^>]*>Visit from Spring Lake[\s\S]*text-tertiary[^>]*> 6<[\s\S]*href="\/ama"[^>]*>an AMA question/,
    );
  });

  test("pulses the row background only when asked", () => {
    const pulsed = renderToStaticMarkup(
      <ActivityRow event={event({ summary: "Visit from India" })} pulse />,
    );
    const quiet = renderToStaticMarkup(
      <ActivityRow event={event({ summary: "Visit from India" })} />,
    );

    expect(pulsed).toContain("data-rollup-pulse");
    expect(pulsed).toContain("bg-secondary");
    expect(pulsed).toContain("duration-500");
    expect(quiet).not.toContain("data-rollup-pulse");
  });
});

describe("TotalsList", () => {
  test("renders a compact mono log and hides visit_country_first", () => {
    const totals: ActivityTotal[] = [
      { source: "brios", type: "visit", count: 12, first_seen: "2026-08-16T00:00:00.000Z" },
      {
        source: "brios",
        type: "visit_country_first",
        count: 3,
        first_seen: "2026-08-16T00:00:00.000Z",
      },
      { source: "brios", type: "like", count: 4, first_seen: "2026-08-16T00:00:00.000Z" },
    ];
    const markup = renderToStaticMarkup(<TotalsList totals={totals} />);
    expect(markup).toContain("font-mono");
    expect(markup).toContain("tabular-nums");
    expect(markup).toContain("Visits");
    expect(markup).toContain("Likes");
    expect(markup).toContain("12");
    expect(markup).not.toContain("New countries");
    expect(markup).not.toContain("visit_country_first");
  });
});

describe("ActivityLiveBadge", () => {
  test("is a quiet green live pill with a pulsing dot", () => {
    const markup = renderToStaticMarkup(<ActivityLiveBadge />);
    expect(markup).toContain("Live");
    expect(markup).toContain("animate-pulse");
    expect(markup).toContain("bg-green-500");
    expect(markup).toContain("text-green-700");
  });

  test("appears after the Activity crumb and not on other pages", () => {
    const activity = renderToStaticMarkup(<TopBarTrail pathname="/activity" />);
    const writing = renderToStaticMarkup(<TopBarTrail pathname="/writing" />);
    expect(activity).toContain("Activity");
    expect(activity).toContain("Live");
    expect(activity).toContain("animate-pulse");
    expect(writing).toContain("Writing");
    expect(writing).not.toContain("Live");
  });
});
