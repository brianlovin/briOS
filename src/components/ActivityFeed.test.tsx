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
    expect(download).toContain("Someone downloaded ");
    expect(download).toContain("Design Details");
    expect(download).toContain('href="https://designdetails.fm"');
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

  test("uses the Github icon for GitHub events instead of the Activity pulse", () => {
    const pulsePath = "M4.75 11.75H8.25L10.25 4.75L13.75 19.25L15.75 11.75H19.25";
    const pulse = renderToStaticMarkup(
      <ActivityRow
        event={event({
          type: "writing_published",
          speed: "event",
          summary: "Published a post",
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
    const prMerged = renderToStaticMarkup(
      <ActivityRow
        event={event({
          source: "github",
          type: "pr_merged",
          speed: "event",
          summary: "Merged a pull request",
        })}
      />,
    );
    const starred = renderToStaticMarkup(
      <ActivityRow
        event={event({
          type: "repo_starred",
          speed: "event",
          summary: "Starred a repository",
        })}
      />,
    );

    expect(pulse).toContain(pulsePath);
    for (const markup of [prOpened, prMerged, starred]) {
      expect(markup).not.toContain(pulsePath);
      expect(markup).toContain("text-primary");
      expect(markup).toContain('width="16"');
      expect(markup).toContain('height="16"');
      expect(markup).not.toContain("#000");
      expect(markup).not.toContain("#fff");
      expect(markup).not.toContain('fill="black"');
      expect(markup).not.toContain('fill="white"');
    }
  });

  test("links Tax UI in a download summary even without subject.href", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          source: "tax-ui",
          type: "download",
          speed: "event",
          summary: "Someone downloaded Tax UI",
        })}
      />,
    );

    expect(markup).toContain("Someone downloaded ");
    expect(markup).toContain("Tax UI");
    expect(markup).toContain('href="https://tax-ui.brianlovin.com/"');
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain("noopener noreferrer");
  });

  test("uses the GitHub icon for github-sourced events", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          source: "github",
          type: "pr_opened",
          speed: "event",
          summary: "Opened a pull request on briOS",
          subject: {
            kind: "pull_request",
            label: "Add activity feed",
            href: "https://github.com/brianlovin/briOS/pull/42",
          },
        })}
      />,
    );

    expect(markup).toContain("Opened a pull request on briOS");
    expect(markup).toContain("Add activity feed");
    expect(markup).toContain("16.0041 19.25 12 19.25");
    expect(markup).not.toContain("text-red-500");
  });

  test("shows merge diff stats in the metadata slot", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          source: "github",
          type: "pr_merged",
          speed: "event",
          summary: "Merged a pull request on briOS",
          subject: {
            kind: "pull_request",
            label: "Add activity feed",
            href: "https://github.com/brianlovin/briOS/pull/42",
          },
          meta: {
            repo: "briOS",
            title: "Add activity feed",
            number: 42,
            href: "https://github.com/brianlovin/briOS/pull/42",
            additions: 311,
            deletions: 211,
            changed_files: 8,
          },
        })}
      />,
    );

    expect(markup).toContain("Merged a pull request on briOS");
    expect(markup).toContain("Add activity feed");
    expect(markup).toContain("+311");
    expect(markup).toContain("-211");
    expect(markup).toContain("text-green-600");
    expect(markup).toContain("text-red-500");
    expect(markup).toContain("tabular-nums");
    expect(markup).not.toContain("+311 -211");
  });

  test("still shows +0 and -0 when both diff fields are zero", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          source: "github",
          type: "pr_merged",
          speed: "event",
          summary: "Merged a pull request on briOS",
          meta: { additions: 0, deletions: 0 },
        })}
      />,
    );

    expect(markup).toContain("+0");
    expect(markup).toContain("-0");
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
