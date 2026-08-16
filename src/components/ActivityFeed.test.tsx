import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { ActivityFeed, ActivityRow, ActivityTrackedCount } from "@/components/ActivityFeed";
import { ActivityLiveBadge, TopBarTrail } from "@/components/GlobalTopBar";
import type { ActivityEvent } from "@/lib/activity";
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
  test("shows the site favicon and keeps the flag in the title", () => {
    const markup = renderToStaticMarkup(
      <ActivityRow
        event={event({
          summary: "🇮🇳 Visit from India",
          subject: { kind: "home", label: "a page", href: "/" },
          meta: { country: "IN", country_name: "India", path: "/", title: "a page" },
        })}
      />,
    );

    expect(markup).toContain("🇮🇳 Visit from India");
    expect(markup).toContain("/activity/favicons/brios.png");
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

    expect(markup).toContain(">Grok Bot First Impressions<");
    expect(markup).toContain('href="/writing/grok-bot-first-impressions-kcJun01"');
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

    expect(markup).toContain(">Secret for iOS<");
    expect(markup).toContain('href="/app-dissection/secret-for-ios"');
    expect(markup).not.toContain(">secret for ios<");
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
    expect(visit).toContain("🇺🇸 Visit from United States");
    expect(visit).toContain('width="16"');
    expect(visit).toContain('height="16"');
    expect(visit).toContain("size-4");
    expect(download).toContain("/activity/favicons/design-details.png");
    expect(download).toContain("Someone downloaded ");
    expect(download).toContain("Design Details");
    expect(download).toContain('href="https://designdetails.fm"');
    expect(unknown).not.toContain("/activity/favicons/");
    expect(unknown).toContain("🇺🇸 Visit from United States");
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
    expect(markup).toContain("M12 2C6.477 2 2 6.477 2 12c0 4.42");
    expect(markup).not.toContain("text-red-500");
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
      /text-primary[^>]*>Merged some-fix[\s\S]*href="https:\/\/github.com\/brianlovin\/briOS\/pull\/12"[^>]*>brianlovin\/briOS#12[\s\S]*font-mono[^>]*>2<[\s\S]*\+18[\s\S]*-3/,
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

    expect(markup).toContain("Someone liked Cursor");
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

    expect(markup).toContain("Someone liked Cursor");
    expect(markup).toContain(">Cursor<");
    expect(markup).not.toContain(">Stack<");
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
    expect(markup).toContain(">6<");
    expect(markup).not.toContain("> 6<");
    expect(markup).toContain("text-tertiary");
    expect(markup).toContain("font-mono");
    expect(markup).toContain("rounded-sm");
    expect(markup).toContain("border-secondary");
    expect(markup).toContain("tabular-nums");
    expect(markup).toContain("an AMA question");
    expect(markup).toContain('href="/ama"');
    expect(markup).not.toContain("2f2c711c-0ceb-810d-899d-e5feb99e70f4");
    expect(markup).toMatch(
      /text-primary[^>]*>🇺🇸 Visit from Spring Lake[\s\S]*href="\/ama"[^>]*>an AMA question[\s\S]*font-mono[^>]*>6</,
    );

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
    expect(pulsed).toContain("bg-secondary");
    expect(pulsed).toContain("duration-500");
    expect(quiet).not.toContain("data-rollup-pulse");
    expect(quiet).not.toContain("border-b");
    expect(quiet).not.toContain("border-secondary");
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

    expect(markup).toContain("🇮🇳 Visit from India");
    expect(markup).toContain("divide-y");
    expect(markup).toContain("divide-secondary");
    expect(markup).toContain("overflow-hidden");
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
