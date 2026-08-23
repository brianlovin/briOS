import { afterEach, describe, expect, mock, spyOn, test } from "bun:test";

import * as notion from "@/lib/notion";

import { GET } from "./route";

describe("/api/computer", () => {
  afterEach(() => {
    mock.restore();
  });

  test("GET returns a Published list envelope", async () => {
    spyOn(notion, "getComputerDatabaseItems").mockResolvedValue([
      {
        id: "tip-1",
        title: "Raycast",
        status: "Published",
        createdTime: "2026-08-01T00:00:00.000Z",
        shortId: "hwmX1CS",
      },
      {
        id: "tip-2",
        title: "Missing short id",
        status: "Published",
        createdTime: "2026-08-01T00:00:00.000Z",
      },
    ]);

    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      items: [
        {
          id: "tip-1",
          title: "Raycast",
          status: "Published",
          createdTime: "2026-08-01T00:00:00.000Z",
          shortId: "hwmX1CS",
          href: "/computer/raycast-hwmX1CS",
        },
      ],
    });
  });
});
