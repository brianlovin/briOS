import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { ActivityFeed, ActivityRow, ActivityTrackedCount } from "@/components/ActivityFeed";
import { ActivityLiveBadge, TopBarTrail } from "@/components/GlobalTopBar";
import type { ActivityEvent } from "@/lib/activity";
import { rollupActivityEvents } from "@/lib/activity-rollup";
import { ACTIVITY_TRACKED_SINCE_TOOLTIP, formatTrackedEventsLabel } from "@/lib/activity-shared";

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
  test("shows the site favicon and omits the flag from the title", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          summary: "🇮🇳 Visit from India",
          subject: { kind: "home", label: "a page", href: "/" },
          meta: { country: "IN", country_name: "India", path: "/", title: "a page" },
        })}
      />,
    );

    expect(markup).toContain("Visit from India");
    expect(markup).not.toContain("🇮🇳");
    expect(markup).toContain("/activity/favicons/brios.png");
    expect(markup).toContain('href="/"');
    expect(markup).toContain("Home");
    expect(markup).not.toContain("a page");
    expect(markup).not.toContain("text-red-500");
    expect(markup).toContain("truncate");
    expect(markup).not.toContain("text-sm underline-offset-2");
    expect(markup).not.toContain("block truncate");
  });

  test("renders an exact stored writing title, including I'm and AI", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          summary: "🇮🇳 Visit from India",
          subject: {
            kind: "writing",
            label: "How I'm Feeling About AI in August 2026",
            href: "/writing/how-im-feeling-about-ai-in-august-2026-O7e1TFS",
          },
          meta: {
            country: "IN",
            path: "/writing/how-im-feeling-about-ai-in-august-2026-O7e1TFS",
            title: "How I'm Feeling About AI in August 2026",
          },
        })}
      />,
    );

    expect(markup).toContain("How I&#x27;m Feeling About AI in August 2026");
    expect(markup).not.toContain("How Im Feeling About Ai in August 2026");
    expect(markup).toContain('href="/writing/how-im-feeling-about-ai-in-august-2026-O7e1TFS"');
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

    expect(markup).toContain(">Grok Bot First Impressions<");
    expect(markup).toContain('href="/writing/grok-bot-first-impressions-kcJun01"');
  });

  test("does not render Https: for a visit whose href is an absolute briOS URL", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          summary: "🇺🇸 Visit from San Francisco, California, United States",
          subject: {
            kind: "writing",
            label: "a page",
            href: "https://brianlovin.com/writing/foo",
          },
          meta: {
            country: "US",
            city: "San Francisco",
            path: "https://brianlovin.com/writing/foo",
          },
        })}
      />,
    );

    expect(markup).toContain("Foo");
    expect(markup).toContain('href="https://brianlovin.com/writing/foo"');
    expect(markup).not.toContain(">Https:<");
    expect(markup).not.toContain(">https:<");
    expect(markup).not.toContain('href="/https:"');
  });

  test("does not render Https: when two SF visits to absolute URLs are stacked", () => {
    const visit = (id: string, href: string, label: string): ActivityEvent =>
      event({
        id,
        summary: "Visit from San Francisco, California, United States",
        subject: { kind: "page", label, href },
        meta: {
          country: "US",
          country_name: "United States",
          region: "CA",
          region_name: "California",
          city: "San Francisco",
          path: href,
        },
      });

    const stacks = rollupActivityEvents([
      visit("sf-1", "https://brianlovin.com/writing/foo", "Foo"),
      visit("sf-2", "https://brianlovin.com/writing/bar", "Bar"),
    ]);
    const markup = stacks
      .map((stack) =>
        renderToStaticMarkup(
          <ActivityRow
            event={stack.latest}
            count={stack.count}
            sectionLabel={stack.sectionLabel}
            href={stack.href}
          />,
        ),
      )
      .join("\n");

    expect(markup).toContain("Writing");
    expect(markup).not.toContain(">Https:<");
    expect(markup).not.toContain(">https:<");
    expect(markup).not.toContain('href="/https:"');
  });

  test("title-cases a stored App Dissection slug", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          summary: "🇫🇷 Visit from France",
          subject: {
            kind: "app_dissection",
            label: "secret for ios",
            href: "/app-dissection/secret-for-ios",
          },
          meta: { country: "FR", path: "/app-dissection/secret-for-ios" },
        })}
      />,
    );

    expect(markup).toContain(">Secret for iOS App Dissection<");
    expect(markup).toContain('href="/app-dissection/secret-for-ios"');
    expect(markup).not.toContain(">secret for ios<");
    expect(markup).not.toContain(">Secret for iOS<");
  });

  test("labels an HN index visit as Hacker News, not a story", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          summary: "🇺🇸 Visit from San Francisco, California, United States",
          subject: { kind: "page", label: "a page", href: "/hn" },
          meta: { country: "US", path: "/hn" },
        })}
      />,
    );

    expect(markup).toContain("Hacker News");
    expect(markup).toContain('href="/hn"');
    expect(markup).not.toContain("a Hacker News story");
  });

  test("labels an Instagram iOS dissection visit with the section name", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          summary: "🇺🇸 Visit from United States",
          subject: {
            kind: "app_dissection",
            label: "Instagram",
            href: "/app-dissection/instagram-ios",
          },
          meta: { country: "US", path: "/app-dissection/instagram-ios" },
        })}
      />,
    );

    expect(markup).toContain(">Instagram App Dissection<");
    expect(markup).toContain('href="/app-dissection/instagram-ios"');
    expect(markup).not.toContain(">Instagram<");
  });

  test("shows a stored HN story title instead of the generic phrase", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          summary: "🇺🇸 Visit from United States",
          subject: { kind: "page", label: "Some HN Story", href: "/hn/42991019" },
          meta: { country: "US", path: "/hn/42991019", title: "Some HN Story" },
        })}
      />,
    );

    expect(markup).toContain(">Some HN Story<");
    expect(markup).toContain('href="/hn/42991019"');
    expect(markup).not.toContain("a Hacker News story");
    expect(markup).not.toContain(">42991019<");
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
    expect(visit).toContain("Visit from United States");
    expect(visit).not.toContain("🇺🇸");
    expect(visit).toContain('width="16"');
    expect(visit).toContain('height="16"');
    expect(visit).toContain("size-4");
    expect(download).toContain("/activity/favicons/design-details.png");
    expect(download).toContain("Someone downloaded");
    expect(download).not.toContain("Someone downloaded Design Details");
    expect(download).toContain(">Design Details<");
    expect(download).toContain('href="https://designdetails.fm"');
    expect(download).toContain('target="_blank"');
    expect(download).toContain("noopener noreferrer");
    expect(unknown).not.toContain("/activity/favicons/");
    expect(unknown).toContain("Visit from United States");
    expect(unknown).not.toContain("🇺🇸");
  });

  test("renders the staff.design favicon at 20px so it matches the GitHub mark", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          source: "staff-design",
          summary: "🇺🇸 Visit from United States",
          meta: { country: "US" },
        })}
      />,
    );

    expect(markup).toContain("/activity/favicons/staff-design.png");
    expect(markup).toContain('width="20"');
    expect(markup).toContain('height="20"');
    expect(markup).toContain("size-5");
    expect(markup).not.toContain("size-4");
  });

  test("rebuilds a country name without a flag emoji for older visits that only have a code", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow event={event({ summary: "Visit from TW", meta: { country: "TW" } })} />,
    );
    expect(markup).not.toContain("🇹🇼");
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
    expect(like).toContain("Someone liked");
    expect(like).toContain(">Grok Bot first impressions<");
    expect(like).not.toContain("Someone liked Grok Bot first impressions");
    expect(like).toContain('href="/writing/grok-bot-first-impressions"');
    expect(visit).not.toContain("text-red-500");
    expect(visit).toContain("Visit from India");
    expect(visit).not.toContain("🇮🇳");
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
      expect(markup).toContain('width="20"');
      expect(markup).toContain('height="20"');
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

    expect(markup).toContain("Someone downloaded");
    expect(markup).not.toContain("Someone downloaded Tax UI");
    expect(markup).toContain(">Tax UI<");
    expect(markup).toContain('href="https://tax-ui.brianlovin.com/"');
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain("noopener noreferrer");
  });

  test("renders a stored private opened PR as a single phrase", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          source: "github",
          type: "pr_opened",
          speed: "event",
          summary: "Opened a pull request",
          subject: { kind: "pull_request", label: "a pull request" },
          meta: { private: true, number: 1 },
        })}
      />,
    );

    expect(markup).toContain("Opened a pull request in a private repo");
    expect(markup).not.toContain("A Pull Request");
    expect(markup).not.toContain("<a ");
    expect(markup).not.toContain("href=");
  });

  test("renders a stored private merged PR as a single phrase", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          source: "github",
          type: "pr_merged",
          speed: "event",
          summary: "Merged a pull request",
          subject: { kind: "pull_request", label: "a pull request" },
          meta: { private: true, number: 2 },
        })}
      />,
    );

    expect(markup).toContain("Merged a pull request in a private repo");
    expect(markup).not.toContain("A Pull Request");
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
    expect(markup).toContain(">Add activity feed<");
    expect(markup).toContain('href="https://github.com/brianlovin/briOS/pull/42"');
    expect(markup).toContain('target="_blank"');
    expect(markup).not.toContain(">GitHub<");
    expect(markup).toContain("M12 2C6.477 2 2 6.477 2 12c0 4.42");
    expect(markup).not.toContain("text-red-500");
    expect(markup).not.toContain(">https:<");
    expect(markup).not.toContain('href="/https:"');
  });

  test("renders two public merges on the same repo as separate titled rows", () => {
    const merge = (id: string, number: number, title: string): ActivityEvent =>
      event({
        id,
        source: "github",
        type: "pr_merged",
        speed: "event",
        summary: "Merged a pull request on designdetails",
        subject: {
          kind: "pull_request",
          label: title,
          href: `https://github.com/designdetails/designdetails/pull/${number}`,
        },
        meta: {
          repo: "designdetails",
          title,
          number,
          href: `https://github.com/designdetails/designdetails/pull/${number}`,
          additions: 13,
          deletions: 2,
        },
      });

    const stacks = rollupActivityEvents([
      merge("pr-719", 719, "Fix player skip"),
      merge("pr-720", 720, "Tweak chapter marks"),
    ]);
    expect(stacks).toHaveLength(2);

    const markup = stacks
      .map((stack) =>
        renderToStaticMarkup(
          <ActivityRow
            event={stack.latest}
            count={stack.count}
            sectionLabel={stack.sectionLabel}
            href={stack.href}
          />,
        ),
      )
      .join("\n");

    expect(markup).toContain("Fix player skip");
    expect(markup).toContain("Tweak chapter marks");
    expect(markup).toContain('href="https://github.com/designdetails/designdetails/pull/719"');
    expect(markup).toContain('href="https://github.com/designdetails/designdetails/pull/720"');
    expect(markup).toContain('target="_blank"');
    expect(markup).not.toContain('href="/https:"');
    expect(markup).not.toContain(">https:<");
  });

  test("puts merge diff stats after the repo/PR context", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          source: "github",
          type: "pr_merged",
          speed: "event",
          summary: "Merged some-fix",
          subject: {
            kind: "pull_request",
            label: "brianlovin/briOS#12",
            href: "https://github.com/brianlovin/briOS/pull/12",
          },
          meta: {
            repo: "briOS",
            title: "some-fix",
            number: 12,
            href: "https://github.com/brianlovin/briOS/pull/12",
            additions: 18,
            deletions: 3,
            changed_files: 2,
          },
        })}
        count={2}
      />,
    );

    expect(markup).toContain("Merged some-fix");
    expect(markup).toContain("brianlovin/briOS#12");
    expect(markup).toContain("+18");
    expect(markup).toContain("-3");
    expect(markup).toContain("text-green-600");
    expect(markup).toContain("text-red-500");
    expect(markup).toContain("tabular-nums");
    expect(markup).not.toContain("+18 -3");
    expect(markup).toMatch(
      /text-primary[^>]*>Merged some-fix[\s\S]*href="https:\/\/github.com\/brianlovin\/briOS\/pull\/12"[^>]*>brianlovin\/briOS#12[\s\S]*data-count="2"[\s\S]*\+18[\s\S]*-3/,
    );
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

  test("shows a liked stack app name without a Stack subtitle", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          type: "like",
          speed: "event",
          summary: "Someone liked Cursor",
          subject: { kind: "stack", label: "Cursor", href: "https://cursor.com" },
        })}
      />,
    );

    expect(markup).toContain("Someone liked");
    expect(markup).toContain(">Cursor<");
    expect(markup).not.toContain("Someone liked Cursor");
    expect(markup).toContain('href="https://cursor.com"');
    expect(markup).toContain("text-red-500");
    expect(markup).not.toContain(">Stack<");
  });

  test("does not use a Stack section label when the like title is the app", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          type: "like",
          speed: "event",
          summary: "Someone liked Cursor",
          subject: { kind: "stack", label: "Cursor", href: "/stack" },
        })}
        sectionLabel="Stack"
        href="/stack"
      />,
    );

    expect(markup).toContain("Someone liked");
    expect(markup).toContain(">Cursor<");
    expect(markup).not.toContain("Someone liked Cursor");
    expect(markup).not.toContain(">Stack<");
  });

  test("renders a stored Home like as Someone liked plus a Home link", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          type: "like",
          speed: "event",
          summary: "Someone liked a page",
          subject: { kind: "home", label: "a page", href: "/" },
        })}
      />,
    );

    expect(markup).toContain("Someone liked");
    expect(markup).toContain(">Home<");
    expect(markup).toContain('href="/"');
    expect(markup).not.toContain("Someone liked a page");
    expect(markup).not.toContain("Someone liked Home");
    expect(markup).not.toContain("a page");
  });

  test("keeps a like title as tertiary text when there is no href", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          type: "like",
          speed: "event",
          summary: "Someone liked How to give a great product design portfolio presentation",
          subject: {
            kind: "writing",
            label: "How to give a great product design portfolio presentation",
          },
        })}
      />,
    );

    expect(markup).toContain("Someone liked");
    expect(markup).toContain("text-tertiary");
    expect(markup).toContain("How to give a great product design portfolio presentation");
    expect(markup).not.toContain("<a ");
    expect(markup).not.toContain("Someone liked How to give");
    expect(markup).not.toMatch(/Someone liked\s{2,}/);
  });

  test("keeps the like title once and the count chip after it", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          type: "like",
          speed: "event",
          summary: "Someone liked Cursor",
          subject: { kind: "stack", label: "Cursor", href: "https://cursor.com" },
        })}
        count={2}
      />,
    );

    expect(markup).toMatch(
      /text-primary[^>]*>Someone liked[\s\S]*href="https:\/\/cursor.com"[^>]*>Cursor[\s\S]*data-count="2"/,
    );
    expect(markup).not.toContain("Someone liked Cursor");
    expect(markup).not.toContain('data-count="1"');
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
    expect(markup).toContain("Someone saved a link");
    expect(markup).not.toContain("Someone saved a link on Shiori");
    expect(markup).toContain(">Shiori<");
    expect(markup).toContain('href="https://www.shiori.sh"');
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain("noopener noreferrer");
  });

  test("lifts Shiori out of click, signup, subscribe, and download copy", () => {
    const cases = [
      {
        type: "link_clicked" as const,
        summary: "Someone clicked a link on Shiori",
        stripped: "Someone clicked a link",
      },
      {
        type: "signed_up" as const,
        summary: "Someone signed up for Shiori",
        stripped: "Someone signed up",
      },
      {
        type: "subscription_started" as const,
        summary: "Someone subscribed on Shiori",
        stripped: "Someone subscribed",
      },
      {
        type: "download" as const,
        summary: "Someone downloaded Shiori",
        stripped: "Someone downloaded",
      },
    ];

    for (const { type, summary, stripped } of cases) {
      const markup = renderToStaticMarkup(
        <ActivityRow
          event={event({
            source: "shiori",
            type,
            speed: "event",
            summary,
          })}
        />,
      );

      expect(markup).toContain(stripped);
      expect(markup).not.toContain(summary);
      expect(markup).toContain(">Shiori<");
      expect(markup).toContain('href="https://www.shiori.sh"');
      expect(markup).toContain('target="_blank"');
    }
  });

  test("links staff.design and Design Details visits to the product home", () => {
    const staff = renderToStaticMarkup(
      <ActivityRow
        event={event({
          source: "staff-design",
          summary: "🇺🇸 Visit from United States",
          meta: { country: "US" },
        })}
      />,
    );
    const details = renderToStaticMarkup(
      <ActivityRow
        event={event({
          source: "design-details",
          summary: "🇺🇸 Visit from San Francisco, California, United States",
          subject: { kind: "home", label: "Home", href: "/" },
          meta: { country: "US", city: "San Francisco", path: "/" },
        })}
      />,
    );

    expect(staff).toContain("Visit from United States");
    expect(staff).not.toContain("🇺🇸");
    expect(staff).toContain(">Staff Design<");
    expect(staff).toContain('href="https://staff.design"');
    expect(staff).toContain('target="_blank"');
    expect(details).toContain("Visit from San Francisco");
    expect(details).toContain(">Design Details<");
    expect(details).toContain('href="https://designdetails.fm"');
    expect(details).toContain('target="_blank"');
    expect(details).not.toContain(">Home<");
  });

  test("keeps a specific staff.design page as the new-tab link", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          source: "staff-design",
          summary: "🇩🇪 Visit from Germany",
          subject: {
            kind: "page",
            label: "Karla Mickens Cole",
            href: "/karla-mickens-cole",
          },
          meta: { country: "DE", path: "/karla-mickens-cole", title: "Karla Mickens Cole" },
        })}
      />,
    );

    expect(markup).toContain("Visit from Germany");
    expect(markup).not.toContain("🇩🇪");
    expect(markup).toContain(">Karla Mickens Cole<");
    expect(markup).toContain('href="https://staff.design/karla-mickens-cole"');
    expect(markup).toContain('target="_blank"');
    expect(markup).not.toContain(">Staff Design<");
  });

  test("keeps first-party likes and visits on the page, not briOS", () => {
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
          subject: { kind: "home", label: "a page", href: "/" },
          meta: { country: "IN", path: "/", title: "a page" },
        })}
      />,
    );

    expect(like).toContain(">Grok Bot first impressions<");
    expect(like).toContain('href="/writing/grok-bot-first-impressions"');
    expect(like).not.toContain(">briOS<");
    expect(like).not.toContain('target="_blank"');
    expect(visit).toContain(">Home<");
    expect(visit).toContain('href="/"');
    expect(visit).not.toContain(">briOS<");
    expect(visit).not.toContain('target="_blank"');
  });

  test("renders a Shiori link_clicked row without leaking the saved URL", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          source: "shiori",
          type: "link_clicked",
          speed: "event",
          summary: "Someone clicked a link on Shiori",
          subject: { kind: "link", label: "A saved page", href: "https://example.com/secret" },
        })}
      />,
    );

    expect(markup).toContain("shiori-icon.png");
    expect(markup).toContain("Someone clicked a link");
    expect(markup).not.toContain("Someone clicked a link on Shiori");
    expect(markup).toContain(">Shiori<");
    expect(markup).toContain('href="https://www.shiori.sh"');
    expect(markup).not.toContain("A saved page");
    expect(markup).not.toContain("example.com");
    expect(markup).not.toContain("example.com/secret");
  });

  test("shows a quiet count chip after the metadata when a stack is larger than one", () => {
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
    expect(markup).toContain('data-count="6"');
    expect(markup).toContain("text-tertiary");
    expect(markup).toContain("font-mono");
    expect(markup).toContain("rounded-sm");
    expect(markup).toContain("border-secondary");
    expect(markup).toContain("tabular-nums");
    expect(markup).toContain("inline-flex");
    expect(markup).toContain("an AMA question");
    expect(markup).toContain('href="/ama"');
    expect(markup).not.toContain("2f2c711c-0ceb-810d-899d-e5feb99e70f4");
    expect(markup).toMatch(
      /text-primary[^>]*>Visit from Spring Lake[\s\S]*href="\/ama"[^>]*>an AMA question[\s\S]*data-count="6"/,
    );
    const title = markup.match(/<p class="relative z-10[\s\S]*?<\/p>/)?.[0] ?? "";
    expect(title).toContain("data-count");
    expect(title).not.toContain("<div");

    const single = renderToStaticMarkup(
      <ActivityRow
        event={event({
          summary: "Visit from Spring Lake, North Carolina, United States",
          meta: { country: "US", path: "/ama" },
        })}
        count={1}
        sectionLabel="an AMA question"
        href="/ama"
      />,
    );
    expect(single).not.toContain("font-mono");
    expect(single).not.toContain(">1<");
  });

  test("pulses the row background only when asked", () => {
    const pulsed = renderToStaticMarkup(
      <ActivityRow event={event({ summary: "Visit from India" })} pulse />,
    );
    const quiet = renderToStaticMarkup(
      <ActivityRow event={event({ summary: "Visit from India" })} />,
    );

    expect(pulsed).toContain("data-rollup-pulse");
    expect(pulsed).toContain("activity-rollup-pulse");
    expect(pulsed).toContain("bg-secondary");
    expect(pulsed).not.toContain("transition-colors");
    expect(pulsed).not.toContain("duration-500");
    expect(quiet).not.toContain("data-rollup-pulse");
    expect(quiet).not.toContain("activity-rollup-pulse");
    expect(quiet).not.toContain("border-b");
    expect(quiet).not.toContain("border-secondary");
    expect(quiet).not.toContain("transition-colors");
    expect(quiet).not.toContain("duration-500");
  });

  test("keeps the title on one line and sticks time to the right on mobile", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          source: "github",
          type: "pr_merged",
          speed: "event",
          summary: "Merged some-fix",
          subject: {
            kind: "pull_request",
            label: "brianlovin/briOS#12",
            href: "https://github.com/brianlovin/briOS/pull/12",
          },
          meta: { additions: 18, deletions: 3 },
        })}
      />,
    );

    expect(markup).toContain("whitespace-nowrap");
    expect(markup).toContain("md:truncate");
    expect(markup).toContain("sticky");
    expect(markup).toContain("right-0");
    expect(markup).toContain("ml-auto");
    expect(markup).toContain("w-max");
    expect(markup).toContain("min-w-full");
    expect(markup).toContain("inset_1px_0_0");
    expect(markup).toContain("group-hover:bg-inherit");
    expect(markup).toContain("group-data-[rollup-pulse]:bg-inherit");
    expect(markup).toContain("md:static");
    expect(markup).toContain("md:grid-cols-[2rem_minmax(0,1fr)_auto]");
    expect(markup).toContain("hover:bg-secondary");
    expect(markup).not.toContain("transition-colors");
    expect(markup).not.toContain("duration-500");
    expect(markup).toMatch(/Merged some-fix[\s\S]*brianlovin\/briOS#12[\s\S]*\+18[\s\S]*-3/);
  });
});

