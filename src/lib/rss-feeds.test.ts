import { describe, expect, test } from "bun:test";
import type { Feed } from "feed";

import type { ProcessedBlock, RichTextContent } from "@/lib/notion";
import {
  buildAmaFeed,
  buildAppDissectionFeed,
  buildComputerFeed,
  buildGoodWebsitesFeed,
  buildStackFeed,
  buildTilFeed,
  buildWritingFeed,
} from "@/lib/rss-feeds";

const SITE = "https://brianlovin.com";

function text(content: string, options: { link?: string; bold?: boolean } = {}): RichTextContent {
  return {
    type: "text",
    text: { content, link: options.link },
    annotations: {
      bold: options.bold ?? false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: "default",
    },
  };
}

function paragraph(id: string, ...content: RichTextContent[]): ProcessedBlock {
  return { id, type: "paragraph", content };
}

const FIRST_PARAGRAPH = "Feed readers deserve the whole essay, not a teaser.";
const LATER_PARAGRAPH = "This sentence only appears deep in the body of the post.";

const POST_BLOCKS: ProcessedBlock[] = [
  paragraph("p1", text(FIRST_PARAGRAPH)),
  { id: "h1", type: "heading_2", content: [text("A section")] },
  paragraph(
    "p2",
    text("See "),
    text("the TIL", { link: "/til/wimp-wTlRhXi" }),
    text(" and "),
    text("Linear", { link: "https://linear.app" }),
    text("."),
  ),
  { id: "img", type: "image", url: "/img/screenshot.png" },
  { id: "li1", type: "bulleted_list_item", content: [text("First point")] },
  { id: "li2", type: "bulleted_list_item", content: [text("Second point")] },
  { id: "code", type: "code", language: "typescript", content: [text("if (a < b && c) {}")] },
  { id: "vid", type: "video", videoUrl: "https://videodelivery.net/abc/downloads/default.mp4" },
  paragraph("p3", text(LATER_PARAGRAPH)),
];

function rss(feed: Feed): string {
  return feed.rss2();
}

/** Every `content:encoded` body in document order. */
function bodies(xml: string): string[] {
  return [...xml.matchAll(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/g)].map(
    (match) => match[1],
  );
}

function urlsIn(html: string): string[] {
  return [...html.matchAll(/(?:href|src)="([^"]*)"/g)].map((match) => match[1]);
}

function expectAbsoluteUrls(html: string) {
  const urls = urlsIn(html);
  expect(urls.length).toBeGreaterThan(0);
  for (const url of urls) {
    expect(url).toMatch(/^(https?:\/\/|mailto:)/);
  }
}

describe("writing feed", () => {
  const xml = rss(
    buildWritingFeed([
      {
        item: {
          id: "post-1",
          title: "Full posts in RSS",
          slug: "full-posts",
          published: "2026-08-01",
          createdTime: "2026-08-01T00:00:00.000Z",
          shortId: "abc1234",
          excerpt: "Why the feed now carries everything.",
        },
        content: { blocks: POST_BLOCKS },
      },
    ]),
  );
  const [body] = bodies(xml);

  test("declares the content namespace", () => {
    expect(xml).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
  });

  test("includes the full post body, not just the first paragraph", () => {
    expect(body).toContain(FIRST_PARAGRAPH);
    expect(body).toContain(LATER_PARAGRAPH);
    expect(body).toContain("First point");
    expect(body).toContain("Second point");
    expect(body).toContain("if (a &lt; b &amp;&amp; c) {}");
  });

  test("keeps a short plain-text description", () => {
    expect(xml).toContain("<description><![CDATA[Why the feed now carries everything.]]>");
  });

  test("resolves internal links and images to absolute site URLs", () => {
    expect(urlsIn(body)).toContain(`${SITE}/til/wimp-wTlRhXi`);
    expect(urlsIn(body)).toContain(`${SITE}/img/screenshot.png`);
    expect(urlsIn(body)).toContain("https://linear.app/");
    expect(urlsIn(body)).toContain(`${SITE}/writing/full-posts-in-rss-abc1234`);
    expectAbsoluteUrls(body);
  });

  test("turns videos into links", () => {
    expect(body).toContain(
      '<a href="https://videodelivery.net/abc/downloads/default.mp4">Watch the video</a>',
    );
  });

  test("falls back to the excerpt when the body could not be fetched", () => {
    const [fallback] = bodies(
      rss(
        buildWritingFeed([
          {
            item: {
              id: "post-2",
              title: "Offline",
              slug: "offline",
              published: "2026-08-01",
              createdTime: "2026-08-01T00:00:00.000Z",
              shortId: "zzz9999",
              excerpt: "Excerpt only.",
            },
            content: null,
          },
        ]),
      ),
    );
    expect(fallback).toContain("Excerpt only.");
    expect(urlsIn(fallback)).toEqual([`${SITE}/writing/offline-zzz9999`]);
  });
});

describe("TIL feed", () => {
  test("includes every block of the entry", () => {
    const [body] = bodies(
      rss(
        buildTilFeed([
          {
            item: { id: "til-1", title: "WIMP", published: "2026-01-01", shortId: "wTlRhXi" },
            content: { blocks: POST_BLOCKS },
          },
        ]),
      ),
    );
    expect(body).toContain(FIRST_PARAGRAPH);
    expect(body).toContain(LATER_PARAGRAPH);
    expect(urlsIn(body)).toContain(`${SITE}/til/wimp-wTlRhXi`);
    expectAbsoluteUrls(body);
  });
});

