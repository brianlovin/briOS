import { describe, expect, test } from "bun:test";

import {
  computerCanonicalPath,
  resolveCanonicalRedirect,
  writingCanonicalPath,
} from "@/lib/canonical-redirect";

const posts = [
  {
    slug: "give-your-agent-a-laboratory",
    title: "Give your agent a laboratory",
    shortId: "jH5ryjC",
  },
  { slug: "writing-better-self-reviews", title: "Writing better self reviews", shortId: "vZHSYlV" },
];

const tips = [
  { id: "2f1c0e3a-9b7d-4c1e-8a6f-0d2b3c4e5f60", title: "Capturing videos", shortId: "XlkCzYz" },
];

describe("writingCanonicalPath", () => {
  test("sends a legacy slug to its title and Short ID URL", () => {
    expect(writingCanonicalPath("give-your-agent-a-laboratory", posts)).toBe(
      "/writing/give-your-agent-a-laboratory-jH5ryjC",
    );
  });

  test("sends a legacy slug whose last word looks like a Short ID", () => {
    expect(writingCanonicalPath("writing-better-self-reviews", posts)).toBe(
      "/writing/writing-better-self-reviews-vZHSYlV",
    );
  });

  test("leaves canonical and Short ID URLs alone", () => {
    expect(writingCanonicalPath("give-your-agent-a-laboratory-jH5ryjC", posts)).toBeNull();
    expect(writingCanonicalPath("old-title-jH5ryjC", posts)).toBeNull();
  });

  test("leaves unknown slugs for the page to 404", () => {
    expect(writingCanonicalPath("does-not-exist", posts)).toBeNull();
  });
});

describe("computerCanonicalPath", () => {
  test("sends an outdated title to the current one", () => {
    expect(computerCanonicalPath("old-title-XlkCzYz", tips)).toBe(
      "/computer/capturing-videos-XlkCzYz",
    );
  });

  test("sends a Notion page ID to the canonical slug", () => {
    expect(computerCanonicalPath("2f1c0e3a9b7d4c1e8a6f0d2b3c4e5f60", tips)).toBe(
      "/computer/capturing-videos-XlkCzYz",
    );
  });

  test("leaves canonical and unknown slugs alone", () => {
    expect(computerCanonicalPath("capturing-videos-XlkCzYz", tips)).toBeNull();
    expect(computerCanonicalPath("missing-AAAAAAA", tips)).toBeNull();
  });
});

describe("resolveCanonicalRedirect", () => {
  test("only looks at writing and computer detail pages", async () => {
    expect(await resolveCanonicalRedirect("/writing")).toBeNull();
    expect(await resolveCanonicalRedirect("/writing/rss.xml")).toBeNull();
    expect(await resolveCanonicalRedirect("/til/some-entry-AAAAAAA")).toBeNull();
    expect(await resolveCanonicalRedirect("/writing/a/b")).toBeNull();
  });
});
