import { describe, expect, test } from "bun:test";

import { type RecentlyPlayedItem, recentUniqueItems, toPacificDateString } from "./sync-utils";

function makeItem(id: string, playedAt: string): RecentlyPlayedItem {
  return {
    track: {
      id,
      name: "foo",
      artists: [{ name: "a" }],
      album: { name: "x", images: [] },
      duration_ms: 0,
      popularity: 0,
      explicit: false,
      external_urls: { spotify: "" },
    },
    played_at: playedAt,
  };
}

describe("toPacificDateString", () => {
  test("converts a UTC instant to its Pacific calendar date", () => {
    // 2023-12-15T08:00:00Z is Dec 15 2023 at midnight PST (UTC-8)
    expect(toPacificDateString("2023-12-15T08:00:00Z")).toBe("2023-12-15");
  });

  test("late-night UTC rolls back to the previous Pacific day", () => {
    // 2023-12-15T05:00:00Z is Dec 14 2023 at 21:00 PST
    expect(toPacificDateString("2023-12-15T05:00:00Z")).toBe("2023-12-14");
  });
});

describe("recentUniqueItems", () => {
  test("filters out items older than the lookback window", () => {
    const now = Date.now();
    const iso = (ms: number) => new Date(ms).toISOString();

    const items = [
      makeItem("1", iso(now - 1000)), // within window
      makeItem("2", iso(now - 7 * 60 * 60 * 1000)), // 7h ago, outside 6h window
    ];

    const result = recentUniqueItems(items);
    expect(result.map((i) => i.track.id)).toEqual(["1"]);
  });

  test("de-duplicates identical trackId + played_at", () => {
    const now = Date.now();
    const iso = (ms: number) => new Date(ms).toISOString();
    const playedAt = iso(now - 1000);

    const items = [makeItem("1", playedAt), makeItem("1", playedAt)];
    expect(recentUniqueItems(items)).toHaveLength(1);
  });

  test("keeps the same track at different play times", () => {
    const now = Date.now();
    const iso = (ms: number) => new Date(ms).toISOString();

    const items = [makeItem("1", iso(now - 1000)), makeItem("1", iso(now - 2000))];
    expect(recentUniqueItems(items)).toHaveLength(2);
  });
});
