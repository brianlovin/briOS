import { describe, expect, test } from "bun:test";

import { toDigestPost, toDigestPosts } from "@/lib/digest";
import { HackerNewsComment, HackerNewsPost } from "@/types/hackernews";

function makePost(overrides: Partial<HackerNewsPost> = {}): HackerNewsPost {
  return {
    id: 42,
    title: "Show HN: Digest",
    points: 99,
    user: "pg",
    time: 1_700_000_000,
    time_ago: "1 hour ago",
    type: "link",
    content: "<p>body</p>",
    url: "https://example.com",
    domain: "example.com",
    comments_count: 7,
    ...overrides,
  };
}

function makeComment(overrides: Partial<HackerNewsComment> = {}): HackerNewsComment {
  return {
    id: 99,
    user: "alice",
    content: "<p>hello</p>",
    level: 0,
    comments: [],
    ...overrides,
  };
}

describe("toDigestPost", () => {
  test("maps a list post that has no comments key", () => {
    const listPost = makePost();
    delete listPost.comments;

    const digest = toDigestPost(listPost);

    expect(digest).toEqual({
      id: 42,
      title: "Show HN: Digest",
      url: "https://example.com",
      domain: "example.com",
      comments_count: 7,
    });
    expect(digest).not.toHaveProperty("comments");
    expect(digest).not.toHaveProperty("content");
    expect(digest).not.toHaveProperty("points");
  });

  test("drops comments and other thread fields from a detail post", () => {
    const detailPost = makePost({
      comments: [makeComment()],
      comments_count: 1,
    });

    const digest = toDigestPost(detailPost);

    expect(digest.comments_count).toBe(1);
    expect(digest).not.toHaveProperty("comments");
    expect(JSON.parse(JSON.stringify(digest))).not.toHaveProperty("comments");
  });
});

describe("toDigestPosts", () => {
  test("maps a list of posts without requiring comments", () => {
    const posts = [makePost({ id: 1 }), makePost({ id: 2, comments_count: 0 })];
    for (const post of posts) {
      delete post.comments;
    }

    const digest = toDigestPosts(posts);

    expect(digest).toHaveLength(2);
    expect(digest[0]?.id).toBe(1);
    expect(digest[1]?.comments_count).toBe(0);
    expect(digest.every((post) => !("comments" in post))).toBe(true);
  });
});