describe("ActivityFeed", () => {
  test("is a raw stream without Event / Time column headers", () => {
    const markup = renderToStaticMarkup(
      <ActivityFeed
        initialEvents={[
          event({
            id: "visit-1",
            summary: "🇮🇳 Visit from India",
            meta: { country: "IN" },
          }),
        ]}
        initialCount={1}
      />,
    );

    expect(markup).toContain("Visit from India");
    expect(markup).not.toContain("🇮🇳");
    expect(markup).toContain("divide-y");
    expect(markup).toContain("divide-secondary");
    expect(markup).toContain("overflow-hidden");
    expect(markup).toContain("clip-path:inset(0)");
    expect(markup).toContain("min-w-max");
    expect(markup).toContain("min-w-full");
    expect(markup).toContain("w-max");
    expect(markup).toContain("overscroll-contain");
    expect(markup).toContain("whitespace-nowrap");
    expect(markup).toContain("sticky");
    expect(markup).toContain("right-0");
    expect(markup).not.toContain(">Event<");
    expect(markup).not.toContain(">Time<");
    expect(markup).not.toContain("sticky top-0");
    expect(markup).not.toMatch(/opacity:\s*0/);
    expect(markup).not.toContain("translateY(-8");
    expect(markup).not.toContain("y: -8");
  });

  test("first paint of several stacks is static, not an enter cascade", () => {
    const markup = renderToStaticMarkup(
      <ActivityFeed
        initialEvents={[
          event({
            id: "visit-in",
            summary: "Visit from India",
            meta: { country: "IN", path: "/" },
          }),
          event({
            id: "visit-us",
            summary: "Visit from United States",
            meta: { country: "US", city: "San Francisco", path: "/writing" },
          }),
          event({
            id: "like-1",
            type: "like",
            speed: "event",
            summary: "Someone liked Home",
            subject: { kind: "home", label: "Home", href: "/" },
          }),
        ]}
        initialCount={3}
      />,
    );

    expect(markup).toContain("Visit from India");
    expect(markup).toContain("Visit from San Francisco");
    expect(markup).toContain("Someone liked");
    expect(markup).not.toMatch(/opacity:\s*0/);
    expect(markup).not.toContain("height: 0");
    expect(markup).not.toContain("height:0px");
    expect(markup).not.toContain("translateY(-8");
    expect(markup).toContain("clip-path:inset(0)");
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

describe("ActivityTrackedCount", () => {
  test("pluralizes the lifetime label", () => {
    expect(formatTrackedEventsLabel(0)).toBe("0 events tracked");
    expect(formatTrackedEventsLabel(1)).toBe("1 event tracked");
    expect(formatTrackedEventsLabel(2)).toBe("2 events tracked");
    expect(formatTrackedEventsLabel(1500)).toBe("1,500 events tracked");
    expect(ACTIVITY_TRACKED_SINCE_TOOLTIP).toBe("Tracked since August 16, 2026");
  });

  test("renders the count as tertiary top-bar metadata", () => {
    const one = renderToStaticMarkup(<ActivityTrackedCount count={1} />);
    const many = renderToStaticMarkup(<ActivityTrackedCount count={12} />);

    expect(one).toContain("1 event tracked");
    expect(one).toContain("text-tertiary");
    expect(one).toContain("text-sm");
    expect(one).toContain("hidden");
    expect(one).toContain("md:inline");
    expect(many).toContain("12 events tracked");
    expect(many).not.toContain("Live");
  });
});

describe("ActivityFeed", () => {
  test("shows the end-cap after a non-empty feed and not on the empty state", () => {
    const empty = renderToStaticMarkup(<ActivityFeed initialEvents={[]} initialCount={0} />);
    const filled = renderToStaticMarkup(
      <ActivityFeed initialEvents={[event({ id: "evt-1" })]} initialCount={1} />,
    );

    expect(empty).toContain("Nothing yet. Likes and visits will show up here.");
    expect(empty).not.toContain("Older activity is dust in the wind...");
    expect(filled).toContain("Older activity is dust in the wind...");
    expect(filled).toContain("p-32");
    expect(filled).toContain("text-center");
    expect(filled).toContain("text-sm");
    expect(filled).toContain("text-tertiary");
    expect(filled).not.toContain("Nothing yet. Likes and visits will show up here.");
  });
});
