import { describe, expect, test } from "bun:test";

import { type DesignDetailsEpisode, designDetailsEpisodeLinks } from "@/lib/design-details";

function episode(
  overrides: Partial<DesignDetailsEpisode> & Pick<DesignDetailsEpisode, "id" | "title">,
): DesignDetailsEpisode {
  return {
    slug: overrides.slug ?? overrides.id,
    ...overrides,
  };
}

describe("designDetailsEpisodeLinks", () => {
  test("lists episode titles and hrefs", () => {
    expect(
      designDetailsEpisodeLinks([
        episode({ id: "ep-1", title: "101: Designing at Notion", slug: "101" }),
        episode({ id: "ep-2", title: "102: Cache busting", slug: "102" }),
      ]),
    ).toEqual([
      { id: "ep-1", title: "101: Designing at Notion", href: "/design-details/ep-1" },
      { id: "ep-2", title: "102: Cache busting", href: "/design-details/ep-2" },
    ]);
  });
});