describe("AMA feed", () => {
  test("includes the question details and the full answer", () => {
    const xml = rss(
      buildAmaFeed([
        {
          item: {
            id: "ama-1",
            title: "What do you use for notes?",
            description: "Asking for a friend & a coworker.",
            status: "Answered",
            answeredAt: "2026-01-01",
            createdAt: "2026-01-01",
          },
          content: { blocks: POST_BLOCKS },
        },
      ]),
    );
    const [body] = bodies(xml);
    expect(body).toContain("Asking for a friend &amp; a coworker.");
    expect(body).toContain(LATER_PARAGRAPH);
    expect(urlsIn(body)).toContain(`${SITE}/ama/ama-1`);
    expectAbsoluteUrls(body);
  });

  test("escapes plain-text descriptions as HTML", () => {
    const xml = rss(
      buildAmaFeed([
        {
          item: {
            id: "ama-2",
            title: "Link only",
            description: null,
            status: "Answered",
            answeredAt: "2026-01-01",
            createdAt: "2026-01-01",
          },
          content: {
            blocks: [paragraph("p", text("https://www.youtube.com/watch?v=1&feature=share"))],
          },
        },
      ]),
    );
    expect(xml).toContain(
      "<description><![CDATA[https://www.youtube.com/watch?v=1&amp;feature=share]]>",
    );
  });
});

describe("App Dissection feed", () => {
  test("includes the intro, every detail, and links to each detail video", () => {
    const [body] = bodies(
      rss(
        buildAppDissectionFeed([
          {
            item: {
              id: "ad-1",
              name: "Shorts",
              slug: "shorts",
              description: "",
              published: "2020-01-01",
              icon: "",
              status: "Published",
            },
            content: {
              introBlocks: [paragraph("intro", text(FIRST_PARAGRAPH))],
              details: [
                {
                  title: "Launch",
                  descriptionBlocks: [paragraph("d1", text(LATER_PARAGRAPH))],
                  video: {
                    type: "app-dissection-video",
                    orientation: "portrait",
                    urls: ["https://videodelivery.net/launch/downloads/default.mp4"],
                  },
                },
              ],
            },
          },
        ]),
      ),
    );
    expect(body).toContain(FIRST_PARAGRAPH);
    expect(body).toContain("<h2>Launch</h2>");
    expect(body).toContain(LATER_PARAGRAPH);
    expect(urlsIn(body)).toContain("https://videodelivery.net/launch/downloads/default.mp4");
    expect(urlsIn(body)).toContain(`${SITE}/app-dissection/shorts`);
    expectAbsoluteUrls(body);
  });
});

describe("Computer tips feed", () => {
  test("includes the full tip and links to the tip page", () => {
    const [body] = bodies(
      rss(
        buildComputerFeed([
          {
            item: {
              id: "tip-1",
              title: "Use a clipboard manager",
              status: "Published",
              createdTime: "2026-01-01T00:00:00.000Z",
              shortId: "tip1234",
            },
            content: { blocks: POST_BLOCKS },
          },
        ]),
      ),
    );
    expect(body).toContain(LATER_PARAGRAPH);
    expect(urlsIn(body)).toContain(`${SITE}/computer/use-a-clipboard-manager-tip1234`);
    expectAbsoluteUrls(body);
  });
});

describe("Stack feed", () => {
  test("includes the description, screenshot, platforms, and link", () => {
    const xml = rss(
      buildStackFeed([
        {
          id: "stack-1",
          name: "Linear",
          slug: "linear",
          description: "Issue tracking that stays out of the way.",
          url: "https://linear.app",
          platforms: ["Mac", "Web"],
          status: "Active",
          createdTime: "2026-01-01T00:00:00.000Z",
          previewImage: "https://images.example/linear.webp",
        },
      ]),
    );
    const [body] = bodies(xml);
    expect(body).toContain("Issue tracking that stays out of the way.");
    expect(body).toContain("Platforms: Mac, Web");
    expect(urlsIn(body)).toEqual([
      "https://linear.app/",
      "https://images.example/linear.webp",
      "https://linear.app/",
    ]);
    expect(xml).toContain("<description><![CDATA[Issue tracking that stays out of the way.]]>");
  });
});

describe("Good Websites feed", () => {
  test("includes the screenshot, the site link, tags, and X link", () => {
    const xml = rss(
      buildGoodWebsitesFeed([
        {
          id: "site-1",
          name: "UserJot",
          url: "https://userjot.com",
          x: "https://x.com/UserJotHQ",
          tags: ["Company", "SaaS"],
          previewImage: "https://images.example/userjot.webp",
          createdTime: "2026-01-01T00:00:00.000Z",
        },
      ]),
    );
    const [body] = bodies(xml);
    expect(body).toContain("Screenshot of UserJot");
    expect(body).toContain("Visit userjot.com");
    expect(body).toContain("Tags: Company, SaaS");
    expect(urlsIn(body)).toEqual([
      "https://userjot.com/",
      "https://images.example/userjot.webp",
      "https://userjot.com/",
      "https://x.com/UserJotHQ",
    ]);
    expect(xml).toContain("<description><![CDATA[userjot.com · Company, SaaS]]>");
  });
});
