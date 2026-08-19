import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { BatchLikesProvider } from "@/components/likes/BatchLikesProvider";
import { LikeButton } from "@/components/likes/LikeButton";
import type { LikeCount } from "@/lib/hooks/useLikes";

function markup(initialLikes?: Record<string, LikeCount>) {
  return renderToStaticMarkup(
    <BatchLikesProvider pageIds={["page-1"]} initialData={initialLikes}>
      <LikeButton pageId="page-1" title="Cursor" href="/stack" contentType="stack" />
    </BatchLikesProvider>,
  );
}

describe("LikeButton first markup", () => {
  test("renders a provided initial count of 506", () => {
    expect(markup({ "page-1": { count: 506 } })).toContain("Current likes: 506");
  });

  test("does not render 0 when the count is unknown", () => {
    const html = markup();
    expect(html).not.toContain("Current likes: 0");
    expect(html).toContain('aria-label="Like this."');
  });

  test("renders an actual cached count of 0", () => {
    expect(markup({ "page-1": { count: 0 } })).toContain("Current likes: 0");
  });
});
