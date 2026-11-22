import { describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { resolve } from "path";

import { commentsForCache, hnPostLinks, processPost, selectHNPostsForDigest } from "@/lib/hn";
import { postWithoutComments } from "@/lib/hn-cache";
import { HackerNewsComment, HackerNewsPost } from "@/types/hackernews";

function makePost(overrides: Partial<HackerNewsPost> = {}): HackerNewsPost {
  return {
    id: 1,
    title: "Ask HN: Test",
    points: 10,
    user: "pg",
    time: 1_700_000_000,
    time_ago: "1 hour ago",
    type: "link",
    content: null,
    url: "https://example.com",
    domain: "example.com",
    comments_count: 0,
    ...overrides,
  };
}

function makeComment(overrides: Partial<HackerNewsComment> = {}): HackerNewsComment {
  return {
    id: 2,
    user: "alice",
    content: "<p>hello</p>",
    level: 0,
    comments: [],
    ...overrides,
  };
}

describe("processPost", () => {
  test("omits comments on a list projection so [] cannot mean stripped", () => {
    const post = processPost(makePost({ comments: [makeComment()], comments_count: 1 }), false);

    expect(post.comments).toBeUndefined();
    expect("comments" in post).toBe(false);
    expect(JSON.parse(JSON.stringify(post))).not.toHaveProperty("comments");
  });

  test("keeps an empty comments array after a detail fetch", () => {
    const post = processPost(makePost({ comments: [], comments_count: 0 }), true);

    expect(post.comments).toEqual([]);
  });

  test("treats missing comments as an empty thread on a detail fetch", () => {
    const post = processPost(makePost({ comments_count: 0 }), true);

    expect(post.comments).toEqual([]);
  });

  test("includes trimmed comments on a detail fetch", () => {
    const post = processPost(
      makePost({
        comments: [makeComment({ id: 3, content: "<p>hello</p>" })],
        comments_count: 1,
      }),
      true,
    );

    expect(post.comments).toHaveLength(1);
    expect(post.comments?.[0]?.id).toBe(3);
  });
});

describe("HN cache projection", () => {
  test("a comment-free payload projects to the same list post", () => {
    const raw = makePost({
      id: 9,
      title: "Cache me",
      points: 80,
      comments_count: 4,
      time: 1_700_000_100,
      content: "<p>body</p><script>alert(1)</script>",
      comments: [makeComment({ id: 3, content: "<p>thread</p>" })],
    });

    const fromCache = processPost(postWithoutComments(raw), false);
    const fromApi = processPost(raw, false);

    expect(fromCache).toEqual(fromApi);
    expect(fromCache).not.toHaveProperty("comments");
    expect(fromCache.points).toBe(80);
    expect(fromCache.comments_count).toBe(4);
    expect(fromCache.time).toBe(raw.time);
    expect(fromCache.type).toBe("link");
  });

  test("sidecar comments match a detail fetch, including the trim", () => {
    const deep = makeComment({
      id: 1,
      level: 0,
      comments: [makeComment({ id: 2, level: 4, content: "<p>dropped</p>" })],
    });
    const extra = Array.from({ length: 13 }, (_, index) =>
      makeComment({ id: 100 + index, level: 0, content: `<p>top ${index}</p>` }),
    );
    const raw = makePost({
      content: "<p>ask</p><script>alert(1)</script>",
      domain: null,
      url: "https://news.ycombinator.com/item?id=1",
      comments: [deep, ...extra],
      comments_count: 14,
    });

    const detail = processPost(raw, true);
    const fromCache = {
      ...processPost(postWithoutComments(raw), false),
      comments: commentsForCache(raw),
    };

    expect(detail).toEqual(fromCache);
    expect(fromCache.comments).toHaveLength(12);
    expect(fromCache.url).toBe("https://brianlovin.com/hn/1");
  });

  test("digest selection is unchanged when comments are removed", () => {
    const now = 1_800_000_000;
    const hour = 60 * 60;
    const raw = [
      makePost({
        id: 1,
        title: "lower",
        points: 10,
        time: now - hour,
        comments: [makeComment()],
        comments_count: 30,
      }),
      makePost({
        id: 2,
        title: "higher",
        points: 50,
        time: now - hour,
        comments: [makeComment({ id: 8 })],
        comments_count: 1,
      }),
      makePost({ id: 3, title: "job", points: 99, time: now - hour, type: "job" }),
    ];
    const fromCache = raw.map((post) => processPost(postWithoutComments(post), false));
    const fromApi = raw.map((post) => processPost(post, false));

    expect(selectHNPostsForDigest(fromCache, now).map((post) => post.id)).toEqual(
      selectHNPostsForDigest(fromApi, now).map((post) => post.id),
    );
    expect(selectHNPostsForDigest(fromCache, now).map((post) => post.id)).toEqual([2, 1]);
  });
});

describe("selectHNPostsForDigest", () => {
  const now = 1_800_000_000;
  const hour = 60 * 60;

  test("keeps only links from the last 24 hours, ranked by points", () => {
    const posts = [
      makePost({ id: 1, title: "old high score", points: 500, time: now - 25 * hour }),
      makePost({ id: 2, title: "yesterday's leftover", points: 400, time: now - 24 * hour }),
      makePost({ id: 3, title: "fresh mid", points: 80, time: now - 2 * hour }),
      makePost({ id: 4, title: "fresh high", points: 200, time: now - hour }),
      makePost({ id: 5, title: "fresh low", points: 10, time: now - 3 * hour }),
      makePost({ id: 6, title: "job", points: 999, time: now - hour, type: "job" }),
      makePost({ id: 7, title: "poll", points: 888, time: now - hour, type: "poll" }),
      null,
    ];

    const selected = selectHNPostsForDigest(posts, now);

    expect(selected.map((post) => post.id)).toEqual([4, 3, 5]);
    expect(selected.every((post) => post.type === "link")).toBe(true);
    expect(selected.every((post) => post.time > now - 24 * hour)).toBe(true);
  });

  test("returns the top 16 by points when more than 16 qualify", () => {
    const posts = Array.from({ length: 20 }, (_, index) =>
      makePost({
        id: index + 1,
        title: `story ${index + 1}`,
        points: index + 1,
        time: now - hour,
      }),
    );

    const selected = selectHNPostsForDigest(posts, now);

    expect(selected).toHaveLength(16);
    expect(selected[0]?.id).toBe(20);
    expect(selected[0]?.points).toBe(20);
    expect(selected[15]?.id).toBe(5);
    expect(selected[15]?.points).toBe(5);
    expect(selected.map((post) => post.points)).toEqual([
      20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5,
    ]);
  });

  test("treats missing points as zero when ranking", () => {
    const posts = [
      makePost({ id: 1, title: "no points", points: null, time: now - hour }),
      makePost({ id: 2, title: "has points", points: 1, time: now - hour }),
    ];

    expect(selectHNPostsForDigest(posts, now).map((post) => post.id)).toEqual([2, 1]);
  });
});

describe("hnPostLinks", () => {
  test("lists story titles and hrefs", () => {
    expect(hnPostLinks([makePost({ id: 42, title: "Show HN: Cache" })])).toEqual([
      { id: 42, title: "Show HN: Cache", href: "/hn/42" },
    ]);
  });
});

describe("getHNPostsForDigest cache", () => {
  test("is not wrapped in a dateless unstable_cache that can survive 24h", () => {
    const source = readFileSync(resolve(import.meta.dir, "hn.ts"), "utf8");

    expect(source).not.toMatch(/getHNPostsForDigest\s*=\s*unstable_cache/);
    expect(source).not.toMatch(/unstable_cache\([\s\S]*?,\s*\["hn:digest"\]/);
    expect(source).toMatch(/export async function getHNPostsForDigest/);
  });
});
