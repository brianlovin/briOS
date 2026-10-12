import { APIErrorCode, APIResponseError } from "@notionhq/client";
import { afterEach, beforeEach, describe, expect, mock, spyOn, test } from "bun:test";

import { syncPageLikes } from "@/lib/likes-sync";
import { notion } from "@/lib/notion/client";

function page(properties: Record<string, unknown>, extra: Record<string, unknown> = {}) {
  return { object: "page", id: "page-1", properties, in_trash: false, url: "", ...extra };
}

const stackPage = page({
  Name: { type: "title", title: [] },
  Likes: { type: "number", number: 4 },
});

const tipsPage = page({
  Name: { type: "title", title: [] },
  Status: { type: "status", status: null },
  "Short ID": { type: "rich_text", rich_text: [] },
});

function notionError(code: APIErrorCode, status: number) {
  return new APIResponseError({
    code,
    status,
    message: code,
    headers: new Headers(),
    rawBodyText: "",
    additional_data: undefined,
    request_id: undefined,
  });
}

let retrieve: ReturnType<typeof spyOn>;
let update: ReturnType<typeof spyOn>;

beforeEach(() => {
  retrieve = spyOn(notion.pages, "retrieve").mockResolvedValue(stackPage as never);
  update = spyOn(notion.pages, "update").mockResolvedValue({} as never);
});

afterEach(() => {
  mock.restore();
});

describe("syncPageLikes", () => {
  test("writes the Redis count to Likes when it changed", async () => {
    expect(await syncPageLikes("page-1", 7)).toEqual({ status: "synced" });
    expect(update).toHaveBeenCalledWith({
      page_id: "page-1",
      properties: { Likes: { number: 7 } },
    });
  });

  test("skips the write when Notion already has the count", async () => {
    expect(await syncPageLikes("page-1", 4)).toEqual({ status: "unchanged" });
    expect(update).not.toHaveBeenCalled();
  });

  test("skips pages whose database has no Likes property (Tips)", async () => {
    retrieve.mockResolvedValue(tipsPage as never);
    expect(await syncPageLikes("page-1", 3)).toEqual({
      status: "skipped",
      reason: "no_likes_property",
    });
    expect(update).not.toHaveBeenCalled();
  });

  test("skips pages where Likes is not a number", async () => {
    retrieve.mockResolvedValue(page({ Likes: { type: "rich_text", rich_text: [] } }) as never);
    expect(await syncPageLikes("page-1", 3)).toEqual({
      status: "skipped",
      reason: "no_likes_property",
    });
    expect(update).not.toHaveBeenCalled();
  });

  test("skips deleted or unshared pages", async () => {
    retrieve.mockRejectedValue(notionError(APIErrorCode.ObjectNotFound, 404));
    expect(await syncPageLikes("page-1", 3)).toEqual({
      status: "skipped",
      reason: "page_not_found",
    });
    expect(update).not.toHaveBeenCalled();
  });

  test("skips trashed pages", async () => {
    retrieve.mockResolvedValue({ ...stackPage, in_trash: true } as never);
    expect(await syncPageLikes("page-1", 3)).toEqual({ status: "skipped", reason: "archived" });
    expect(update).not.toHaveBeenCalled();
  });

  test("reports other Notion errors as failures", async () => {
    const error = notionError(APIErrorCode.InternalServerError, 500);
    update.mockRejectedValue(error);
    expect(await syncPageLikes("page-1", 9)).toEqual({ status: "failed", error });
  });
});
