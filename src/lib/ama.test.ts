import { describe, expect, test } from "bun:test";

import { type AmaQuestion, amaQuestionLinks } from "@/lib/ama";

function question(
  overrides: Partial<AmaQuestion> & Pick<AmaQuestion, "id" | "title">,
): AmaQuestion {
  return {
    description: null,
    status: "answered",
    answeredAt: "2026-08-01",
    createdAt: "2026-08-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("amaQuestionLinks", () => {
  test("lists question titles and hrefs", () => {
    expect(
      amaQuestionLinks([
        question({ id: "abc", title: "How do you cache Notion lists?" }),
        question({ id: "def", title: "What about likes?" }),
      ]),
    ).toEqual([
      { id: "abc", title: "How do you cache Notion lists?", href: "/ama/abc" },
      { id: "def", title: "What about likes?", href: "/ama/def" },
    ]);
  });
});
