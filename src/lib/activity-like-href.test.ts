import { describe, expect, mock, test } from "bun:test";

import { resolveTrustedLikeHref } from "@/lib/activity-like-href";

const STACK_ID = "1a2b3c4d-0000-0000-0000-000000000001";

function deps() {
  const listExternalItems = mock(async () => [
    { id: STACK_ID, url: "https://1password.com" },
    { id: "site-without-url", url: null },
  ]);
  return { listExternalItems };
}

describe("resolveTrustedLikeHref", () => {
  test("keeps same-site paths without looking anything up", async () => {
    const d = deps();
    expect(await resolveTrustedLikeHref("page-1", "/writing/hello", d)).toBe("/writing/hello");
    expect(d.listExternalItems).not.toHaveBeenCalled();
  });

  test("replaces a client-supplied external URL with the liked item's own URL", async () => {
    const href = await resolveTrustedLikeHref(STACK_ID, "https://attacker.example/x", deps());
    expect(href).toBe("https://1password.com");
  });

  test("matches page ids with or without dashes", async () => {
    const href = await resolveTrustedLikeHref(
      STACK_ID.replace(/-/g, ""),
      "https://1password.com",
      deps(),
    );
    expect(href).toBe("https://1password.com");
  });

  test("drops external URLs for ids that are not a stack or site item", async () => {
    expect(await resolveTrustedLikeHref("random-id", "https://attacker.example/x", deps())).toBe(
      null,
    );
    expect(
      await resolveTrustedLikeHref("site-without-url", "https://attacker.example/x", deps()),
    ).toBe(null);
  });

  test("drops protocol-relative and scheme hrefs", async () => {
    expect(await resolveTrustedLikeHref(STACK_ID, "//attacker.example/x", deps())).toBe(null);
    expect(await resolveTrustedLikeHref(STACK_ID, "javascript:alert(1)", deps())).toBe(null);
  });
});
