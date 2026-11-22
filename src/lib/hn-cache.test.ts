import { describe, expect, test } from "bun:test";

import {
  clearHnCache,
  getCachedComments,
  getCachedPost,
  getCachedPosts,
  HN_CACHE_CHUNK_SIZE,
  HN_CACHE_TTL_SECONDS,
  HN_COMMENTS_CACHE_MAX_BYTES,
  type HnCacheRedis,
  postWithoutComments,
  setCachedComments,
  setCachedPost,
  setCachedPosts,
} from "@/lib/hn-cache";
import { HackerNewsComment, HackerNewsPost } from "@/types/hackernews";

function createFakeHnRedis(init?: {
  keys?: string[];
}): HnCacheRedis & { keys: () => string[]; scans: string[] } {
  const store = new Set(init?.keys ?? []);
  const scans: string[] = [];

  return {
    scans,
    keys() {
      return [...store];
    },
    async del(...keys: string[]) {
      let removed = 0;
      for (const key of keys) {
        if (store.delete(key)) removed += 1;
      }
      return removed;
    },
    async scan(_cursor: string, opts: { match: string; count: number }) {
      scans.push(opts.match);
      const prefix = opts.match.endsWith("*") ? opts.match.slice(0, -1) : opts.match;
      const matched = [...store].filter((key) => key.startsWith(prefix));
      return ["0", matched];
    },
  };
}

describe("clearHnCache", () => {
  test("returns 0 when Redis is not configured", async () => {
    await expect(clearHnCache(null)).resolves.toBe(0);
  });

  test("deletes legacy keys, v2 posts, and comment sidecars", async () => {
    const client = createFakeHnRedis({
      keys: ["hn:top_ids", "hn:post:1", "hn:post:v2:2", "hn:post:v2:2:comments", "other:keep"],
    });

    await expect(clearHnCache(client)).resolves.toBe(4);
    expect(client.keys().sort()).toEqual(["other:keep"]);
    expect(client.scans).toEqual(["hn:post:*"]);
  });

  test("still deletes scanned post keys when top-ids is already missing", async () => {
    const client = createFakeHnRedis({
      keys: ["hn:post:99", "hn:post:v2:100:comments"],
    });

    await expect(clearHnCache(client)).resolves.toBe(2);
    expect(client.keys()).toEqual([]);
  });
});

function makePost(id: number, comments?: HackerNewsComment[]): HackerNewsPost {
  return {
    id,
    title: `Post ${id}`,
    points: id,
    user: "pg",
    time: 1_700_000_000,
    time_ago: "1 hour ago",
    type: "link",
    content: null,
    url: "https://example.com",
    domain: "example.com",
    comments_count: comments?.length ?? 0,
    ...(comments ? { comments } : {}),
  };
}

function makeComment(content = "<p>hello</p>"): HackerNewsComment {
  return { id: 2, user: "alice", content, level: 0, comments: [] };
}

type Stored = { value: unknown; ex?: number };

function createPostRedis(options?: { failMgetOnCall?: number; failExecOnCall?: number }) {
  const store = new Map<string, Stored>();
  const mgets: string[][] = [];
  const gets: string[] = [];
  const pipelines: string[][] = [];
  let execCalls = 0;

  const client = {
    async get<T>(key: string): Promise<T | null> {
      gets.push(key);
      const hit = store.get(key);
      return (hit ? hit.value : null) as T | null;
    },
    async set(key: string, value: unknown, opts?: { ex: number }) {
      store.set(key, { value, ex: opts?.ex });
      return "OK";
    },
    async mget<T extends unknown[]>(...keys: string[]): Promise<T> {
      mgets.push([...keys]);
      if (options?.failMgetOnCall === mgets.length) {
        throw new Error("max request size exceeded");
      }
      return keys.map((key) => store.get(key)?.value ?? null) as T;
    },
    pipeline() {
      const ops: { key: string; value: unknown; ex?: number }[] = [];
      return {
        set(key: string, value: unknown, opts?: { ex: number }) {
          ops.push({ key, value, ex: opts?.ex });
          return this;
        },
        async exec() {
          execCalls += 1;
          if (options?.failExecOnCall === execCalls) {
            throw new Error("max request size exceeded");
          }
          const keys: string[] = [];
          for (const op of ops) {
            store.set(op.key, {
              value: JSON.parse(JSON.stringify(op.value)) as unknown,
              ex: op.ex,
            });
            keys.push(op.key);
          }
          pipelines.push(keys);
          return [];
        },
      };
    },
  };

  return { client, store, mgets, gets, pipelines };
}

