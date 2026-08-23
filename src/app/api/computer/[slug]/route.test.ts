import { afterEach, describe, expect, mock, spyOn, test } from "bun:test";

import * as computer from "@/lib/computer";

import { GET } from "./route";

describe("/api/computer/[slug]", () => {
  afterEach(() => {
    mock.restore();
  });

  test("resolves a tip by short id from the slug", async () => {
    const tip = {
      id: "tip-1",
      title: "Raycast",
      status: "Published",
      createdTime: "2026-08-01T00:00:00.000Z",
      shortId: "hwmX1CS",
      blocks: [],
    };
    const resolve = spyOn(computer, "resolveComputerTipFromSlug").mockResolvedValue(tip);

    const res = await GET(new Request("http://localhost/api/computer/old-title-hwmX1CS"), {
      params: Promise.resolve({ slug: "old-title-hwmX1CS" }),
    });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(tip);
    expect(resolve).toHaveBeenCalledWith("old-title-hwmX1CS");
  });

  test("returns 404 when the slug does not match a tip", async () => {
    spyOn(computer, "resolveComputerTipFromSlug").mockResolvedValue(null);

    const res = await GET(new Request("http://localhost/api/computer/missing-aaaaaaa"), {
      params: Promise.resolve({ slug: "missing-aaaaaaa" }),
    });

    expect(res.status).toBe(404);
  });
});
