import { describe, expect, test } from "bun:test";

import { processPost } from "@/lib/hn";
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
