import { describe, expect, test } from "bun:test";

import { serializeJsonLd } from "@/lib/json-ld";

describe("serializeJsonLd", () => {
  test("cannot close the surrounding script tag", () => {
    const data = { headline: "</script><script>alert(1)</script>" };
    const out = serializeJsonLd(data);
    expect(out).not.toContain("</script>");
    expect(JSON.parse(out)).toEqual(data);
  });
});
