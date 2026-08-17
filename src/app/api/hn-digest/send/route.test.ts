import { describe, expect, test } from "bun:test";

import { dynamic, revalidate } from "@/app/api/hn-digest/send/route";

describe("GET /api/hn-digest/send", () => {
  test("is force-dynamic so the cron response is never cached across days", () => {
    expect(dynamic).toBe("force-dynamic");
    expect(revalidate).toBe(0);
  });
});
