import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { BatchLikesProvider } from "@/components/likes/BatchLikesProvider";
import { LikeButton } from "@/components/likes/LikeButton";
import { BatchLikesContext, type LikeCount } from "@/lib/hooks/useLikes";

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

  test("stored viewer state fills the heart and count before batch", () => {
    const html = renderToStaticMarkup(
      <BatchLikesContext.Provider
        value={{
          counts: { "page-1": { count: 506 } },
          viewer: { "page-1": { count: 507, userLikes: 1 } },
        }}
      >
        <LikeButton pageId="page-1" title="Cursor" href="/stack" contentType="stack" />
      </BatchLikesContext.Provider>,
    );
    expect(html).toContain("Current likes: 507");
    expect(html).toContain("liked 1 times");
    expect(html).not.toContain("Current likes: 0");
  });

  test("live batch overlay wins over a stale stored viewer", () => {
    const html = renderToStaticMarkup(
      <BatchLikesContext.Provider
        value={{
          counts: { "page-1": { count: 506 } },
          viewer: { "page-1": { count: 510, userLikes: 2 } },
        }}
      >
        <LikeButton pageId="page-1" title="Cursor" href="/stack" contentType="stack" />
      </BatchLikesContext.Provider>,
    );
    expect(html).toContain("Current likes: 510");
    expect(html).toContain("liked 2 times");
    expect(html).not.toContain("Current likes: 507");
  });
});
