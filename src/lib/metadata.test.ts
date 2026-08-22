import { describe, expect, test } from "bun:test";

import { createMetadata, createPersonJsonLd, SITE_CONFIG } from "@/lib/metadata";

describe("createMetadata", () => {
  test("builds the canonical url from the path", () => {
    const meta = createMetadata({ path: "/writing/hello" });
    expect(meta.alternates?.canonical).toBe(`${SITE_CONFIG.url}/writing/hello`);
  });

  test("uses a trailing slash canonical for the homepage", () => {
    const meta = createMetadata({ path: "/" });
    expect(meta.alternates?.canonical).toBe(`${SITE_CONFIG.url}/`);
  });

  test("keeps an explicit canonical override for HN", () => {
    const meta = createMetadata({
      path: "/hn",
      canonical: "https://news.ycombinator.com",
    });
    expect(meta.alternates?.canonical).toBe("https://news.ycombinator.com");
  });
});

describe("createPersonJsonLd", () => {
  test("describes a person, not a company contact page", () => {
    const jsonLd = createPersonJsonLd();
    expect(jsonLd["@type"]).toBe("Person");
    expect(jsonLd.name).toBe(SITE_CONFIG.author.name);
    expect(jsonLd).not.toHaveProperty("contactPoint");
    expect(jsonLd).not.toHaveProperty("address");
    expect(jsonLd).not.toHaveProperty("telephone");
  });
});