describe("postWithoutComments", () => {
  test("drops the comments key and leaves the input post unchanged", () => {
    const comments = [makeComment()];
    const post = makePost(1, comments);

    const stored = postWithoutComments(post);

    expect(stored).not.toHaveProperty("comments");
    expect(post.comments).toBe(comments);
    expect(stored.comments_count).toBe(1);
    expect(stored.title).toBe("Post 1");
  });
});

describe("getCachedPosts", () => {
  test("returns an empty map without calling Redis when there is nothing to read", async () => {
    const redis = createPostRedis();

    await expect(getCachedPosts([], redis.client)).resolves.toEqual(new Map());
    await expect(getCachedPosts(["1"], null)).resolves.toEqual(new Map());
    expect(redis.mgets).toEqual([]);
  });

  test("MGETs comment-free v2 keys in chunks and keeps hits in order", async () => {
    const redis = createPostRedis();
    const count = HN_CACHE_CHUNK_SIZE * 2 + 3;
    const ids = Array.from({ length: count }, (_, index) => String(index + 1));
    for (const id of ids) {
      redis.store.set(`hn:post:v2:${id}`, { value: makePost(Number(id)) });
    }
    redis.store.set("hn:post:v2:2", {
      value: makePost(2, [makeComment("x".repeat(5000))]),
    });

    const result = await getCachedPosts(ids, redis.client);

    expect(redis.mgets.map((keys) => keys.length)).toEqual([
      HN_CACHE_CHUNK_SIZE,
      HN_CACHE_CHUNK_SIZE,
      3,
    ]);
    expect(redis.mgets.flat().every((key) => key.startsWith("hn:post:v2:"))).toBe(true);
    expect(redis.mgets.flat().some((key) => key.endsWith(":comments"))).toBe(false);
    expect(result.get("1")?.title).toBe("Post 1");
    expect(result.get("2")).not.toHaveProperty("comments");
    expect(result.get("2")?.comments_count).toBe(1);
    expect(result.get(String(count))?.id).toBe(count);
  });

  test("does not read legacy hn:post:{id} values", async () => {
    const redis = createPostRedis();
    redis.store.set("hn:post:1", { value: makePost(1, [makeComment()]) });

    const result = await getCachedPosts(["1"], redis.client);
    const single = await getCachedPost("1", redis.client);

    expect(result.get("1")).toBeNull();
    expect(single).toBeNull();
    expect(redis.mgets).toEqual([["hn:post:v2:1"]]);
    expect(redis.gets).toEqual(["hn:post:v2:1"]);
  });

  test("keeps successful chunks when a later MGET fails", async () => {
    const redis = createPostRedis({ failMgetOnCall: 2 });
    const ids = Array.from({ length: HN_CACHE_CHUNK_SIZE + 1 }, (_, index) => String(index + 1));
    for (const id of ids) {
      redis.store.set(`hn:post:v2:${id}`, { value: makePost(Number(id)) });
    }

    const result = await getCachedPosts(ids, redis.client);

    expect(result.size).toBe(HN_CACHE_CHUNK_SIZE);
    expect(result.get("1")?.id).toBe(1);
    expect(result.has(String(HN_CACHE_CHUNK_SIZE + 1))).toBe(false);
  });

  test("treats a non-post value as a miss", async () => {
    const redis = createPostRedis();
    redis.store.set("hn:post:v2:1", { value: { nope: true } });

    const result = await getCachedPosts(["1"], redis.client);

    expect(result.get("1")).toBeNull();
  });
});

