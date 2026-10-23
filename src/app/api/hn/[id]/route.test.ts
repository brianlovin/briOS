import * as botid from "botid/server";
import { afterEach, beforeEach, describe, expect, mock, spyOn, test } from "bun:test";

import { installAxiomMock } from "@/lib/axiom-test-utils";

const axiomMock = installAxiomMock();

import { GET } from "@/app/api/hn/[id]/route";
import * as hn from "@/lib/hn";

const BOT = { isHuman: false, isBot: true, isVerifiedBot: false, bypassed: false };
const HUMAN = { isHuman: true, isBot: false, isVerifiedBot: false, bypassed: false };

function hnRequest() {
  return new Request("https://brianlovin.com/api/hn/45964359");
}

const params = { params: Promise.resolve({ id: "45964359" }) };

let getPostById: ReturnType<typeof spyOn>;

beforeEach(() => {
  axiomMock.enable();
  getPostById = spyOn(hn, "getPostById").mockResolvedValue({ id: "45964359" } as never);
});

afterEach(() => {
  axiomMock.disable();
  mock.restore();
});

describe("GET /api/hn/[id]", () => {
  test("denies a bot without sending anything to Axiom", async () => {
    spyOn(botid, "checkBotId").mockResolvedValue(BOT as never);

    const res = await GET(hnRequest(), params);

    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "Access denied" });
    expect(getPostById).not.toHaveBeenCalled();
    expect(axiomMock.events()).toEqual([]);
  });

  test("serves the post to a browser that passed BotID", async () => {
    spyOn(botid, "checkBotId").mockResolvedValue(HUMAN as never);

    const res = await GET(hnRequest(), params);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ id: "45964359" });
  });

  test("still reports real failures as failed requests", async () => {
    spyOn(botid, "checkBotId").mockResolvedValue(HUMAN as never);
    getPostById.mockRejectedValue(new Error("HN down"));

    const res = await GET(hnRequest(), params);

    expect(res.status).toBe(500);
    expect(axiomMock.events("api.request")).toEqual([
      expect.objectContaining({ route: "/api/hn/[id]", status: 500 }),
    ]);
  });
});