describe("setCachedPosts", () => {
  test("writes comment-free posts in TTL'd chunks and does not mutate inputs", async () => {
    const redis = createPostRedis();
    const count = HN_CACHE_CHUNK_SIZE + 1;
    const posts = new Map<string, HackerNewsPost>();
    for (let id = 1; id <= count; id += 1) {
      posts.set(String(id), makePost(id, [makeComment()]));
    }

    await setCachedPosts(posts, redis.client);

    expect(redis.pipelines.map((keys) => keys.length)).toEqual([HN_CACHE_CHUNK_SIZE, 1]);
    const stored = redis.store.get("hn:post:v2:1");
    expect(stored?.ex).toBe(HN_CACHE_TTL_SECONDS);
    expect(HN_CACHE_TTL_SECONDS).toBe(3600);
    expect(stored?.value).not.toHaveProperty("comments");
    expect(posts.get("1")?.comments).toHaveLength(1);
    expect([...redis.store.keys()].every((key) => !key.endsWith(":comments"))).toBe(true);
  });

  test("keeps earlier chunks when a later pipeline fails", async () => {
    const redis = createPostRedis({ failExecOnCall: 2 });
    const posts = new Map<string, HackerNewsPost>();
    for (let id = 1; id <= HN_CACHE_CHUNK_SIZE + 1; id += 1) {
      posts.set(String(id), makePost(id));
    }

    await expect(setCachedPosts(posts, redis.client)).resolves.toBeUndefined();
    expect(redis.store.size).toBe(HN_CACHE_CHUNK_SIZE);
    expect(redis.store.has("hn:post:v2:1")).toBe(true);
    expect(redis.store.has(`hn:post:v2:${HN_CACHE_CHUNK_SIZE + 1}`)).toBe(false);
  });

  test("single-post writes use the same comment-free key and TTL", async () => {
    const redis = createPostRedis();

    await setCachedPost("7", makePost(7, [makeComment()]), redis.client);

    const stored = redis.store.get("hn:post:v2:7");
    expect(stored?.ex).toBe(3600);
    expect(stored?.value).not.toHaveProperty("comments");
    const read = await getCachedPost("7", redis.client);
    expect(read?.id).toBe(7);
    expect(read).not.toHaveProperty("comments");
    expect(redis.gets).toEqual(["hn:post:v2:7"]);
  });
});

describe("comment sidecars", () => {
  test("chunks comment writes onto keys the post MGET never reads", async () => {
    const redis = createPostRedis();
    const comments = new Map<string, HackerNewsComment[]>();
    for (let id = 1; id <= HN_CACHE_CHUNK_SIZE + 1; id += 1) {
      comments.set(String(id), id === 1 ? [] : [makeComment()]);
    }

    await setCachedComments(comments, redis.client);

    expect(redis.pipelines.map((keys) => keys.length)).toEqual([HN_CACHE_CHUNK_SIZE, 1]);
    expect(redis.pipelines.flat().every((key) => key.endsWith(":comments"))).toBe(true);
    expect(redis.store.get("hn:post:v2:1:comments")).toEqual({ value: [], ex: 3600 });
    expect(redis.store.get("hn:post:v2:2:comments")?.value).toEqual([makeComment()]);

    expect(await getCachedComments("1", redis.client)).toEqual([]);
    expect(await getCachedComments("missing", redis.client)).toBeNull();
    expect(redis.gets).toEqual(["hn:post:v2:1:comments", "hn:post:v2:missing:comments"]);
  });

  test("skips a comments payload over the per-key cap and still stores the rest", async () => {
    const redis = createPostRedis();
    const overhead = new TextEncoder().encode(JSON.stringify([makeComment("")])).length;
    const atCap = "a".repeat(HN_COMMENTS_CACHE_MAX_BYTES - overhead);
    const over = "b".repeat(HN_COMMENTS_CACHE_MAX_BYTES - overhead + 1);

    await setCachedComments(
      new Map([
        ["1", [makeComment(atCap)]],
        ["2", [makeComment(over)]],
        ["3", [makeComment("ok")]],
      ]),
      redis.client,
    );

    expect(redis.store.has("hn:post:v2:1:comments")).toBe(true);
    expect(redis.store.has("hn:post:v2:2:comments")).toBe(false);
    expect(redis.store.get("hn:post:v2:3:comments")?.value).toEqual([makeComment("ok")]);
  });

  test("treats a non-array sidecar as a miss", async () => {
    const redis = createPostRedis();
    redis.store.set("hn:post:v2:4:comments", { value: { comments: [] } });

    await expect(getCachedComments("4", redis.client)).resolves.toBeNull();
  });
});
